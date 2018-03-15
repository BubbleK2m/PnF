package socket

import (
	"log"
	"sync"

	"github.com/DSMdongly/pnf/app"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn `json:"-"`

	Name    string `json:"name"`
	RoomID  string `json:"room_id"`
	CharIDX int    `json:"char_idx"`

	Input  chan Message `json:"-"`
	Output chan Message `json:"-"`
}

func NewClient(con *websocket.Conn) *Client {
	return &Client{
		Conn:   con,
		Input:  make(chan Message),
		Output: make(chan Message),
	}
}

func (cli *Client) Handle() {
	var wg sync.WaitGroup

	go cli.Read(&wg)
	go cli.Process(&wg)
	go cli.Write(&wg)

	wg.Wait()
}

func (cli *Client) Close() {
	cli.Conn.Close()

	if cli.Name == "" {
		return
	}

	if cli.RoomID != "" {
		rom := Rooms[cli.RoomID]

		if rom != nil {
			rom.BroadCast(QuitGameReport(cli), cli)
			rom.Quit(cli)
		}
	}

	delete(Clients, cli.Name)
}

func (cli *Client) Read(wg *sync.WaitGroup) {
	defer func() {
		close(cli.Input)
		wg.Done()
	}()

	wg.Add(1)

	for {
		in := Message{}

		if err := cli.Conn.ReadJSON(&in); err != nil {
			app.Echo.Logger.Error(err)
			break
		}

		log.Printf("received message %v\n", in)
		cli.Input <- in
	}
}

func (cli *Client) Process(wg *sync.WaitGroup) {
	defer func() {
		close(cli.Output)
		wg.Done()
	}()

	wg.Add(1)

	for in := range cli.Input {
		switch in.Head {
		case "join_game_request":
			{
				nme := in.Body["name"].(string)
				mem := Clients[nme]

				if mem != nil {
					cli.Output <- JoinGameResponse(false, nil)
					break
				}

				cli.Name = nme

				rom := MatchingRoom()

				rom.Join(cli)
				rom.BroadCast(JoinGameReport(cli), cli)

				Clients[nme] = cli
				cli.Output <- JoinGameResponse(true, rom.List())
			}
		case "quit_game_request":
			{
				rom := Rooms[cli.RoomID]

				if rom == nil {
					cli.Output <- QuitGameResponse(false)
					break
				}

				rom.Quit(cli)
				rom.BroadCast(QuitGameReport(cli), cli)

				delete(Clients, cli.Name)
				cli.Output <- QuitGameResponse(true)
			}
		case "move_character_request":
			{
				rom := Rooms[cli.RoomID]
				dir := in.Body["direction"].(int)

				rom.BroadCast(MoveCharacterReport(cli, dir), cli)
				cli.Output <- MoveCharacterResponse(true)
			}
		case "switch_character_request":
			{
				idx := in.Body["index"].(int)
				cli.CharIDX = idx

				rom := Rooms[cli.RoomID]

				rom.BroadCast(SwitchCharacterReport(cli, idx), cli)
				cli.Output <- SwitchCharacterResponse(true)
			}
		case "jump_character_reqeuest":
			{
				rom := Rooms[cli.RoomID]
				rom.BroadCast(JumpCharacterReport(cli), cli)

				cli.Output <- JumpCharacterResponse(true)
			}
		case "sync_character_request":
			{
				rom := Rooms[cli.RoomID]
				rom.BroadCast(SyncCharacterReport(cli, in.Body["x"].(int), in.Body["y"].(int)), cli)

				cli.Output <- SyncCharacterResponse(true)
			}
		case "shoot_bullet_request":
			{
				rom := Rooms[cli.RoomID]
				rom.BroadCast(ShootBulletReport(cli, in.Body["x"].(int), in.Body["y"].(int)), cli)

				cli.Output <- ShootBulletResponse(true)
			}
		}
	}
}

func (cli *Client) Write(wg *sync.WaitGroup) {
	defer func() {
		wg.Done()
		cli.Close()
	}()

	wg.Add(1)

	for out := range cli.Output {
		if err := cli.Conn.WriteJSON(out); err != nil {
			app.Echo.Logger.Error(err)
			break
		}

		log.Printf("sent message %v\n", out)
	}
}
