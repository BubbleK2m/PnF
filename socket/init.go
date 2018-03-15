package socket

var (
	Clients map[string]*Client
	Rooms   map[string]*Room
)

func Init() {
	Clients = make(map[string]*Client)
	Rooms = make(map[string]*Room)
}
