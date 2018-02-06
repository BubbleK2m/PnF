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

func (rom *Room) Message(msg Message, flt func(*Client) bool) {
	for _, cli := range rom.Clients {
		if flt(cli) {
			cli.Output <- msg
		}
	}
}

func (rom *Room) BroadCast(cli *Client, msg Message) {
	flt := func(mem *Client) bool {
		return (cli.Data["id"].(string) != mem.Data["id"].(string))
	}

	rom.Message(msg, flt)
}
