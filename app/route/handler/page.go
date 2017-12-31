package handler

import (
	"fmt"
	"path/filepath"

	"github.com/labstack/echo"
)

func MainPage() echo.HandlerFunc {
	return func(ctx echo.Context) error {
		abs, _ := filepath.Abs("app.template/main.html")
		fmt.Println(abs)

		return ctx.File("app/template/main.html")
	}
}
