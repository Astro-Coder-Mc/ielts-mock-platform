import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Telegraf, Context } from 'telegraf';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory sessions for login
const loginSessions = new Map<string, { username: string; phone: string; status: 'completed' | 'pending' }>();
const pendingBotSessions = new Map<number, string>(); // chatId -> loginId

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Telegram Bot Setup
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  let bot: Telegraf<Context> | null = null;

  if (BOT_TOKEN) {
    bot = new Telegraf(BOT_TOKEN);

    bot.start((ctx) => {
      const payload = (ctx as any).payload; // Code passed in the link ?start=XYZ
      if (payload) {
        pendingBotSessions.set(ctx.chat.id, payload);
        ctx.reply('Assalomu alaykum! IELTS Master botiga xush kelibsiz. 🎓\n\nIltimos, telefon raqamingizni yuborish orqali shaxsingizni tasdiqlang:', {
          reply_markup: {
            keyboard: [
              [{ text: '📱 Telefon raqamni yuborish', request_contact: true }]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
          }
        });
      } else {
        ctx.reply('Ilova ichidagi "Sign in" tugmasini bosing va botga qayting.');
      }
    });

    bot.on('contact', (ctx) => {
      const contact = ctx.message.contact;
      const firstName = contact.first_name || 'User';
      const phone = contact.phone_number;
      const loginId = pendingBotSessions.get(ctx.chat.id);
      
      if (loginId) {
        loginSessions.set(loginId, { username: firstName, phone, status: 'completed' });
        pendingBotSessions.delete(ctx.chat.id);
        ctx.reply(`Raxmat, ${firstName}! Siz muvaffaqiyatli kirdingiz. ✅\nEndi saytga qaytishingiz mumkin.`, {
          reply_markup: { remove_keyboard: true }
        });
      } else {
        ctx.reply('Xatolik: login seans topilmadi. Iltimos saytdan qaytadan urinib ko\'ring.');
      }
    });

    bot.launch().then(() => console.log('Telegram Bot running...'));
  } else {
    console.warn('TELEGRAM_BOT_TOKEN is missing. Bot will not start.');
  }

  // API Endpoints
  app.get('/api/auth/status/:loginId', (req, res) => {
    const { loginId } = req.params;
    const session = loginSessions.get(loginId);
    if (session) {
      res.json({ success: true, session });
    } else {
      res.json({ success: false });
    }
  });

  app.post('/api/auth/complete', (req, res) => {
    const { username, phone, loginId } = req.body;
    // For this demo, let's just allow direct completion
    const session = { username, phone, status: 'completed' as const };
    loginSessions.set(loginId || 'default', session);
    res.json({ success: true, user: session });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
