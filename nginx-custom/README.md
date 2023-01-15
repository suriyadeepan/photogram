# Configure NGINX for AWS/SSL

Open up port 443.

Add server name.

Include ssl certificate and key you obtained by registering at `letsencrypt` using `certbot`.

```conf
http {

    server {
            ...       
            listen 443 default ssl;
            server_name photos.suriya.app;

            ssl_certificate /etc/nginx/certs/fullchain.pem;
            ssl_certificate_key /etc/nginx/certs/privkey.pem;
            ...
    }
}
```

**Note**: This configuration is available in `aws.nginx.conf`. Make sure to rename `aws.nginx.conf` to replace `nginx.conf`.
