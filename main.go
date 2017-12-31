package main

import (
	"log"

	"github.com/DSMdongly/pnf/app"
	"github.com/DSMdongly/pnf/app/model"
	"github.com/DSMdongly/pnf/app/route"
	"github.com/DSMdongly/pnf/config"
	"github.com/DSMdongly/pnf/socket"
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
