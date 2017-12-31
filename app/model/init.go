package model

import (
	"pnf/config"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var (
	DB *gorm.DB
)

func Init() (err error) {
	DB, err = gorm.Open("postgres", config.Postgres["PATH"])

	if err != nil {
		return err
	}

	err = DB.AutoMigrate(&User{}).Error
	return
}
