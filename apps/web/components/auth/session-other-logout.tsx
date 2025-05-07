"use client";

import { signOutOtherDevice } from "@/lib/actions/auth.action";
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

const SessionOtherLogout = ({ session_token }: { session_token: string }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const signOutOtherDeviceMutation = useMutation({
    mutationFn: async () => {
      const response = (await signOutOtherDevice({
        session_token,
      })) as ActionResponse;
      if (!response.success) {
        throw new Error(
          response.error?.message || "Falha ao sair do outro dispositivo"
        );
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Saiu do outro dispositivo", {
        description: "Você saiu do outro dispositivo com sucesso.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Falha ao sair do outro dispositivo", {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-destructive dark:hover:text-white"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sair
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sair deste dispositivo?</AlertDialogTitle>
          <AlertDialogDescription>
            O dispositivo selecionado será desconectado e precisará fazer login
            novamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancelar</Button>
          </AlertDialogCancel>
          <Button
            disabled={signOutOtherDeviceMutation.isPending}
            variant="destructive"
            onClick={async () => {
              signOutOtherDeviceMutation.mutateAsync();
            }}
          >
            {signOutOtherDeviceMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sair
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionOtherLogout;
