FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=src/database/prisma/schema.prisma

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
