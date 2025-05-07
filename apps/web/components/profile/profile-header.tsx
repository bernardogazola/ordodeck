import { auth } from "@/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { BadgeCheck, ChevronLeft } from "lucide-react";
import { getInitials } from "@repo/utils";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const ProfileHeader = async () => {
  const session = await auth();

  return (
    <div className="relative pb-4 pt-5">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href={ROUTES.DASHBOARD}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 ml-0 sm:ml-8 relative z-10">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={"/placeholder.svg"} alt={"placeholder"} />
            <AvatarFallback>
              {getInitials(session?.user.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-4 mb-2 sm:mb-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {session?.user.name}
              <BadgeCheck className="size-4 text-blue-500" />
            </h1>
            <p className="text-sm text-muted-foreground">
              {session?.user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
