"use client";

import Link from "next/link";
import NavUser from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@repo/ui/components/sidebar";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import APP_SIDEBAR from "@/constants/appSidebar";

interface AppSidebarProps {
  props: React.ComponentProps<typeof Sidebar>;
  session: Session;
}

function SidebarLogo() {
  return (
    <div className="flex gap-2 px-2 group-data-[collapsible=icon]:px-0 transition-[padding] duration-200 ease-in-out">
      <Link className="group/logo inline-flex items-center gap-2" href="/">
        <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden transition-opacity duration-200 ease-in-out">
          Ordodeck
        </span>
      </Link>
    </div>
  );
}

export function AppSidebar({ props, session }: AppSidebarProps) {
  const pathname = usePathname();
  const items = APP_SIDEBAR.navMain;

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {items.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/65">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((menuItem) => (
                  <SidebarMenuItem key={menuItem.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button group-data-[collapsible=icon]:px-[5px]! font-medium gap-3 h-9 [&>svg]:size-auto"
                      tooltip={menuItem.title}
                      isActive={pathname === menuItem.url}
                    >
                      <Link href={menuItem.url}>
                        {menuItem.icon && (
                          <menuItem.icon
                            className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{menuItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
