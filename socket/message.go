package socket

type Message struct {
	Head string                   `json:"head"`
	Body map[string](interface{}) `json:"body"`
}

func JoinGameResponse(res bool, clis []*Client) Message {
	return Message{
		Head: "join_game_response",
		Body: map[string](interface{}){
			"result":  res,
			"clients": clis,
		},
	}
}

func JoinGameReport(cli *Client) Message {
	return Message{
		Head: "join_game_report",
		Body: map[string](interface{}){
			"client": cli,
		},
	}
}

func QuitGameResponse(res bool) Message {
	return Message{
		Head: "quit_game_response",
		Body: map[string](interface{}){
			"result": true,
		},
	}
}

func QuitGameReport(cli *Client) Message {
	return Message{
		Head: "quit_game_report",
		Body: map[string](interface{}){
			"client": cli,
		},
	}
}

func SwitchCharacterResponse(res bool) Message {
	return Message{
		Head: "switch_character_response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func SwitchCharacterReport(cli *Client, idx int) Message {
	return Message{
		Head: "switch_character_report",
		Body: map[string](interface{}){
			"client": cli,
			"index":  idx,
		},
	}
}

func MoveCharacterResponse(res bool) Message {
	return Message{
		Head: "move_character_report",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func MoveCharacterReport(cli *Client, dir int) Message {
	return Message{
		Head: "move_character_report",
		Body: map[string](interface{}){
			"client":    cli,
			"direction": dir,
		},
	}
}

func JumpCharacterResponse(res bool) Message {
	return Message{
		Head: "jump_character_response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func JumpCharacterReport(cli *Client) Message {
	return Message{
		Head: "jump_character_report",
		Body: map[string](interface{}){
			"client": cli,
		},
	}
}

func SyncCharacterResponse(res bool) Message {
	return Message{
		Head: "sync_character_response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func SyncCharacterReport(cli *Client, x, y int) Message {
	return Message{
		Head: "sync_character_report",
		Body: map[string](interface{}){
			"client": cli,
			"x":      x,
			"y":      y,
		},
	}
}

func ShootBulletResponse(res bool) Message {
	return Message{
		Head: "shoot_bullet_response",
		Body: map[string](interface{}){
			"result": res,
		},
	}
}

func ShootBulletReport(cli *Client, x, y int) Message {
	return Message{
		Head: "shoot_bullet_report",
		Body: map[string](interface{}){
			"client": cli,
			"x":      x,
			"y":      y,
		},
	}
}
