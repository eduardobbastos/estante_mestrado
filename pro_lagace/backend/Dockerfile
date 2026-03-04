# Etapa 1: Usar uma imagem base do Node.js (alpine é uma versão leve)
FROM node:18-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e package-lock.json (se existir) para aproveitar o cache do Docker
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o resto dos arquivos da aplicação (respeitando o .dockerignore)
COPY . .

# Expor a porta que a aplicação usa
EXPOSE 3000

# Comando padrão para iniciar a aplicação (será sobrescrito pelo docker-compose para usar 'npm run dev')
CMD [ "npm", "start" ]