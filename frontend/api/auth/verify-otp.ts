import type { VercelRequest, VercelResponse } from '@vercel/node';

// Code OTP de démo pour la présentation
const VALID_OTP = '1234';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { otp } = req.body;

  if (otp === VALID_OTP) {
    return res.status(200).json({ success: true, message: 'Authentification réussie' });
  } else {
    return res.status(200).json({ success: false, message: 'Code OTP invalide' });
  }
}
