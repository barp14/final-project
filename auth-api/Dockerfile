# Usando imagem base do PHP com Apache
FROM php:8.4-apache

# Instalações necessárias
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Habilita mod_rewrite do Apache
RUN a2enmod rewrite

# # Instala Xdebug
# RUN pecl install xdebug \
#     && docker-php-ext-enable xdebug

# Define diretório de trabalho como raiz do projeto (onde está o composer.json)
WORKDIR /var/www/html

# Copia arquivos
COPY . /var/www/html/

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Altera DocumentRoot do Apache para a pasta public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Expor a porta padrão
EXPOSE 80

# Rodar o servidor Apache
CMD ["apache2-foreground"]