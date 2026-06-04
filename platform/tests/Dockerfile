FROM alpine:3.22

RUN apk add --no-cache \
  bash \
  bats \
  coreutils \
  diffutils \
  findutils \
  fish \
  ncurses \
  gawk \
  git \
  grep \
  sed

ENV TERM=xterm

WORKDIR /workspace

ENTRYPOINT ["bats"]
