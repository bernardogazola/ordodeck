import { auth } from "@/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { BadgeCheck, Camera, Edit } from "lucide-react";
import Image from "next/image";
import { getInitials } from "@repo/utils";

const ProfileHeader = async () => {
  const session = await auth();

  return (
    <div className="relative pb-4">
      <div className="h-48 sm:h-64 w-full relative rounded-b-lg overflow-hidden">
        <Image
          src={"/placeholder.svg"}
          alt="Cover"
          fill
          className="w-full h-full object-cover"
        />
        <Button
          size="sm"
          variant="secondary"
          className=" absolute bottom-4 right-4 hidden items-center gap-1"
        >
          <Camera className="h-4 w-4" />
          <span>Editar foto de capa</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20 ml-0 sm:ml-8 relative z-10">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={"/placeholder.svg"} alt={"placeholder"} />
            <AvatarFallback>
              {getInitials(session?.user.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
          >
            <Camera className="h-4 w-4" />
          </Button>
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
          <Button
            size="sm"
            variant="outline"
            className=" hidden items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            <span>Editar perfil</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
