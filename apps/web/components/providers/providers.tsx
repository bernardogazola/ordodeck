import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export async function Providers({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <SessionProvider session={session}>{children}</SessionProvider>
    </NextThemesProvider>
  );
}
