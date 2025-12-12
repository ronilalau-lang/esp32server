import 'dotenv/config';
import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Inicializa Firebase Admin usando variáveis de ambiente
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
  databaseURL: process.env.DATABASE_URL
});

// Token salvo no Render
const DEVICE_TOKEN = process.env.DEVICE_TOKEN;

// Ambientes monitorados
const ambientes = ["quarto", "cozinha", "banheiro", "quintal"];

// Evita notificações repetidas
const ultimoEstado = {};

const db = admin.database();

ambientes.forEach((amb) => {
  const ref = db.ref(`${amb}/ambiente`);

  ref.on("value", async (snap) => {
    const novoValor = snap.val();

    console.log(`📌 Ambiente ${amb} mudou para:`, novoValor);

    if (ultimoEstado[amb] === undefined) {
      ultimoEstado[amb] = novoValor;
      return;
    }

    if (novoValor !== ultimoEstado[amb]) {
      ultimoEstado[amb] = novoValor;

      const texto =
        novoValor === 1
          ? `${amb.toUpperCase()} ficou CLARO 💡`
          : `${amb.toUpperCase()} ficou ESCURO 🌑`;

      const message = {
        token: DEVICE_TOKEN,
        notification: {
          title: `Mudança no ${amb}`,
          body: texto
        }
      };

      try {
        await admin.messaging().send(message);
        console.log(`📨 Notificação enviada: ${texto}`);
      } catch (e) {
        console.error("❌ Erro ao enviar notificação:", e);
      }
    }
  });
});

// Página principal
app.get("/", (req, res) => {
  res.send("Servidor FCM rodando!");
});

app.listen(PORT, () => {
  console.log("🚀 Server listening on port " + PORT);
});