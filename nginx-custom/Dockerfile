# base image
FROM nginx
# remove default config
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy config
COPY nginx.conf /etc/nginx/nginx.conf
# ports
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]