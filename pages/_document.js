// pages/_document.js

import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";
import { theme } from "@/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="DeFiTalks | World's first DeFi social media platform."
        />
        <meta property="og:title" content="Defi Talks" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://defitalks.io/" />
        <meta property="og:image" content="/og-img.jpg" />
        <meta
          property="og:description"
          content="World's first DeFi social media platform."
        />
        <meta property="og:site_name" content="Defi Talks" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sakaivault" />
        <meta name="twitter:title" content="Defi Talks" />
        <meta
          name="twitter:description"
          content="World's first DeFi social media platform."
        />
        <meta name="twitter:image" content="/og-img.jpg" />
        <meta name="twitter:image:alt" content="Defi Talks" />
        <meta name="twitter:creator" content="@sakaivault" />
        <meta name="twitter:creator:id" content="sakaivault" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="twitter:card"
          content="
         World's first DeFi social media platform. 
        "
        />
        <meta name="twitter:site" content="@sakaivault" />
        <meta
          name="twitter:title"
          content=" 
          World's first DeFi social media platform.
        "
        />
        <meta
          name="twitter:description"
          content="
          Share your thoughts, ideas, and projects with the world.
        "
        />
        <meta name="twitter:image" content="/og-img.jpg" />
      </Head>
      <body>
        {/* 👇 Here's the script */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
