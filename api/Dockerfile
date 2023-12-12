FROM node:21.2.0-alpine3.17
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ENV PORT=4200         
EXPOSE 4200
CMD ["npm", "start"]
