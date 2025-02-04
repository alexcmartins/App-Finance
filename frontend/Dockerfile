# Usa Node.js para compilar o frontend
FROM node:22 AS build

WORKDIR /app

# Copia os arquivos e instala as dependências
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Gera o build do Vue.js
RUN npm run build

# Usa Nginx para servir os arquivos estáticos
FROM nginx:latest

# Copia os arquivos do build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta do Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
