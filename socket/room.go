package socket

import (
	"math/rand"
	"strconv"
)

type Room struct {
	ID      string    `json:"id"`
	Clients []*Client `json:"clients"`
}

func NewRoom() *Room {
	rom := &Room{
		Clients: make([]*Client, 0),
	}

	rom.ID = strconv.FormatFloat(rand.Float64(), 'f', -1, 64)
	return rom
}

func (rom *Room) Join(cli *Client) {
	rom.Clients = append(rom.Clients, cli)

	cli.RoomID = rom.ID
	cli.CharIDX = 0
}

func (rom *Room) Quit(cli *Client) {
	delete(rom.Clients, cli.Name)
	cli.RoomID = nil
}

func (rom *Room) List() []*Client {
	clis := make([]*Client, 0)

	for _, cli := range Clients {
		clis = append(clis, cli)
	}

	return clis
}

func (rom *Room) BroadCast(msg Message, sdr *Client) {
	for _, cli := range Clients {
		if cli.Name != sdr.Name {
			cli.Output <- msg
		}
	}
}
