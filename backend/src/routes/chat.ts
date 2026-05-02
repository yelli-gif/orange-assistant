import { Router } from 'express';
import { handleChat } from '../controllers/chatController';

const router = Router();

// Route pour envoyer un message à l'IA ou simuler une réponse
router.post('/', handleChat);

export default router;
