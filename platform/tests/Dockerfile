FROM alpine:3.22

RUN apk add --no-cache \
  bash \
  bats \
  coreutils \
  diffutils \
  findutils \
  fish \
  gawk \
  git \
  grep \
  sed

WORKDIR /workspace

ENTRYPOINT ["bats"]
