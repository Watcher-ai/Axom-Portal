FROM golang:1.24.2-alpine as builder
WORKDIR /app
COPY . .
WORKDIR /app/cmd/server
RUN go build -o watcher-server

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/cmd/server/watcher-server /usr/bin/watcher-server
EXPOSE 8080
ENTRYPOINT ["/usr/bin/watcher-server"]
