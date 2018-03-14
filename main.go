package main

import (
	"github.com/DSMdongly/pnf/app"
	"github.com/DSMdongly/pnf/app/route"
	"github.com/DSMdongly/pnf/config"
	"github.com/DSMdongly/pnf/socket"
)

func main() {
	config.Init()
	socket.Init()

	app.Init()
	route.Init()

	app.Awake()
	app.Start()
}
