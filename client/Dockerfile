# Указываем базовый образ
FROM node:23

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения
COPY . .

# Указываем порт, который будет прослушиваться
EXPOSE 3000