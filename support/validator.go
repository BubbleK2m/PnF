package support

import validator "gopkg.in/go-playground/validator.v9"

type Validator struct {
	Validation *validator.Validate
}

func NewValidator() *Validator {
	return &Validator{Validation: validator.New()}
}

func (val Validator) Validate(obj interface{}) error {
	return val.Validation.Struct(obj)
}
