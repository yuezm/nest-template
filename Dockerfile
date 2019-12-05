FROM registry.cn-hangzhou.aliyuncs.com/medlinker/node:10.16

LABEL maintainer="yuezhiming@medlinker.com"

ENV APP_NAME "nest-template"
ENV APP_ROOT /var/www
ENV APP_PATH $APP_ROOT/$APP_NAME
ENV LOG_ROOT /var/log/medlinker
ENV LOG_PATH /var/log/medlinker/$APP_NAME

WORKDIR $APP_PATH

###############################################################################
#                                INSTALLATION
###############################################################################
USER root
RUN mkdir -p /home/node/.npm-global

ENV PATH=/home/node/.npm-global/bin:$PATH \
    NPM_CONFIG_PREFIX=/home/node/.npm-global

COPY . .
RUN npm ci --produciton

EXPOSE 8080

RUN echo "$APP_PATH/dockerfiles/serve.sh" >> /bin/serve.sh \
    && chmod a+x /bin/serve.sh

# CMD ["npm","run","startup:docker"]
