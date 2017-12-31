package route

import "pnf/app"

func Init() {
	Socket(app.Echo)
	Page(app.Echo)
}
