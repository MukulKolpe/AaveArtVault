import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer/Footer";
import { WagmiConfig, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";

const chains = [sepolia];

const connectkitConfig = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
    appName: "LFGHO",
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains,
  })
);
import Head from "next/head";
const colors = {
  brand: {
    50: "#ecefff",
    100: "#cbceeb",
    200: "#a9aed6",
    300: "#888ec5",
    400: "#666db3",
    500: "#4d5499",
    600: "#3c4178",
    700: "#2a2f57",
    800: "#181c37",
    900: "#080819",
  },
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ colors, config });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AaveArtVault</title>
        <meta name="description" content="AaveArtVault" />
        {/* <!-- Google tag (gtag.js) --> */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || []; function gtag()
          {dataLayer.push(arguments)}
          gtag('js', new Date()); gtag('config', "${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}");
          `,
          }}
        ></script>
      </Head>
      <ChakraProvider theme={theme}>
        <WagmiConfig config={connectkitConfig}>
          <ConnectKitProvider>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </div>
          </ConnectKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </>
  );
}
