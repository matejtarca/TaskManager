# Task Manager

## Description
This is a simple task manager that allows you to add, delete, and view tasks. It is built using Next.js 14 framework utilizing the new server components and server actions features.

The application uses Prisma as an ORM to interact with the database. The authentication is handled by NextAuth.js. For the UI, Tailwind CSS with shadcn/ui components are used. Another important libraries include react-table and react-hook-form.

## Installation
1. Make sure you have Node.js version 18+ and npm installed
2. Clone the repository
3. Run `npm install` to install the dependencies
4. Define the environment variables in a `.env` file
```
DATABASE_URL="postgresql://username:password@localhost:5432/database-name?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```
- For the `DATABASE_URL`, replace `username` and `password` with your PostgreSQL database username and password and `database-name` with the name of your database. If the database is not running on localhost with default port, replace `localhost:5432` with the correct host and port. You can use other databases which are supported by Prisma, but they have to support defining enums ([more info](https://www.prisma.io/docs/orm/reference/database-features#misc)).
- The `NEXTAUTH_SECRET` can be any random string (recommended way to get this value on UNIX is by running `openssl rand -base64 32`).
5. Setup the database by running `npm run prisma:migrate-dev`
6. Run `npm run dev` to start the development server

## Testing
To run the tests, use the following command:
```
npm run test
```
Or to run the tests with coverage report:
```
npm run test:coverage
```

The tests are written using Jest and React Testing Library. They are defined in the `*.test.tsx` files.

