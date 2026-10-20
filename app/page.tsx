import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "./providers";
import { AppShell } from "@/components/shell/AppShell";
import { Sprite } from "@/components/ui/Sprite";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <Providers session={session}>
      <Sprite />
      <AppShell />
    </Providers>
  );
}