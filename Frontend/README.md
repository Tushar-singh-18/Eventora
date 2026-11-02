# React + Vite

## Eventora read-only demo admin

Choose **Try demo admin (read-only)** on the login page to view sample events and bookings without entering credentials. The demo role is restricted on the API: it can view seeded demo events and bookings but cannot create, edit, delete, approve, or cancel records.

Before enabling the demo button on a deployment, configure `MONGO_URI` and `JWT_SECRET` for the backend and run the following from the `Backend` directory:

```sh
npm run seed:demo
```

The demo seeder is safe to run more than once and does not clear or overwrite existing data. It creates a demo admin plus clearly marked sample events, attendees, and bookings. Set `DEMO_ADMIN_EMAIL` in the backend environment if using a non-default demo account email; keep it consistent when running the seeder and deploying the API.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
