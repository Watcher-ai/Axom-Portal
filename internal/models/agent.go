package models

type Agent struct {
	Identifier                string    `json:"identifier"`
	ClientId                  uuid.UUID `json:"clientId"`
	ClientSecret              string    `json:"clientSecret"`
	OwnerId                   uuid.UUID `json:"ownerId"`
	OwnerName                 string    `json:"ownerName"`
}