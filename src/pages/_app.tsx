import { AuthProvider } from "@/context/authProvider";
import { PopUpProvider } from "@/context/popUpProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PopUpProvider>
        <Component {...pageProps} />
      </PopUpProvider>
    </AuthProvider>
  );
}
