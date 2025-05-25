FROM golang:1.24.2-alpine as builder
WORKDIR /app
COPY . .
WORKDIR /app/cmd/server
RUN go build -o watcher-server

FROM alpine:3.18
WORKDIR /app
RUN apk add --no-cache bash
COPY --from=builder /app/cmd/server/watcher-server /usr/bin/watcher-server
COPY ../../wait-for-it.sh /wait-for-it.sh
EXPOSE 8080
ENTRYPOINT ["/wait-for-it.sh", "db:5432", "--", "/usr/bin/watcher-server"]
