package socket

type Message struct {
	Head string                   `json:"head"`
	Body map[string](interface{}) `json:"body"`
}

func LoginResponse(res bool) Message {
	return Message{
		Head: "auth.login.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func RegisterResponse(res bool) Message {
	return Message{
		Head: "auth.register.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func CheckResponse(res bool) Message {
	return Message{
		Head: "auth.check.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func CreateRoomResponse(res bool) Message {
	return Message{
		Head: "room.create.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func RoomListResponse(res bool, roms map[string](interface{})) Message {
	return Message{
		Head: "room.list.response",
		Body: map[string](interface{}){
			"result": res,
			"rooms":  roms,
		},
	}
}

func UpdateRoomReport(res bool, cnt int) Message {
	return Message{
		Head: "room.update.report",
		Body: map[string](interface{}){
			"result": res,
			"count":  cnt,
		},
	}
}

func JoinRoomResponse(res bool, mems map[string]interface{}) Message {
	return Message{
		Head: "room.join.response",
		Body: map[string](interface{}){
			"result":  res,
			"members": mems,
		},
	}
}

func JoinRoomReport(mid string) Message {
	return Message{
		Head: "room.join.response",
		Body: map[string](interface{}){
			"member": mid,
		},
	}
}

func QuitRoomResponse(res bool) Message {
	return Message{
		Head: "room.quit.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func QuitRoomReport(mid string) Message {
	return Message{
		Head: "room.quit.report",
		Body: map[string](interface{}){
			"member": mid,
		},
	}
}

func ChatResponse(res bool) Message {
	return Message{
		Head: "room.chat.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func ChatReport(mid, msg string) Message {
	return Message{
		Head: "room.chat.report",
		Body: map[string](interface{}){
			"message": msg,
			"sender":  mid,
		},
	}
}

func SwitchCharacterResponse(res bool) Message {
	return Message{
		Head: "room.switch.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func SwitchCharacterReport(mid string, idx int) Message {
	return Message{
		Head: "room.switch.report",
		Body: map[string](interface{}){
			"index":  idx,
			"member": mid,
		},
	}
}

func ReadyGameResponse(res bool) Message {
	return Message{
		Head: "game.ready.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func ReadyGameReport(mid string, rdy bool) Message {
	return Message{
		Head: "game.ready.report",
		Body: map[string](interface{}){
			"member": mid,
			"ready":  rdy,
		},
	}
}

func StartGameResponse(res bool) Message {
	return Message{
		Head: "game.start.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func StartGameReport() Message {
	return Message{
		Head: "game.start.report",
	}
}

func MoveCharacterResponse(res bool) Message {
	return Message{
		Head: "char.move.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func MoveCharacterReport(mid string, dir int) Message {
	return Message{
		Head: "char.move.report",
		Body: map[string](interface{}){
			"member":    mid,
			"direction": dir,
		},
	}
}

func JumpCharacterResponse(res bool) Message {
	return Message{
		Head: "char.jump.report",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func JumpCharacterReport(mid string) Message {
	return Message{
		Head: "char.jump.report",
		Body: map[string](interface{}){
			"member": mid,
		},
	}
}

func SyncCharacterResponse(res bool) Message {
	return Message{
		Head: "char.sync.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func SyncCharacterReport(mid string, x, y int) Message {
	return Message{
		Head: "char.sync.report",
		Body: map[string](interface{}){
			"member": mid,
			"x":      x,
			"y":      y,
		},
	}
}

func ShootBulletResponse(res bool) Message {
	return Message{
		Head: "char.shoot.response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func ShootBulletReport(mid string, x, y int) Message {
	return Message{
		Head: "char.shoot.report",
		Body: map[string](interface{}){
			"member": mid,
			"x":      x,
			"y":      y,
		},
	}
}
