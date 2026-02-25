import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  directorId: string;
  role: string;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({...payload})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedSecret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('director_session')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function setSession(payload: SessionPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  
  cookieStore.set('director_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('director_session');
}
