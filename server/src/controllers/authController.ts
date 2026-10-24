import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { AuthRequest, JWT_SECRET } from '../middleware/auth.js';
import { User, UserRole } from '../types.js';

export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, email, password, role, phone, address, organization } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = db.users.findOne(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const validRoles: UserRole[] = ['individual', 'partner', 'recycler', 'admin'];
    const chosenRole: UserRole = validRoles.includes(role) ? role : 'individual';

    // Partners and Recyclers can be set to active or pending verification
    const accountStatus = chosenRole === 'admin' ? 'active' : 'active';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: chosenRole,
      status: accountStatus,
      phone: phone || '',
      address: address || '',
      organization: organization || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.users.insert(newUser);

    db.logAudit(
      newUser.id,
      newUser.name,
      newUser.role,
      'USER_REGISTERED',
      'User',
      newUser.id,
      undefined,
      { email: newUser.email, role: newUser.role }
    );

    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        phone: newUser.phone,
        address: newUser.address,
        organization: newUser.organization,
        createdAt: newUser.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({ success: false, message: `Your account is currently ${user.status}. Please contact support.` });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        address: user.address,
        organization: user.organization,
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
}

export function getMe(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const user = db.users.findById(req.user.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User record not found.' });
    return;
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      address: user.address,
      organization: user.organization,
      createdAt: user.createdAt
    }
  });
}

export function updateProfile(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const { name, phone, address, organization } = req.body;
  const prev = db.users.findById(req.user.id);

  const updated = db.users.update(req.user.id, {
    ...(name ? { name } : {}),
    ...(phone !== undefined ? { phone } : {}),
    ...(address !== undefined ? { address } : {}),
    ...(organization !== undefined ? { organization } : {}),
    updatedAt: new Date().toISOString()
  });

  if (updated) {
    db.logAudit(req.user.id, req.user.name, req.user.role, 'UPDATE_PROFILE', 'User', req.user.id, prev, updated);
  }

  res.json({ success: true, message: 'Profile updated successfully.', user: updated });
}

export function logout(req: AuthRequest, res: Response): void {
  res.json({ success: true, message: 'Logged out successfully.' });
}
