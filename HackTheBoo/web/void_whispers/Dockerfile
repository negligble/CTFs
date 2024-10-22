FROM php:alpine

# Setup user
RUN adduser -D -u 1000 -g 1000 -s /bin/sh www

# Install system packages
RUN apk add --no-cache --update curl supervisor nginx php-fpm

# Configure php-fpm and nginx
COPY config/fpm.conf /etc/php83/php-fpm.d/www.conf
COPY config/supervisord.conf /etc/supervisord.conf
COPY config/nginx.conf /etc/nginx/nginx.conf

# Copy challenge files
COPY challenge /www
COPY flag.txt /

# Setup permissions
RUN chown -R www:www /var/lib/nginx
RUN chown -R www:www /www

# Expose the port nginx is listening on
EXPOSE 1337

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
