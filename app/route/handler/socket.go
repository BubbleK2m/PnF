package handler

import (
	"sync"

	"github.com/DSMdongly/pnf/socket"
	"github.com/labstack/echo"

	"golang.org/x/net/websocket"
)

func Socket() echo.HandlerFunc {
	return func(ctx echo.Context) error {
		websocket.Handler(func(con *websocket.Conn) {
			cli := socket.NewClient(con)
			defer cli.Close()

			var wg sync.WaitGroup

			go cli.Read(&wg)
			go cli.Process(&wg)
			go cli.Write(&wg)

			wg.Wait()
		}).ServeHTTP(ctx.Response(), ctx.Request())

		return nil
	}
}
