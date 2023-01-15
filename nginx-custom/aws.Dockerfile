# base image
FROM nginx
# remove default config
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy config
COPY aws.nginx.conf /etc/nginx/nginx.conf
# ports
EXPOSE 80
# expose ssl port
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]