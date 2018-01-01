package socket

import (
	"encoding/json"

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
	go cli.Read()
	go cli.Process()
	go cli.Write()
}

func (cli *Client) Read() {
	defer close(cli.Input)

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

func (cli *Client) Process() {
	defer close(cli.Output)

	for inp := range cli.Input {
		if inp.Kind != "request" {
			break
		}

		switch inp.Name {
		case "auth.login":
			{
				ind := inp.Data
				id, pw := ind["id"].(string), ind["pw"].(string)

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
		case "auth.register":
			{
				ind := inp.Data
				id, pw := ind["id"].(string), ind["pw"].(string)

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
		case "auth.check":
			{
				ind := inp.Data
				id := ind["id"].(string)

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
		case "room.create":
			{
				cld, ind := cli.Data, inp.Data
				id, nme := cld["id"].(string), ind["name"].(string)

				rom := Rooms[nme]

				if rom != nil {
					cli.Output <- CreateRoomResponse(false)
					break
				}

				rom = NewRoom(nme)

				rom.Join(cli, true)
				rom.Data["master"] = id

				Rooms[nme] = rom
				cli.Output <- CreateRoomResponse(true)
			}
		case "room.list":
			{
				roms := make(map[string]int)

				for nme, rom := range Rooms {
					roms[nme] = len(rom.Clients)
				}

				cli.Output <- RoomListResponse(true, roms)
			}
		case "room.join":
			{
				cld, ind := cli.Data, inp.Data
				id, nme := cld["id"].(string), ind["name"].(string)

				rom := Rooms[nme]

				if rom == nil {
					cli.Output <- JoinRoomResponse(false, nil)
					break
				}

				mas := rom.Data["master"].(string)
				mems := make(map[string]bool)

				for id := range rom.Clients {
					mems[id] = (id == mas)
				}

				rom.Join(cli, false)
				rom.BroadCast(cli, JoinRoomReport(id))

				cli.Output <- JoinRoomResponse(true, mems)
			}
		case "room.quit":
			{
				cld := cli.Data
				nme, id := cld["room"].(string), cld["id"].(string)

				rom := Rooms[nme]

				if rom == nil {
					cli.Output <- QuitRoomResponse(false)
					break
				}

				rom.Quit(cli)
				rom.BroadCast(cli, QuitRoomReport(id))

				cli.Output <- QuitRoomResponse(true)
			}
		case "room.chat":
			{
				cld, ind := cli.Data, inp.Data
				id, nme, msg := cld["id"].(string), cld["room"].(string), ind["message"].(string)

				rom := Rooms[nme]
				rom.BroadCast(cli, ChatReport(id, msg))

				cli.Output <- ChatResponse(true)
			}
		case "room.switch":
			{
				cld, ind := cli.Data, inp.Data
				id, nme, idx := cld["id"].(string), cld["room"].(string), ind["index"].(int)

				rom := Rooms[nme]
				rom.BroadCast(cli, SwitchCharacterReport(id, idx))

				cli.Output <- SwitchCharacterResponse(true)
			}
		case "game.ready":
			{
				cld, ind := cli.Data, inp.Data
				id, nme, rdy := cld["id"].(string), cld["room"].(string), ind["ready"].(bool)

				rom := Rooms[nme]
				rom.BroadCast(cli, ReadyGameReport(id, rdy))

				cli.Output <- ReadyGameResponse(true)
			}
		case "game.start":
			{
				cld := cli.Data
				id, nme := cld["id"].(string), cld["room"].(string)

				rom := Rooms[nme]
				mas := rom.Data["master"].(string)

				if id != mas {
					cli.Output <- StartGameResponse(false)
					break
				}

				rom.BroadCast(cli, StartGameReport())
				cli.Output <- StartGameResponse(true)
			}
		case "game.move":
			{
				cld, ind := cli.Data, inp.Data
				id, nme, dir := cld["id"].(string), cld["room"].(string), ind["direction"].(int)

				rom := Rooms[nme]
				rom.BroadCast(cli, MoveCharacterReport(id, dir))

				cli.Output <- MoveCharacterResponse(true)
			}
		case "game.jump":
			{
				cld := cli.Data
				id, nme := cld["id"].(string), cld["room"].(string)

				rom := Rooms[nme]
				rom.BroadCast(cli, JumpCharacterReport(id))

				cli.Output <- JumpCharacterResponse(true)
			}
		case "game.sync":
			{
				cld, ind := cli.Data, inp.Data
				id, nme, x, y := cld["id"].(string), cld["room"].(string), ind["x"].(int), ind["y"].(int)

				rom := Rooms[nme]
				rom.BroadCast(cli, SyncCharacterReport(id, x, y))

				cli.Output <- SyncCharacterResponse(true)
			}
		case "game.shoot":
			{
				cld, ind := cli.Data, inp.Data
				id, nme, x, y := cld["id"].(string), cld["room"].(string), ind["x"].(int), ind["y"].(int)

				rom := Rooms[nme]
				rom.BroadCast(cli, ShootBulletReport(id, x, y))

				cli.Output <- ShootBulletResponse(true)
			}
		}
	}
}

func (cli *Client) Write() {
	defer func() {
		cli.Conn.Close()

		cld := cli.Data
		id := cld["id"].(string)

		if cld["room"] != nil {
			nme := cld["room"].(string)
			rom := Rooms[nme]

			rom.Quit(cli)
			rom.BroadCast(cli, QuitRoomReport(id))
		}

		delete(Clients, id)
	}()

	for oup := range cli.Output {
		byts, err := json.Marshal(oup)

		if err != nil {
			app.Echo.Logger.Error(err)
			break
		}

		if err = cli.Conn.WriteMessage(websocket.TextMessage, byts); err != nil {
			app.Echo.Logger.Error(err)
			break
		}

		app.Echo.Logger.Infof("sent message %v", oup)
	}
}
