#!/bin/bash

# Subir os containers em segundo plano
docker-compose up -d --build

# Aguardar o PostgreSQL iniciar
echo "Aguardando o PostgreSQL iniciar..."
sleep 20

# Verificar os logs dos containers
docker-compose logs -f

docker-compose exec auth-api php artisan
# # Testar a saúde dos serviços
# echo "Testando a saúde dos serviços..."
# curl -f http://localhost:8080/health || echo "Auth-API não está respondendo"
# curl -f http://localhost:5000/health || echo "Record-API não está respondendo"
# curl -f http://localhost:3000/health || echo "Receive-Send-API não está respondendo"
