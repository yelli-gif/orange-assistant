import { Request, Response } from 'express';

// Logique simulée de demande d'OTP
export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Numéro de téléphone requis' });
    }

    // On simule l'envoi d'un OTP
    res.json({ message: 'OTP envoyé avec succès sur le mobile ' + phoneNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la demande OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Numéro et OTP requis' });
    }

    if (otp === '1234') { // Mock d'OTP valide
      res.json({ success: true, token: 'mock-jwt-token-1234' });
    } else {
      res.status(401).json({ error: 'OTP Invalide' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la vérification OTP' });
  }
};
