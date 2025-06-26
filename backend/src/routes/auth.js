import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    domain: process.env.COOKIE_DOMAIN,
    path: '/',
  });
}

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'Campos obrigatórios' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email já cadastrado' });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  setAuthCookie(res, token);

  res.json({ id: user.id, email: user.email, name: user.name });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Campos obrigatórios' });

  const user = await prisma.user.findUnique({ where: { email } });//email nao encontrado
  if (!user) return res.status(401).json({ error: 'Invalid Credentials' });

  const valid = await comparePassword(password, user.password);//senha incorreta
  if (!valid) return res.status(401).json({ error: 'Invalid Credentials' });

  //criando token e setando cookie
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  setAuthCookie(res, token);

  res.json({ id: user.id, email: user.email, name: user.name });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', { domain: process.env.COOKIE_DOMAIN, path: '/' });
  res.json({ ok: true });
});

// rota para saber se o usuario está logado
router.get('/me', authenticateJWT, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: 'User Not Found!' });

  res.json({ id: user.id, email: user.email, name: user.name });
});
export default router;
