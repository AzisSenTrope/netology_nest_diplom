FROM node:16

WORKDIR /app

COPY  ./ ./
RUN npm i -f
RUN npm uninstall bcrypt
RUN npm i bcrypt

CMD ["npm", "run", "start"]