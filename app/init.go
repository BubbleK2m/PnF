package app

import (
	"fmt"

	"github.com/DSMdongly/pnf/config"
	"github.com/DSMdongly/pnf/support"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

var (
	Echo *echo.Echo
)

func Init() {
	Echo = echo.New()
	Echo.Validator = support.NewValidator()

	Echo.Static("/static", "../app/static")

	Echo.Use(middleware.Recover())
	Echo.Use(middleware.RequestID())
	Echo.Use(middleware.CORS())
}

func Start() {
	Echo.Logger.Fatal(Echo.Start(fmt.Sprintf(":%s", config.HTTP["PORT"])))
}
