package socket

func MatchingRoom() *Room {
	var rom *Room

	for _, rom := range Rooms {
		if len(rom.Clients) < 10 {
			return rom
		}
	}

	rom = NewRoom()
	Rooms[rom.ID] = rom

	return rom
}
