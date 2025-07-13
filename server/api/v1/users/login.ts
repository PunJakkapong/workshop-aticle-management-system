import type { H3Event } from "h3";
import { sendError } from "h3";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

// NOTE: This endpoint now works with client-side storage (IndexedDB/localStorage)
// The actual authentication logic should be handled client-side
// This endpoint serves as a fallback/demo for testing purposes

export default defineEventHandler(async (event: H3Event) => {
  if (event.method !== "POST") {
    return sendError(
      event,
      createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
    );
  }

  const body = await readBody(event);
  const { username, email, password } = body || {};

  if ((!username && !email) || !password) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Missing required fields" })
    );
  }

  // Demo credentials for testing (client-side storage handles real auth)
  const demoUsers = [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
      role: "admin"
    },
    {
      id: 2,
      username: "demo",
      email: "demo@example.com", 
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
      role: "author"
    }
  ];

  // Find demo user
  const user = demoUsers.find(u => 
    (username && u.username === username) || 
    (email && u.email === email)
  );

  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Invalid credentials. Use demo/admin with password 'password'"
      })
    );
  }

  // Compare password (demo password is "password")
  const valid = await compare(password, user.password);
  if (!valid) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Invalid credentials. Use demo/admin with password 'password'"
      })
    );
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );

  return {
    success: true,
    message: "Login successful. Note: Real authentication is handled client-side via IndexedDB.",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token,
    clientSideNote: "For production use, implement client-side authentication with IndexedDB user storage"
  };
});
