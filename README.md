# Alkuluku

An interactive world map for tracking your book reading progress by country.

Build on Flask + Vue.

Available on https://alkuluku.io

## Selfhosting

If you want to self-host your own alkuluku instance, you can do so using the docker image.

NOTE: you will need to setup your mongodb separately to store the user data

### Docker run

```
 docker run \
  -e "FLASK_SECRET=<RANDOM_SECRET>" \
  -e "MONGODB_URI=<YOUR_MONGODB_INSTANCE>" \
  -e "SENDGRID_API_KEY=<YOUR_SENDGRID_KEY_FOR_RESET_EMAIL>" \
  -p 8000:8000 \
  yaasha/alkuluku
```

### Docker compose
```
  alkuluku:
    image: yaasha/alkuluku
    container_name: alkuluku
    restart: unless-stopped
    ports:
      - 8000:8000
    environment:
      - FLASK_SECRET=<RANDOM_SECRET>
      - MONGODB_URI=<YOUR_MONGODB_INSTANCE>
      - SENDGRID_API_KEY=<YOUR_SENDGRID_KEY_FOR_RESET_EMAIL>
```
