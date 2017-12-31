FROM alpine:latest
MAINTAINER gdh0608@naver.com

RUN apk add --update ca-certificates
ADD bin/pnf /pnf
EXPOSE 9000

ENTRYPOINT ["/pnf"]