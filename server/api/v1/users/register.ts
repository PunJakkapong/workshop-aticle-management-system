import type { H3Event } from "h3";
import { sendError } from "h3";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "../../../models/user";
import { validateUser } from "../../../models/user";

// NOTE: This endpoint now works with client-side storage (IndexedDB/localStorage)
// The actual user registration should be handled client-side
// This endpoint serves as a fallback/demo for testing purposes

export default defineEventHandler(async (event: H3Event) => {
  if (event.method !== "POST") {
    return sendError(
      event,
      createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
    );
  }

  const body = await readBody(event);
  const { username, password, email, firstName, lastName } = body || {};

  if (!username || !password || !email) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Missing required fields" })
    );
  }

  // Validate user data
  const validation = validateUser({ username, password, email });
  if (!validation.isValid) {
    return sendError(
      event,
      createError({ 
        statusCode: 400, 
        statusMessage: validation.errors.join(', ')
      })
    );
  }

  // Demo user storage (in production, this would be handled client-side)
  const reservedUsernames = ['admin', 'demo', 'test', 'root'];
  const reservedEmails = ['admin@example.com', 'demo@example.com'];

  if (reservedUsernames.includes(username.toLowerCase()) || 
      reservedEmails.includes(email.toLowerCase())) {
    return sendError(
      event,
      createError({
        statusCode: 409,
        statusMessage: "Username or email already exists (demo accounts)"
      })
    );
  }

  // Hash password
  const hashedPassword = await hash(password, 10);

  // Create demo user object (client-side would save to IndexedDB)
  const newUser: Partial<User> = {
    id: Date.now(), // Simple ID generation for demo
    username,
    email,
    password: hashedPassword,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    role: 'reader', // Default role
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    preferences: {
      theme: 'system',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        comments: true,
        mentions: true
      }
    }
  };

  // Generate JWT token
  const token = jwt.sign(
    {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );

  return {
    success: true,
    message: "Registration successful. Note: Real user storage is handled client-side via IndexedDB.",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      createdAt: newUser.createdAt
    },
    token,
    clientSideNote: "For production use, implement client-side user registration with IndexedDB user storage"
  };
});
