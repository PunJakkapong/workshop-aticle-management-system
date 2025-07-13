import { sendError } from "h3";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  // Only protect /api routes
  if (!event.path.startsWith("/api/")) return;

  // Allow unauthenticated access to register and login endpoints
  if (
    event.path === "/api/v1/users/register" ||
    event.path === "/api/v1/users/login"
  ) {
    return;
  }

  const authHeader = event.node.req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    event.context.auth = decoded;
  } catch {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Invalid token" })
    );
  }
});
