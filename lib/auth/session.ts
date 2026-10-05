import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const SECRET = process.env.SESSION_SECRET!;
const COOKIE_NAME = 'session_token';
const EXPIRES_IN = "7d";

type SessionPayload = {
  userId: string;
}

const createSession = async (userId: string) => {
    const token = jwt.sign({ userId }, SECRET, { expiresIn: EXPIRES_IN });
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });
}

const getSession = async () => {
  // Implementation for retrieving a session based on the provided token
  // This could involve verifying the JWT token, fetching session data, etc.
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

const destroySession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { createSession, getSession, destroySession }