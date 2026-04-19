import { unwrapParams } from "../lib/unwrapParams";
import { getUserRecord } from "../lib/user";
import BillingClient from "./BillingClient";

export default async function BillingPage({
  params,
}: {
  params: { clientID: string } | Promise<{ clientID: string }>;
}) {
  const { clientID } = unwrapParams(params);
  const { user } = await getUserRecord(clientID);
  return <BillingClient clientID={clientID} user={user} />;
}
