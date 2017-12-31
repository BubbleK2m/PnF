package support

import (
	"html/template"
	"io"

	"github.com/labstack/echo"
)

type Renderer struct {
	Template *template.Template
}

func NewRenderer() *Renderer {
	return &Renderer{Template: template.Must(template.ParseGlob("app/template/*.html"))}
}

func (ren Renderer) Render(wtr io.Writer, nme string, dat interface{}, ctx echo.Context) error {
	return ren.Template.ExecuteTemplate(wtr, nme, dat)
}
