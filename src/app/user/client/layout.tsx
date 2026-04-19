import UserShell from "./components/UserShell";
import { unwrapParams } from "./lib/unwrapParams";
import { getUserRecord } from "./lib/user";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { clientID: string } | Promise<{ clientID: string }>;
}) {
  const { clientID } = unwrapParams(params);
  const { user, error } = await getUserRecord(clientID);

  return (
    <UserShell clientID={clientID} user={user} userError={error}>
      {children}
    </UserShell>
  );
}
