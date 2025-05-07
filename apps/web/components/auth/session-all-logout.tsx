"use client";

import { signOutAllDevice } from "@/lib/actions/auth.action";
import { Button } from "@repo/ui/components/button";
import { Loader2, LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const SessionAllLogout = () => {
  const router = useRouter();
  const { toast } = useToast();

  const signOutAllDevicesMutation = useMutation({
    mutationFn: async () => {
      const response = (await signOutAllDevice()) as ActionResponse;
      if (!response.success) {
        throw new Error(
          response.error?.message || "Falha ao sair de todas as sessões"
        );
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Saiu de todas as sessões", {
        description: "Você saiu de todas as sessões com sucesso.",
      });
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => {
      toast.error("Falha ao sair de todas as sessões", {
        description: error.message,
      });
    },
  });
  return (
    <Button
      variant="outline"
      className="flex items-center gap-1"
      disabled={signOutAllDevicesMutation.isPending}
      onClick={() => {
        signOutAllDevicesMutation.mutateAsync();
      }}
    >
      {signOutAllDevicesMutation.isPending ? (
        <Loader2 className="size-4 mr-1 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 mr-1" />
      )}
      Sair de todas as sessões
    </Button>
  );
};

export default SessionAllLogout;
