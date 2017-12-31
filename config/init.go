package config

import (
	"fmt"
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

	Postgres = make(map[string]string)
	Postgres["HOST"] = "ec2-54-83-12-150.compute-1.amazonaws.com"
	Postgres["USER"] = "ryrdvkmyoxxsyg"
	Postgres["PASSWORD"] = "424007163f04b88fca8ba716e489c4fbecc18b3be23fe4bd71407e55c0b118bf"
	Postgres["DB"] = "d1fumkgr3hoh5f"
	Postgres["PATH"] = fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", Postgres["HOST"], Postgres["USER"], Postgres["DB"], Postgres["PASSWORD"])
}
