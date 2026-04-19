import { unwrapParams } from "../lib/unwrapParams";
import { getUserRecord } from "../lib/user";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage({
  params,
}: {
  params: { clientID: string } | Promise<{ clientID: string }>;
}) {
  const { clientID } = unwrapParams(params);
  const { user, error } = await getUserRecord(clientID);
  return <ProfileClient clientID={clientID} user={user} error={error} />;
}
