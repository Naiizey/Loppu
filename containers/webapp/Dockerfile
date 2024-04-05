FROM nginx:alpine
COPY client/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY containers/webapp/nginx.conf /etc/nginx/conf.d/default.conf
