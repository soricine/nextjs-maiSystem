import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next.js 16 removed the `next lint` command, so ESLint runs directly
// (see the `lint` script in package.json). eslint-config-next 16 already
// exports flat config, so it can be spread straight in.
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "prisma/migrations/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
