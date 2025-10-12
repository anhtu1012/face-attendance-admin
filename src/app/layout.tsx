import "@/app/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AntdThemeProvider from "./AntdThemeProvider";
import AntdAppProvider from "./AntdAppProvider";
import AntdMessageProvider from "@/hooks/AntdMessageProvider";
import { ReduxProvider } from "./StoreProvider";
import NotificationHolder from "@/hooks/NotificationHolder";
import PageTransition from "@/components/PageTransition";
import SocketProvider from "@/components/SocketProvider";
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
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ReduxProvider>
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
