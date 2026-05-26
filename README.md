This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Audio Room Auth And LiveKit

Audio Room is a protected application area. Users must have a valid access token and an active account before the frontend renders the room UI, calls audio APIs, requests LiveKit tokens, or opens the Socket.IO connection.

Required backend environment variables:

```bash
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=7d
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Required frontend environment variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
```

Deployment notes:

- Keep `LIVEKIT_API_SECRET`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` only on the backend.
- Issue LiveKit tokens through `POST /api/audio-room/livekit/token`; the client must not sign LiveKit tokens.
- In production, serve over HTTPS so auth cookies are sent with `Secure` and `SameSite=None`.
- Configure CORS origins with the deployed frontend URL through `CLIENT_URL` or `FRONTEND_URL`.
- Run backend tests with `cd backend && npm test`.
