"use client";

import type React from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Session } from "next-auth";
import { useState } from "react";

// TODO: Implementar a funcionalidade de salvar as alterações
export default function GeneralSettings({
  session,
}: {
  session: Session | null;
}) {
  const [userData, setUserData] = useState({
    name: session?.user.name ?? "",
    email: session?.user.email ?? "",
    username: session?.user.username ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Atualize suas informações básicas de perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                disabled
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Endereço de email</Label>
            <Input
              disabled
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Nome de usuário</Label>
            <Input
              disabled
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled>Salvar alterações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Excluir conta</CardTitle>
          <CardDescription>
            Permanente excluir sua conta e todos os seus conteúdos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Uma vez que você excluir sua conta, não há como voltar. Por favor,
            seja certo.
          </p>
        </CardContent>
        <CardFooter>
          <Button disabled variant="destructive">
            Excluir conta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
