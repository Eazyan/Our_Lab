FROM node:18-alpine

WORKDIR /app

# Устанавливаем переменную окружения для отключения HTTPS
ENV HTTPS=false

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "start"] 