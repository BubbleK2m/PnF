package handler

import (
	"github.com/labstack/echo"

	"golang.org/x/net/websocket"
)

func Socket() echo.HandlerFunc {
	return func(ctx echo.Context) error {
		websocket.Handler(func(con *websocket.Conn) {
			defer con.Close()

			txt := ""

			if err := websocket.Message.Receive(con, &txt); err != nil {
				ctx.Logger().Error(err)
			}

			if err := websocket.Message.Send(con, &txt); err != nil {
				ctx.Logger().Error(err)
			}
		}).ServeHTTP(ctx.Response(), ctx.Request())

		return nil
	}
}
