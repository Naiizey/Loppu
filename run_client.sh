docker compose down -v
docker compose up -d --build
cd server
npm run fillDb
cd ../client
npm run start