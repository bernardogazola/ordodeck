"use client";

import { MoreHorizontal, LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/sidebar";
import ROUTES from "@/constants/routes";
import { Session } from "next-auth";
import { getInitials } from "@repo/utils";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { signOutCurrentDevice } from "@/lib/actions/auth.action";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useRouter } from "next/navigation";

const NavUser = ({ session }: { session: Session | null }) => {
  const { isMobile } = useSidebar();
  const { toast } = useToast();
  const router = useRouter();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const response = (await signOutCurrentDevice()) as ActionResponse;
      if (!response.success) {
        throw new Error(
          response.error?.message || "Falha ao sair da sessão atual"
        );
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Saiu da sessão atual", {
        description: "Você saiu da sessão atual com sucesso.",
      });
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => {
      toast.error("Falha ao sair da sessão atual", {
        description: error.message,
      });
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="in-data-[state=expanded]:size-6 transition-[width,height] duration-200 ease-in-out">
                <AvatarFallback>
                  {getInitials(session?.user.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ms-1">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
              </div>
              <div className="size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent">
                <MoreHorizontal className="size-5 opacity-40" size={20} />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <Link href={ROUTES.PROFILE.GENERAL}>
              <DropdownMenuItem className="gap-3 px-1 cursor-pointer">
                <User
                  size={20}
                  className="text-muted-foreground/70"
                  aria-hidden="true"
                />
                <span>Perfil</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="gap-3 px-1">
              <Settings
                size={20}
                className="text-muted-foreground/70"
                aria-hidden="true"
              />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 px-1 text-destructive focus:text-destructive"
              onClick={() => signOutMutation.mutate()}
            >
              <LogOut
                size={20}
                className="text-muted-foreground/70"
                aria-hidden="true"
              />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
