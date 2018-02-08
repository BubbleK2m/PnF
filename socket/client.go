package socket

import (
	"encoding/json"
	"io"
	"sync"

	"github.com/DSMdongly/pnf/app"
	"github.com/DSMdongly/pnf/app/model"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn   *websocket.Conn
	Data   map[string](interface{})
	Input  chan Message
	Output chan Message
}

func NewClient(con *websocket.Conn) *Client {
	return &Client{
		Conn:   con,
		Data:   make(map[string](interface{})),
		Input:  make(chan Message),
		Output: make(chan Message),
	}
}

func (cli *Client) Handle() {
	wg := sync.WaitGroup{}

	go cli.Read(&wg)
	go cli.Process(&wg)
	go cli.Write(&wg)

	wg.Wait()
}

func (cli *Client) Close() {
	cli.Conn.Close()

	if cli.Data["id"] == nil {
		return
	}

	if cli.Data["room"] != nil {
		id := cli.Data["id"].(string)
		rom := Rooms[cli.Data["room"].(string)]

		rom.Quit(cli)

		if id == rom.Data["master"].(string) {
			rom.ForEach(func(cli *Client) {
				if id != cli.Data["id"].(string) {
					cli.Output <- KickMemberReport(cli.Data["id"].(string))
					rom.Quit(cli)
				}
			})

			delete(Rooms, rom.Data["id"].(string))
		} else {
			rom.MultiCast(QuitRoomReport(id), func(cli *Client) bool {
				return id != cli.Data["id"].(string)
			})
		}

		BroadCast(UpdateRoomReport(rom.Data["id"].(string), len(rom.Clients)), func(mem *Client) bool {
			return mem.Data["room"] == nil
		})
	}

	delete(Clients, cli.Data["id"].(string))
}

func (cli *Client) Read(wg *sync.WaitGroup) {
	defer func() {
		close(cli.Input)
		wg.Done()
	}()

	wg.Add(1)

	for {
		msg := Message{}

		_, byts, err := cli.Conn.ReadMessage()

		if err != nil {
			app.Echo.Logger.Error(err)
			break
		}

		if err = json.Unmarshal(byts, &msg); err != nil {
			app.Echo.Logger.Error(err)
			break
		}

		app.Echo.Logger.Infof("received message %v", msg)

		cli.Input <- msg
	}
}

func (cli *Client) Process(wg *sync.WaitGroup) {
	defer func() {
		close(cli.Output)
		wg.Done()
	}()

	wg.Add(1)

	for inp := range cli.Input {
		switch inp.Head {
		case "auth.login.request":
			{
				id, pw := inp.Body["id"].(string), inp.Body["pw"].(string)

				usr := model.User{}
				err := model.DB.Where("id = ? AND pw = ?", id, pw).First(&usr).Error

				if err != nil {
					app.Echo.Logger.Error(err)
				}

				if err != nil || Clients[id] != nil {
					cli.Output <- LoginResponse(false)
					break
				}

				cli.Data["id"] = id
				Clients[id] = cli

				cli.Output <- LoginResponse(true)
			}
		case "auth.register.request":
			{
				id, pw := inp.Body["id"].(string), inp.Body["pw"].(string)

				usr := model.User{id, pw}
				err := model.DB.Create(&usr).Error

				if err != nil {
					app.Echo.Logger.Error(err)
					cli.Output <- RegisterResponse(false)

					break
				}

				cli.Output <- RegisterResponse(true)
			}
		case "auth.check.request":
			{
				id := inp.Body["id"].(string)

				db := model.DB
				usr := model.User{}

				err := db.Where("id = ?", id).First(&usr).Error

				if err != nil {
					app.Echo.Logger.Error(err)
					cli.Output <- CheckResponse(false)

					break
				}

				cli.Output <- CheckResponse(true)
			}
		case "room.create.request":
			{
				nme := inp.Body["name"].(string)

				rom := NewRoom(nme)
				rom.Join(cli, true)

				rom.Data["master"] = cli.Data["id"].(string)
				rom.Data["playing"] = false

				Rooms[rom.Data["id"].(string)] = rom

				cli.Output <- CreateRoomResponse(true)

				BroadCast(CreateRoomReport(rom.Data["id"].(string), rom.Data["name"].(string), len(rom.Clients)), func(mem *Client) bool {
					return mem.Data["room"] == nil
				})
			}
		case "room.list.request":
			{
				roms := make(map[string](interface{}))

				for id, rom := range Rooms {
					inf := make(map[string](interface{}))

					inf["name"] = rom.Data["name"].(string)
					inf["isPlaying"] = rom.Data["playing"].(bool)
					inf["memberCnt"] = len(rom.Clients)

					roms[id] = inf
				}

				cli.Output <- RoomListResponse(true, roms)
			}
		case "room.join.request":
			{
				rom := Rooms[inp.Body["room"].(string)]

				if rom == nil {
					cli.Output <- JoinRoomResponse(false, nil)
					break
				}

				mems := make(map[string](interface{}))

				rom.Join(cli, false)

				for id, cli := range rom.Clients {
					inf := make(map[string](interface{}))

					inf["isMaster"] = (id == rom.Data["master"].(string))
					inf["isReady"] = cli.Data["ready"].(bool)
					inf["currentCharacter"] = cli.Data["character"].(int)

					mems[id] = inf
				}

				rom.MultiCast(JoinMemberReport(cli.Data["id"].(string)), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				BroadCast(UpdateRoomReport(rom.Data["id"].(string), len(rom.Clients)), func(mem *Client) bool {
					return mem.Data["room"] == nil
				})

				cli.Output <- JoinRoomResponse(true, mems)
			}
		case "room.kick.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				if rom == nil || cli.Data["id"].(string) == rom.Data["master"].(string) {
					cli.Output <- KickMemberResponse(false)
					break
				}

				mid := inp.Body["member"].(string)
				mem := rom.Clients[mid]

				if mem == nil {
					cli.Output <- KickMemberResponse(false)
					break
				}

				rom.Quit(mem)

				rom.MultiCast(KickMemberReport(mid), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				BroadCast(UpdateRoomReport(rom.Data["id"].(string), len(rom.Clients)), func(mem *Client) bool {
					return mem.Data["room"] == nil
				})
			}
		case "room.quit.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				if rom == nil {
					cli.Output <- QuitRoomResponse(false)
					break
				}

				id := cli.Data["id"].(string)

				if id == rom.Data["master"].(string) {
					for mid, mem := range rom.Clients {
						if id != mid {
							mem.Output <- KickMemberReport(mid)
							rom.Quit(mem)
						}
					}

					delete(Rooms, rom.Data["id"].(string))

					BroadCast(RemoveRoomReport(rom.Data["id"].(string)), func(mem *Client) bool {
						return mem.Data["room"] == nil
					})
				} else {
					rom.MultiCast(QuitRoomReport(id), func(mem *Client) bool {
						return cli.Data["id"].(string) != mem.Data["id"].(string)
					})

					BroadCast(UpdateRoomReport(rom.Data["id"].(string), len(rom.Clients)), func(mem *Client) bool {
						return mem.Data["room"] == nil
					})
				}

				rom.Quit(cli)

				cli.Output <- QuitRoomResponse(true)
			}
		case "room.chat.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				rom.MultiCast(ChatReport(cli.Data["id"].(string), inp.Body["message"].(string)), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- ChatResponse(true)
			}
		case "char.switch.request":
			{
				idx := inp.Body["index"].(int)
				cli.Data["character"] = idx

				rom := Rooms[cli.Data["room"].(string)]

				rom.MultiCast(SwitchCharacterReport(cli.Data["id"].(string), idx), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- SwitchCharacterResponse(true)
			}
		case "game.ready.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				cli.Data["ready"] = inp.Body["ready"].(bool)

				rom.MultiCast(ReadyGameReport(cli.Data["id"].(string), inp.Body["ready"].(bool)), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- ReadyGameResponse(true)
			}
		case "game.start.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				if cli.Data["id"].(string) != rom.Data["master"].(string) {
					cli.Output <- StartGameResponse(false)
					break
				}

				rom.Data["playing"] = true

				rom.MultiCast(StartGameReport(), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- StartGameResponse(true)
			}
		case "char.move.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				rom.MultiCast(MoveCharacterReport(cli.Data["id"].(string), inp.Body["direction"].(int)), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- MoveCharacterResponse(true)
			}
		case "char.jump.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				rom.MultiCast(JumpCharacterReport(cli.Data["id"].(string)), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- JumpCharacterResponse(true)
			}
		case "char.sync.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				rom.MultiCast(SyncCharacterReport(cli.Data["id"].(string), inp.Body["x"].(int), inp.Body["y"].(int)), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- SyncCharacterResponse(true)
			}
		case "char.shoot.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				rom.MultiCast(ShootBulletReport(cli.Data["id"].(string), inp.Body["x"].(int), inp.Body["y"].(int)), func(mem *Client) bool {
					return cli.Data["id"].(string) != mem.Data["id"].(string)
				})

				cli.Output <- ShootBulletResponse(true)
			}
		}
	}
}

func (cli *Client) Write(wg *sync.WaitGroup) {
	defer func() {
		cli.Close()
		wg.Done()
	}()

	wg.Add(1)

	for oup := range cli.Output {
		byts, err := json.Marshal(oup)

		if err != nil {
			if err == io.EOF {
				app.Echo.Logger.Error("connection closed")
				break
			}

			app.Echo.Logger.Error(err)
			break
		}

		if err = cli.Conn.WriteMessage(websocket.TextMessage, byts); err != nil {
			if err == io.EOF {
				app.Echo.Logger.Error("connection closed")
				break
			}

			app.Echo.Logger.Error(err)
			break
		}

		app.Echo.Logger.Infof("sent message %v", oup)
	}
}
