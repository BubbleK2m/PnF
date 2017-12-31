package socket

type Message struct {
	Kind string                   `json:"kind"`
	Name string                   `json:"name"`
	Data map[string](interface{}) `json:"data"`
}

func LoginResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "auth.login",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func RegisterResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "auth.register",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func CheckResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "auth.check",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func CreateRoomResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "room.create",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func RoomListResponse(res bool, roms map[string]int) Message {
	return Message{
		Kind: "response",
		Name: "room.list",
		Data: map[string](interface{}){
			"result": res,
			"rooms":  roms,
		},
	}
}

func JoinRoomResponse(res bool, mems map[string]bool) Message {
	return Message{
		Kind: "response",
		Name: "room.join",
		Data: map[string](interface{}){
			"result":  res,
			"members": mems,
		},
	}
}

func JoinRoomReport(mid string) Message {
	return Message{
		Kind: "report",
		Name: "room.join",
		Data: map[string](interface{}){
			"member": mid,
		},
	}
}

func QuitRoomResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "room.quit",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func QuitRoomReport(mid string) Message {
	return Message{
		Kind: "report",
		Name: "room.quit",
		Data: map[string](interface{}){
			"member": mid,
		},
	}
}

func ChatResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "room.chat",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func ChatReport(mid, msg string) Message {
	return Message{
		Kind: "report",
		Name: "room.chat",
		Data: map[string](interface{}){
			"message": msg,
			"sender":  mid,
		},
	}
}

func SwitchCharacterResponse(res bool) Message {
	return Message{
		Kind: "report",
		Name: "room.switch",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func SwitchCharacterReport(mid string, idx int) Message {
	return Message{
		Kind: "report",
		Name: "room.switch",
		Data: map[string](interface{}){
			"index":  idx,
			"member": mid,
		},
	}
}

func ReadyGameResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "game.ready",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func ReadyGameReport(mid string, rdy bool) Message {
	return Message{
		Kind: "report",
		Name: "game.ready",
		Data: map[string](interface{}){
			"member": mid,
			"ready":  rdy,
		},
	}
}

func StartGameResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "game.start",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func StartGameReport() Message {
	return Message{
		Kind: "report",
		Name: "game.start",
	}
}

func MoveCharacterResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "game.move",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func MoveCharacterReport(mid string, dir int) Message {
	return Message{
		Kind: "report",
		Name: "game.move",
		Data: map[string](interface{}){
			"member":    mid,
			"direction": dir,
		},
	}
}

func JumpCharacterResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "game.jump",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func JumpCharacterReport(mid string) Message {
	return Message{
		Kind: "report",
		Name: "game.jump",
		Data: map[string](interface{}){
			"member": mid,
		},
	}
}

func SyncCharacterResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "game.sync",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func SyncCharacterReport(mid string, x, y int) Message {
	return Message{
		Kind: "response",
		Name: "game.sync",
		Data: map[string](interface{}){
			"member": mid,
			"x":      x,
			"y":      y,
		},
	}
}

func ShootBulletResponse(res bool) Message {
	return Message{
		Kind: "response",
		Name: "game.shoot",
		Data: map[string](interface{}){
			"result": res,
		},
	}
}

func ShootBulletReport(mid string, x, y int) Message {
	return Message{
		Kind: "response",
		Name: "game.shoot",
		Data: map[string](interface{}){
			"member": mid,
			"x":      x,
			"y":      y,
		},
	}
}
