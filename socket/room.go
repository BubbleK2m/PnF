package socket

import (
	"math/rand"
	"strconv"
)

type Room struct {
	Data    map[string](interface{})
	Clients map[string]*Client
}

func NewRoom(nme string) *Room {
	rom := &Room{
		Data:    make(map[string](interface{})),
		Clients: make(map[string]*Client),
	}

	rom.Data["id"] = strconv.FormatFloat(rand.Float64(), 'f', -1, 64)
	rom.Data["name"] = nme

	return rom
}

func (rom *Room) Join(cli *Client, mas bool) {
	if cli.Data["room"].(string) == Lobby.Data["id"].(string) {
		Lobby.Quit(cli)
	}

	id := cli.Data["id"].(string)
	rom.Clients[id] = cli

	if mas {
		rom.Data["master"] = cli.Data["id"].(string)
	}

	cli.Data["room"] = rom.Data["id"].(string)
	cli.Data["character"] = 0
}

func (rom *Room) Quit(cli *Client) {
	id := cli.Data["id"].(string)
	delete(rom.Clients, id)

	cli.Data["room"] = nil
}

func (rom *Room) ForEach(act func(*Client)) {
	for _, cli := range rom.Clients {
		act(cli)
	}
}

func (rom *Room) MultiCast(msg Message, flt func(*Client) bool) {
	rom.ForEach(func(cli *Client) {
		if flt(cli) {
			cli.Output <- msg
		}
	})
}

func BroadCast(msg Message, flt func(*Client) bool) {
	for id, cli := range Clients {
		if flt(cli) {
			cli.Output <- msg
		}
	}
}
