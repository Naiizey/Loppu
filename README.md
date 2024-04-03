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

## Development

To run the development server you need to have node.js and npm installed. You can install them by following the instructions on the [official node.js website](https://nodejs.org/en/download/).
Then you can run the following command in the root of the project:

```bash
npm install
npm run dev
```

The development server will be running on the port that you set up in you .env file.
