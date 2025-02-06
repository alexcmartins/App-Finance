# Usa Node.js para compilar o frontend
FROM node:22 AS build

WORKDIR /app

# Copia os arquivos package.json e package-lock.json primeiro (otimiza cache)
COPY package.json package-lock.json ./
RUN npm install

# Agora copia os demais arquivos do frontend (incluindo public/index.html)
COPY . .

# Verifica se o index.html está presente antes de rodar o build
RUN ls -la public/ && npm run build

# Usa Nginx para servir os arquivos estáticos
FROM nginx:latest

# Copia os arquivos do build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
