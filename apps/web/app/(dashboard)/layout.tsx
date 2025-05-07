import { auth } from "@/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import ROUTES from "@/constants/routes";
import { redirect } from "next/navigation";
import { Separator } from "@repo/ui/components/separator";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { PropsWithChildren } from "react";
import ToggleTheme from "@/components/providers/theme-toggle";

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <SidebarProvider>
      <AppSidebar props={{}} session={session} />
      <SidebarInset>
        <div className="px-4 md:px-6 lg:px-8 @container">
          <div className="w-full max-w-6xl mx-auto">
            <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b">
              {/* LADO ESQUERDO */}
              <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ms-1" />
                <div className="max-lg:hidden lg:contents">
                  <Separator
                    orientation="vertical"
                    className="me-2 data-[orientation=vertical]:h-4"
                  />
                </div>
              </div>
              {/* LADO DIREITO */}
              <ToggleTheme />
            </header>
            <div className="overflow-hidden">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
