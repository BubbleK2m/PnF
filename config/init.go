package config

import (
	"os"
)

var (
	HTTP map[string]string
)

func Init() {
	HTTP = make(map[string]string)
	HTTP["PORT"] = os.Getenv("PORT")
}
