FROM linkhub
FROM node:18-alpine
WORKDIR /LinkHub-proj

RUN \
  apk --no-cache add --virtual build-dependencies python3 build-base && \
  rm -rf /usr/local/share/.cache/ && \
  apk del build-dependencies

# COPY ./entrypoint.sh /entrypoint.sh

EXPOSE 3000
# ENTRYPOINT ["sh", "/entrypoint.sh"]
