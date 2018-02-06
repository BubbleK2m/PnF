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
	id := cli.Data["id"].(string)
	rom.Clients[id] = cli

	cli.Data["room"] = rom.Data["id"].(string)
	cli.Data["character"] = 0
}

func (rom *Room) Quit(cli *Client) {
	id := cli.Data["id"].(string)
	delete(rom.Clients, id)

	cli.Data["room"] = nil
}

func (rom *Room) BroadCast(cli *Client, msg Message) {
	for mid, mem := range rom.Clients {
		if cli.Data["id"].(string) != mem.Data["id"].(string) {
			cli.Output <- msg
		}
	}
}
