import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  return <div>Session: {session?.user.name}</div>;
};

export default Dashboard;
