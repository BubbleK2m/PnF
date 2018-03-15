package handler

import (
	"github.com/DSMdongly/pnf/socket"
	"github.com/labstack/echo"

	"golang.org/x/net/websocket"
)

func Socket() echo.HandlerFunc {
	return func(ctx echo.Context) error {
		websocket.Handler(func(con *websocket.Conn) {
			defer con.Close()

			for {
				msg := socket.Message{}

				if err := websocket.JSON.Receive(con, &msg); err != nil {
					ctx.Logger().Error(err)
					break
				}

				if err := websocket.JSON.Send(con, msg); err != nil {
					ctx.Logger().Error(err)
					break
				}
			}
		}).ServeHTTP(ctx.Response(), ctx.Request())

		return nil
	}
}
