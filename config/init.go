package config

import (
	"fmt"
	"net"
	"net/url"
	"os"
)

var (
	HTTP     map[string]string
	JWT      map[string]string
	Postgres map[string]string
)

func Init() {
	HTTP = make(map[string]string)
	HTTP["PORT"] = os.Getenv("PORT")

	JWT = make(map[string]string)
	JWT["SECRET"] = "55A95EAA446C2D545BC57A7F3BBAB"

	pth, _ := url.Parse(os.Getenv("DATABASE_URL"))

	Postgres = make(map[string]string)
	Postgres["HOST"], _, _ = net.SplitHostPort(pth.Host)
	Postgres["USER"] = pth.User.Username()
	Postgres["PASSWORD"], _ = pth.User.Password()
	Postgres["DB"] = pth.Path[1:]
	Postgres["PATH"] = fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", Postgres["HOST"], Postgres["USER"], Postgres["DB"], Postgres["PASSWORD"])
}
