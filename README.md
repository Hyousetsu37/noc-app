# NOC Project

The objective is to create a Network Operations Center (NOC) app and learn clean architecture, typescript and nodejs.

# development

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Copy the `template.env` file to `.env` and fill the values
4. Compose up the data bases

```
docker compose up -d
```

5. Synchronize the prisma client with the DB with:

```
pnpm dlx prisma migrate dev
```

6. Run the app with `pnpm dev`

# testing

1. Install Jest and other testing related libraries with `pnpm install -D jest @types/jest ts-jest supertest`
2. Initialize Jest config file with `pnpm jest --init`
3. Go to your `jest.config.ts` and update this properties

```
preset:"ts-jest"
testEnvironment:"jest-environment-node"
```

4. Go to your package.json and add this scripts:

```
"test"          :   "jest",
"test:watch"    :   "jest --watch",
"test:coverage" :   "jest --coverage",
```
