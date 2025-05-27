# Use a imagem oficial do Python
FROM python:3.9-slim

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos da aplicação
COPY . .

# Instale as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Exponha a porta 5000
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["python", "app.py"]
