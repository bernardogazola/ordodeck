"use client";

import SignOut from "@/components/auth/sign-out";
import ROUTES from "@/constants/routes";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Shield, Smartphone, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileSidebar = () => {
  const menuItems = [
    { id: "general", label: "Geral", icon: User, href: ROUTES.PROFILE.GENERAL },
    {
      id: "security",
      label: "Segurança e Login",
      icon: Shield,
      href: ROUTES.PROFILE.SECURITY,
    },
    {
      id: "sessions",
      label: "Sessões Ativas",
      icon: Smartphone,
      href: ROUTES.PROFILE.SESSIONS,
    },
  ];

  const pathname = usePathname();

  return (
    <div className="bg-card rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Configurações</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                `w-full justify-start`,
                pathname === item.href && "bg-secondary"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}

        <SignOut />
      </nav>
    </div>
  );
};

export default ProfileSidebar;
