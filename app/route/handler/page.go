package handler

import "github.com/labstack/echo"

func MainPage() echo.HandlerFunc {
	return func(ctx echo.Context) error {
		return ctx.File("app/template/main.html")
	}
}
