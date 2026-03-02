import { getCurrentUser } from "@/server/actions/authActions";
import { HeaderClient } from "./HeaderClient";

export default async function HeaderServer() {
  const user = await getCurrentUser();
  return <HeaderClient user={user} />;
}