import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ThirdwebProvider } from "./components/ThirdwebProvider";

import { Root } from "@/components/Root/Root";
import { I18nProvider } from "@/core/i18n/provider";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";
import { WalletProvider } from "@/components/WalletContext/WalletContext";

export const metadata: Metadata = {
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <I18nProvider>
          <Root>
            <WalletProvider>
              <ThirdwebProvider clientId="604147da359f234c89dfa4796ae7481e">
                {children}
              </ThirdwebProvider>
            </WalletProvider>
          </Root>
        </I18nProvider>
      </body>
    </html>
  );
}
