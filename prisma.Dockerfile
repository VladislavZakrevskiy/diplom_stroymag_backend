FROM node:21

WORKDIR /app

RUN yarn add prisma 

COPY ./prisma ./prisma

COPY /.env ./.env

COPY ./tsconfig.json ./tsconfig.json

RUN yarn prisma generate

CMD ["yarn", "prisma", "studio"]

EXPOSE 3000