import "@/app/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AntdThemeProvider from "./AntdThemeProvider";
import AntdAppProvider from "./AntdAppProvider";
import { ReduxProvider } from "./StoreProvider";
import NotificationHolder from "@/hooks/NotificationHolder";
import PageTransition from "@/components/PageTransition";
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
              <AntdThemeProvider>
                <AntdRegistry>
                  <AntdAppProvider>
                    <NotificationHolder />
                    <PageTransition />
                    {children}
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
