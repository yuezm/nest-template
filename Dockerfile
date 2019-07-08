FROM node:10-alpine

ARG APP_NAME

ENV APP_NAME $APP_NAME
ENV APP_PATH /var/www/$APP_NAME
ENV LOG_PATH /var/log/$APP_NAME

WORKDIR $APP_ROOT

COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 80

CMD ["npm","run","startup:docker"]