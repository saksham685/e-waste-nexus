import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { loginSchema, registerSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_jwt_key_2026_circular_tech';

// GET: Current Authenticated User Session
export async function GET(req: NextRequest) {
  const token = req.cookies.get('nexus_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; name: string };
    const user = db.users.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ authenticated: true, user: safeUser });
  } catch (err) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}

// POST: Login / Register dispatcher
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'login';

    if (action === 'register') {
      const validated = registerSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ error: validated.error.issues[0]?.message }, { status: 400 });
      }

      const { name, email, password, role, organization, phone } = validated.data;
      const existing = db.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return NextResponse.json({ error: 'Account already exists with this email' }, { status: 409 });
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
        organization,
        phone,
        createdAt: new Date().toISOString(),
      };

      db.users.insert(newUser);
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({ success: true, user: newUser, token });
      response.cookies.set('nexus_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // Default: Login
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0]?.message }, { status: 400 });
    }

    const { email, password } = validated.data;
    const user = db.users.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.passwordHash || !bcrypt.compareSync(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    const response = NextResponse.json({ success: true, user: safeUser, token });
    response.cookies.set('nexus_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 500 });
  }
}
