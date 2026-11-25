import { redirect } from "next/navigation";

export default async function LegacyCategoryRedirect(props: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await props.params;
  redirect(`/${categorySlug}`);
}
