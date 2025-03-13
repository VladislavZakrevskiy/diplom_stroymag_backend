FROM node:21

WORKDIR /app

COPY ./package.json ./package.json

RUN yarn install 

COPY ./src ./src

COPY ./prisma ./prisma

COPY /.env ./.env

COPY ./tsconfig.json ./tsconfig.json

RUN npm rebuild bcrypt --build-from-source

RUN yarn prisma generate

RUN yarn run build 

CMD ["yarn", "run", "start:prod"]

EXPOSE 3000