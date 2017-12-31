package model

type User struct {
	ID string `json:"id" validate:"required" gorm:"primary_key"`
	PW string `json:"pw" validate:"required" gorm:"not_null"`
}
