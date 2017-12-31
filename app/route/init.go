package route

import "github.com/DSMdongly/pnf/app"

func Init() {
	Socket(app.Echo)
	Page(app.Echo)
}
