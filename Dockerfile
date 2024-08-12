FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html 

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf


EXPOSE 3000
# ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD [ "nginx","-g","daemon off;" ]