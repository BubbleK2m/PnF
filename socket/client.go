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
			for mid, mem := range rom.Clients {
				if id != mid {
					mem.Output <- KickMemberReport(mid)
					rom.Quit(mem)
				}
			}

			delete(Rooms, rom.Data["id"].(string))
		} else {
			rom.BroadCast(cli, QuitRoomReport(id))
		}
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
				inb := inp.Body
				id := inb["id"].(string)

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
			}
		case "room.list.request":
			{
				roms := make(map[string](interface{}))

				for id, rom := range Rooms {
					inf := make(map[string](interface{}))

					inf["name"] = rom.Data["name"].(string)
					inf["is_playing"] = rom.Data["playing"].(bool)
					inf["member_cnt"] = len(rom.Clients)

					roms[id] = inf
				}

				cli.Output <- RoomListResponse(true, roms)
			}
		case "room.join.request":
			{
				rom := Rooms[inp.Body["id"].(string)]

				if rom == nil {
					cli.Output <- JoinRoomResponse(false, nil)
					break
				}

				mems := make(map[string](interface{}))

				for id, cli := range rom.Clients {
					inf := make(map[string](interface{}))

					inf["is_master"] = (id == rom.Data["master"].(string))
					inf["current_character"] = cli.Data["character"].(int)

					mems[id] = inf
				}

				rom.Join(cli, false)
				rom.BroadCast(cli, JoinMemberReport(cli.Data["id"].(string)))

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
				rom.BroadCast(cli, KickMemberReport(mid))
			}
		case "room.quit.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				if rom == nil {
					cli.Output <- QuitRoomResponse(false)
					break
				}

				id := cli.Data["id"].(string)

				rom.Quit(cli)

				if id == rom.Data["master"].(string) {
					for mid, mem := range rom.Clients {
						if id != mid {
							mem.Output <- KickMemberReport(mid)
							rom.Quit(mem)
						}
					}

					delete(Rooms, rom.Data["id"].(string))
				} else {
					rom.BroadCast(cli, QuitRoomReport(id))
				}

				cli.Output <- QuitRoomResponse(true)
			}
		case "room.chat.request":
			{
				rom := Rooms[cli.Data["room"].(string)]
				rom.BroadCast(cli, ChatReport(cli.Data["id"].(string), inp.Body["message"].(string)))

				cli.Output <- ChatResponse(true)
			}
		case "char.switch.request":
			{
				idx := inp.Body["index"].(int)
				cli.Data["character"] = idx

				rom := Rooms[cli.Data["room"].(string)]
				rom.BroadCast(cli, SwitchCharacterReport(cli.Data["id"].(string), idx))

				cli.Output <- SwitchCharacterResponse(true)
			}
		case "game.ready.request":
			{
				rom := Rooms[cli.Data["room"].(string)]
				rom.BroadCast(cli, ReadyGameReport(cli.Data["id"].(string), inp.Body["ready"].(bool)))

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
				rom.BroadCast(cli, StartGameReport())

				cli.Output <- StartGameResponse(true)
			}
		case "char.move.request":
			{
				rom := Rooms[cli.Data["room"].(string)]
				rom.BroadCast(cli, MoveCharacterReport(cli.Data["id"].(string), inp.Body["direction"].(int)))

				cli.Output <- MoveCharacterResponse(true)
			}
		case "char.jump.request":
			{
				rom := Rooms[cli.Data["room"].(string)]
				rom.BroadCast(cli, JumpCharacterReport(cli.Data["id"].(string)))

				cli.Output <- JumpCharacterResponse(true)
			}
		case "char.sync.request":
			{
				rom := Rooms[cli.Data["room"].(string)]
				rom.BroadCast(cli, SyncCharacterReport(cli.Data["id"].(string), inp.Body["x"].(int), inp.Body["y"].(int)))

				cli.Output <- SyncCharacterResponse(true)
			}
		case "char.shoot.request":
			{
				rom := Rooms[cli.Data["room"].(string)]
				rom.BroadCast(cli, ShootBulletReport(cli.Data["id"].(string), inp.Body["x"].(int), inp.Body["y"].(int)))

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
