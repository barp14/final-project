#!/bin/bash

docker network create app-network

# Subir os containers em segundo plano
docker-compose up -d --build

# Aguardar o PostgreSQL iniciar
echo "Aguardando o PostgreSQL iniciar..."
sleep 20

# Verificar os logs dos containers
# docker-compose logs -f

docker-compose exec auth-api php artisan migrate

echo "Aguardando o Auth-API iniciar..."
sleep 10

docker-compose exec db mysql -uproject_user -p932545 project < ./init.sql

echo "Tabelas message criadas com sucesso!"

# Testar a saúde dos serviços
echo "Testando a saúde dos serviços..."
curl -f http://localhost:8000/health || echo "Auth-API não está respondendo"
curl -f http://localhost:5001/health || echo "Record-API não está respondendo"
curl -f http://localhost:3000/health || echo "Receive-Send-API não está respondendo"
