/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");

/** eslint-disable @typescript-eslint/no-var-requires */
const withTM = require("next-transpile-modules")([
  "@solana/wallet-adapter-base",
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-wallets",
]);

// add this if you need LESS
// also install less and less-loader
// const withLess = require("next-with-less");

const plugins = [
  // add this if you need LESS
  // [withLess, {
  //   lessLoaderOptions: {
  //     /* ... */
  //   },
  // }],
  [
    withTM,
    {
      webpack5: true,
      reactStrictMode: true,
    },
  ],
];

const nextConfig = {
  distDir: "build",
  swcMinify: false,
  env: {
    PROGRAM_ID: "HeA7Q5iBz3rkdjhyTHApyVFuks7uTM7brGidxVfwgqJM",
    PUBLISH_NETWORK: "devnet",
    PLAYER_POOL_SIZE: 120,     // 8 + 41056
    GLOBAL_AUTHORITY_SEED: "global-authority",
    VAULT_AUTHORITY_SEED: "vault-authority",
    RANDOM_SEED: "set-random-number",
    PLAYER_SEED: "player-vault",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      // FIX this
      // Disable minimize to make it work with Candy Machine template
      // minimization brakes Public Key names
      config.optimization.minimize = true;
    }
    return config;
  },
};

module.exports = withPlugins(plugins, nextConfig);
