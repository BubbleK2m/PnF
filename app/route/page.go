package route

import (
	"pnf/app/route/handler"
	"github.com/labstack/echo"
)

func Page(ech *echo.Echo) {
	ech.GET("/main", handler.MainPage())
}
