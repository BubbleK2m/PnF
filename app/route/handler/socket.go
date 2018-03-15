package handler

import (
	"github.com/DSMdongly/pnf/socket"

	"github.com/labstack/echo"

	"golang.org/x/net/websocket"
)

func Socket() echo.HandlerFunc {
	return func(ctx echo.Context) error {
		websocket.Handler(func(con *websocket.Conn) {
			cli := socket.NewClient(con)
			cli.Handle()
		}).ServeHTTP(ctx.Response(), ctx.Request())

		return nil
	}
}
