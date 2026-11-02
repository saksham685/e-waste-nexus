'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/lib/validations';
import { User } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_jwt_key_2026_circular_tech';

export async function loginAction(data: LoginFormData) {
  // 1. Zod Schema Validation
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Validation failed',
    };
  }

  const { email, password } = validated.data;
  const user = db.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !user.passwordHash) {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }

  // 2. Generate Session Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 3. Set HttpOnly Cookie (Unit IV: Session Management & Security Best Practices)
  const cookieStore = cookies();
  cookieStore.set('nexus_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const { passwordHash, ...safeUser } = user;
  return {
    success: true,
    user: safeUser as User,
    token,
  };
}

export async function registerAction(data: RegisterFormData) {
  // 1. Zod Schema Validation
  const validated = registerSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Validation failed',
    };
  }

  const { name, email, password, role, organization, phone } = validated.data;

  // Check duplicate
  const existing = db.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists',
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    status: 'active' as const,
    organization: organization || undefined,
    phone: phone || undefined,
    createdAt: new Date().toISOString(),
  };

  db.users.insert(newUser);

  // Auto-login session token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const cookieStore = cookies();
  cookieStore.set('nexus_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  const { passwordHash: _, ...safeUser } = newUser;
  return {
    success: true,
    user: safeUser as User,
    token,
  };
}

export async function logoutAction() {
  const cookieStore = cookies();
  cookieStore.delete('nexus_token');
  return { success: true };
}
