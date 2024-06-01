## Solana Mugs Fronend

### V1 Version

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Solana Labs Source](https://github.com/solana-labs/governance-ui) - Sample UI from Solana Labs

## Issues

You can meet this error when running this boilerplate

```bash
TypeError: Endpoint URL must start with `http:` or `https:`.
```

Please check `.env.example` and make `.env` file in root directory and set RPC url.
