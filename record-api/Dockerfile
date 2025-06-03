FROM python:3.9-slim

WORKDIR /app

# Copia requirements.txt e instala dependências
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . .

# Copia o script wait-for-it e dá permissão
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expõe a porta do FastAPI (padrão 8000)
EXPOSE 5001

# Comando para aguardar o banco MySQL ficar disponível e depois iniciar o uvicorn
CMD ["/wait-for-it.sh", "db:3306", "--", "/wait-for-it.sh", "rabbitmq:5672", "--", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001"]
