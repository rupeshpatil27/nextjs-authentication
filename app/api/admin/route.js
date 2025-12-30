import { userRole } from "@/constants";
import { currentRole } from "@/lib/auth";

export async function GET() {
  const role = await currentRole();

  if (role === userRole.ADMIN) {
    return Response.json(null, { status: 200 });
  }
  return Response.json(null, { status: 403 });
}
