# Photogram

An instagram-like photo album app designed and implemented using microservices architectural principles.

## Size Optimization

Permanent link to thumbnails in Google drive API is in the following format:

```
https://drive.google.com/thumbnail?authuser=0&sz=w320&id=[fileid]
```

We could use `h` instead of `w` to control height.

We could fetch thumbnails instead of whole images.