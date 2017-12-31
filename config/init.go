package config

import "fmt"

var (
	HTTP     map[string]string
	JWT      map[string]string
	Postgres map[string]string
)

func Init() {
	HTTP = make(map[string]string)
	HTTP["PORT"] = "5000"

	JWT = make(map[string]string)
	JWT["SECRET"] = "55A95EAA446C2D545BC57A7F3BBAB"

	Postgres = make(map[string]string)
	Postgres["HOST"] = "localhost"
	Postgres["USER"] = "root"
	Postgres["PASSWORD"] = "ehdgus0608"
	Postgres["DB"] = "glove"
	Postgres["PATH"] = fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", Postgres["HOST"], Postgres["USER"], Postgres["DB"], Postgres["PASSWORD"])
}
