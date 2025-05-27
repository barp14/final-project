# Use imagem oficial do Node.js (versão LTS)
FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta padrão da aplicação (ajuste se diferente)
EXPOSE 3000

# Comando para rodar a aplicação em modo desenvolvimento com nodemon
CMD ["npm", "start"]