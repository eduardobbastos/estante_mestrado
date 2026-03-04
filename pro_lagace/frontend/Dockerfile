# Etapa 1: Usar uma imagem base do Nginx, um servidor web leve e eficiente
FROM nginx:1.25-alpine

# Copia a configuração personalizada do Nginx para o contêiner, substituindo a padrão.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos da aplicação para o diretório que o Nginx serve.
# Copiar explicitamente garante que apenas o necessário seja incluído.
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/