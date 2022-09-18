FROM alpine:3.16

RUN apk add --no-cache python3 py3-pip npm

WORKDIR /app
COPY . /app

RUN pip install --no-cache -r requirements.txt
RUN cd client && npm install
RUN cd client && npm run build

EXPOSE 8000

CMD cd server && gunicorn -b 0.0.0.0:8000 app:app
