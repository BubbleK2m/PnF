package handler

import (
	"github.com/DSMdongly/pnf/socket"

	"github.com/labstack/echo"
)

func Socket() echo.HandlerFunc {
	return func(ctx echo.Context) {
		con, err := socket.Upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)

		if err != nil {
			ctx.Logger().Error(err)
		}

		cli := socket.NewClient(con)
		cli.Handle()
	}
}
