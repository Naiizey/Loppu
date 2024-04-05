docker compose down -v
docker compose up -d --build
cd server
npm install
npm run fillDb
docker compose logs -f