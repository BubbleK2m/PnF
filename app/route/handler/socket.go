package handler

import (
	"github.com/DSMdongly/pnf/socket"

	"github.com/labstack/echo"

	"golang.org/x/net/websocket"
)

func Socket() echo.HandlerFunc {
	return func(ctx echo.Context) error {
		websocket.Handler(func(con *websocket.Conn) {
			con, err := socket.Upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)

			if err != nil {
				ctx.Logger().Error(err)
				return err
			}

			cli := socket.NewClient(con)
			cli.Handle()
		}).ServeHTTP(cli.Response(), cli.Request())

		return nil
	}
}
