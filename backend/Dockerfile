# Usa Node.js como base
FROM node:22

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia todo o restante do backend
COPY . .

# Expor a porta da API
EXPOSE 5000

# Comando para rodar o backend
CMD ["npm", "start"]
