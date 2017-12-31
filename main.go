package main

import (
	"log"

	"pnf/app"
	"pnf/app/model"
	"pnf/app/route"
	"pnf/config"
	"pnf/socket"
)

func main() {
	config.Init()
	socket.Init()

	if err := model.Init(); err != nil {
		log.Fatal(err)
	}

	app.Init()
	route.Init()

	app.Start()
}
