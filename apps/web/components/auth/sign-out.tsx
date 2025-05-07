"use client";

import { signOutCurrentDevice } from "@/lib/actions/auth.action";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import { Loader2, LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const SignOut = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const signOutCurrentDeviceMutation = useMutation({
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
      setOpen(false);
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => {
      toast.error("Falha ao sair da sessão atual", {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-destructive dark:hover:text-white"
          variant="ghost"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sair?</AlertDialogTitle>
          <AlertDialogDescription>
            Você precisará fazer login novamente para acessar sua conta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancelar</Button>
          </AlertDialogCancel>
          <Button
            disabled={signOutCurrentDeviceMutation.isPending}
            variant="destructive"
            onClick={async () => {
              signOutCurrentDeviceMutation.mutateAsync();
            }}
          >
            {signOutCurrentDeviceMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sair
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignOut;
