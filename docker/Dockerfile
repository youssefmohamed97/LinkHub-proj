FROM linkhub

FROM node:18-alpine
WORKDIR /app

RUN \
  apk --no-cache add --virtual build-dependencies python3 build-base &&  \
  apk del build-dependencies

COPY . /app
EXPOSE 3000
# ENTRYPOINT ["sh", "/entrypoint.sh"]
