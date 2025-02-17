import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

// const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
const network = SOLANA_NETWORK;

// set custom RPC server endpoint for the final website
// const endpoint = "https://explorer-api.devnet.solana.com";
// const endpoint = "http://127.0.0.1:8899";

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#0B0A0C"
    },
    text: {
      primary: "#fff"
    }
  }
});


function MyApp({ Component, pageProps }: AppProps) {
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect>

        <ThemeProvider theme={darkTheme}>
          <Component {...pageProps} />
        </ThemeProvider>

      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
