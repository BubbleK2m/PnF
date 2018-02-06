package socket

import (
	"github.com/DSMdongly/pnf/support"

	"github.com/gorilla/websocket"
)

var (
	Upgrader *websocket.Upgrader
	Clients  map[string]*Client
	Rooms    map[float64]*Room
)

func Init() {
	Upgrader = support.NewUpgrader()
	Clients = make(map[string]*Client)
	Rooms = make(map[float64]*Room)
}
