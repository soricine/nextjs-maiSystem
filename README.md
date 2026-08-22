## Start
- Node.js
- pnpm
- Docker
- Docker Compose

pnpm install
pnpm exec prisma generate
npx create-next-app@latest 

npm install prisma @prisma/client
npm install zod bcrypt
npm install next-auth
npm install react-hook-form
npm install @hookform/resolvers

docker compose up -d

## Create db
createdb -U postgres dbname
create .env 

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/dd"
NEXTAUTH_SECRET="dev-passwd"
NEXTAUTH_URL="http://localhost:3000"

 - then : pnpm exec prisma generate
          pnpm exec prisma migrate dev
          pnpm exec prisma db seed
          pnpm exec prisma studio(to check the db)

## run:
  name: Install dependencies
  command: |
    npm install -g pnpm
    pnpm install

## run:
pnpm create-admin to create new admin

