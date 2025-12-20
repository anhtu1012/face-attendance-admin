import "@/app/globals.css";
import PageTransition from "@/components/PageTransition";
import SocketProvider from "@/components/SocketProvider";
import TitleFromPermissions from "@/components/TitleFromPermissions";
import AntdMessageProvider from "@/hooks/AntdMessageProvider";
import NotificationHolder from "@/hooks/NotificationHolder";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AntdAppProvider from "./AntdAppProvider";
import AntdThemeProvider from "./AntdThemeProvider";
import { ReduxProvider } from "./StoreProvider";
// import BubbleCursor from "@/components/BubbleCursor";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ReduxProvider>
              <TitleFromPermissions />
              <SocketProvider />
              <AntdThemeProvider>
                <AntdRegistry>
                  <AntdAppProvider>
                    <AntdMessageProvider>
                      <NotificationHolder />
                      <PageTransition />
                      {children}
                    </AntdMessageProvider>
                  </AntdAppProvider>
                </AntdRegistry>
              </AntdThemeProvider>
              <ToastContainer />
            </ReduxProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
