import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'orange-assistant-backend' });
});

app.listen(PORT, () => {
  console.log(`Serveur Orange Assistant dynamique démarré sur le port ${PORT}`);
});
