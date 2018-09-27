FROM nginx:alpine
COPY ./dist/otoneuro-registration /usr/share/nginx/html
EXPOSE 80
