package route

import (
	"pnf/app/route/handler"
	"github.com/labstack/echo"
)

func Socket(ech *echo.Echo) {
	ech.GET("/socket", handler.Socket())
}
