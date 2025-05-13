package util

import (
    "math/rand"
    "time"
)

// GenerateRandomString generates a random string with a prefix
func GenerateRandomString(length int, prefix string) string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
    randomString := make([]byte, length)
    for i := range randomString {
        randomString[i] = charset[seededRand.Intn(len(charset))]
    }
    return prefix + string(randomString)
}