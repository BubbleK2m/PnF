package socket

import (
	"github.com/DSMdongly/pnf/support"

	"github.com/gorilla/websocket"
)

var (
	Upgrader *websocket.Upgrader
	Clients  map[string]*Client
	Rooms    map[string]*Room
)

func Init() {
	Upgrader = support.NewUpgrader()
	Clients = make(map[string]*Client)
	Rooms = make(map[string]*Room)
}
