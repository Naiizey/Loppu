# Loppu, an interactive web-story

## .env

You need to create a .env file in the root of the project. You can copy the .env.sample file and change the values to your liking.

## Docker

To run the docker-compose pile you need to have docker and docker-compose installed. You can install them by following the instructions on the [official docker website](https://docs.docker.com/get-docker/).
Then you can run the following command in the root of the project:

```bash
docker-compose up -d --build
```
To stop it you can run:

```bash
docker-compose down -v
```

