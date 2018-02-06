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

	cld := cli.Data

	if cld["id"] == nil {
		return
	}

	id := cld["id"].(string)

	if cld["room"] != nil {
		nme := cld["room"].(string)
		rom := Rooms[nme]

		rom.Quit(cli)
		rom.BroadCast(cli, QuitRoomReport(id))
	}

	delete(Clients, id)
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
				inb := inp.Body
				id, pw := inb["id"].(string), inb["pw"].(string)

				db := model.DB
				usr := model.User{}

				err := db.Where("id = ? AND pw = ?", id, pw).First(&usr).Error

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
				inb := inp.Body
				id, pw := inb["id"].(string), inb["pw"].(string)

				db := model.DB
				usr := model.User{id, pw}

				err := db.Create(&usr).Error

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

				if Rooms[nme] != nil {
					cli.Output <- CreateRoomResponse(false)
					break
				}

				rom := NewRoom(nme)
				rom.Join(cli, true)

				rom.Data["master"] = cli.Data["id"].(string)
				rom.Data["playing"] = false

				Rooms[nme] = rom

				cli.Output <- CreateRoomResponse(true)
			}
		case "room.list.request":
			{
				roms := make(map[string]map[string]interface{})

				for nme, rom := range Rooms {
					roms[nme]["members"] = len(rom.Clients)
					roms[nme]["is_playing"] = rom.Data["playing"].(bool)
				}

				cli.Output <- RoomListResponse(true, roms)
			}
		case "room.join.request":
			{
				rom := Rooms[inp.Body["name"].(string)]

				if rom == nil {
					cli.Output <- JoinRoomResponse(false, nil)
					break
				}

				mems := make(map[string]map[string]interface{})

				for id, cli := range rom.Clients {
					chr := cli.Data["character"].(int)

					mems[id]["is_master"] = (id == rom.Data["master"].(string))
					mems[id]["current_character"] = chr
				}

				rom.Join(cli, false)
				rom.BroadCast(cli, JoinRoomReport(cli.Data["id"].(string)))

				cli.Output <- JoinRoomResponse(true, mems)
			}
		case "room.quit.request":
			{
				rom := Rooms[cli.Data["room"].(string)]

				if rom == nil {
					cli.Output <- QuitRoomResponse(false)
					break
				}

				rom.Quit(cli)
				rom.BroadCast(cli, QuitRoomReport(cli.Data["id"].(string)))

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
				cld, inb := cli.Data, inp.Body
				id, nme, idx := cld["id"].(string), cld["room"].(string), inb["index"].(int)

				cli.Data["character"] = idx

				rom := Rooms[nme]
				rom.BroadCast(cli, SwitchCharacterReport(id, idx))

				cli.Output <- SwitchCharacterResponse(true)
			}
		case "game.ready.request":
			{
				cld, inb := cli.Data, inp.Body
				id, nme, rdy := cld["id"].(string), cld["room"].(string), inb["ready"].(bool)

				rom := Rooms[nme]
				rom.BroadCast(cli, ReadyGameReport(id, rdy))

				cli.Output <- ReadyGameResponse(true)
			}
		case "game.start.request":
			{
				cld := cli.Data
				id, nme := cld["id"].(string), cld["room"].(string)

				rom := Rooms[nme]
				mas := rom.Data["master"].(string)

				if id != mas {
					cli.Output <- StartGameResponse(false)
					break
				}

				rom.Data["playing"] = true

				rom.BroadCast(cli, StartGameReport())
				cli.Output <- StartGameResponse(true)
			}
		case "char.move.request":
			{
				cld, inb := cli.Data, inp.Body
				id, nme, dir := cld["id"].(string), cld["room"].(string), inb["direction"].(int)

				rom := Rooms[nme]
				rom.BroadCast(cli, MoveCharacterReport(id, dir))

				cli.Output <- MoveCharacterResponse(true)
			}
		case "char.jump.request":
			{
				cld := cli.Data
				id, nme := cld["id"].(string), cld["room"].(string)

				rom := Rooms[nme]
				rom.BroadCast(cli, JumpCharacterReport(id))

				cli.Output <- JumpCharacterResponse(true)
			}
		case "char.sync.request":
			{
				cld, inb := cli.Data, inp.Body
				id, nme, x, y := cld["id"].(string), cld["room"].(string), inb["x"].(int), inb["y"].(int)

				rom := Rooms[nme]
				rom.BroadCast(cli, SyncCharacterReport(id, x, y))

				cli.Output <- SyncCharacterResponse(true)
			}
		case "char.shoot.request":
			{
				cld, inb := cli.Data, inp.Body
				id, nme, x, y := cld["id"].(string), cld["room"].(string), inb["x"].(int), inb["y"].(int)

				rom := Rooms[nme]
				rom.BroadCast(cli, ShootBulletReport(id, x, y))

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
