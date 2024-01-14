import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta property="custom" content="123123" />
          <Script
            strategy="beforeInteractive"
            src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
          />
        </Head>
        <body className="w-[100%] md:max-w-[1200px] mx-auto md:mt-[70px] mt-[45px]">
          <Main />
        </body>
        <NextScript />
      </Html>
    );
  }
}
