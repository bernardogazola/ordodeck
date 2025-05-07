import { auth } from "@/auth";
import { Badge } from "@repo/ui/components/badge";
import { formatDate } from "@repo/utils";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { Clock, PlusCircle } from "lucide-react";

const mockBoards = [
  {
    id: 1,
    name: "Projeto 1",
    role: "Administrador",
    description: "Descrição do projeto 1",
    updatedAt: new Date(),
  },
];

const Dashboard = async () => {
  const session = await auth();
  const boards = mockBoards;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Bem-vindo de volta, {session?.user.name}
        </h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Seus Projetos</h2>

        {boards.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-medium mb-2">Nenhum projeto ainda</h3>
              <p className="text-gray-500 mb-4">
                Crie seu primeiro projeto para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className="block"
              >
                <Card className="h-full hover:bg-accent">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">{board.name}</h3>
                      <Badge variant="outline">{board.role}</Badge>
                    </div>
                  </CardHeader>
                  {board.description && (
                    <CardContent className="py-2">
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {board.description}
                      </p>
                    </CardContent>
                  )}
                  <CardFooter className="pt-2 text-xs text-gray-400">
                    <Clock className="size-4 mr-2" />
                    Atualizado em {formatDate(board.updatedAt)}
                  </CardFooter>
                </Card>
              </Link>
            ))}

            <Card className="h-full border-2 border-dashed hover:bg-accent">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <PlusCircle className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">
                  Crie um novo projeto
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
