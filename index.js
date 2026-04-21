require('dotenv').config();
const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS))
});
const db = admin.firestore();

const app = express();
app.use(express.json());

// Tu número como reclutador
const NUMERO_RECLUTADOR = '5216681161039';

// Verificación del webhook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recibir mensajes
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      const change = body.entry?.[0]?.changes?.[0]?.value;
      const message = change?.messages?.[0];

      if (message) {
        const from = message.from;
        const tipo = message.type;
        console.log('Mensaje de:', from, 'Tipo:', tipo);

        // Obtener estado del candidato en Firebase
        const docRef = db.collection('candidatos').doc(from);
        const doc = await docRef.get();
        const candidato = doc.exists ? doc.data() : { paso: 0 };

        if (tipo === 'text') {
          const texto = message.text.body.toLowerCase().trim();

          if (candidato.paso === 0) {
            if (texto.includes('hola') || texto.includes('holi') || texto.includes('buenas') || texto.includes('buenos')) {
              await enviarMensaje(from, '👋 ¡Bienvenido al proceso de reclutamiento!\n\nSoy el asistente de selección de personal. Para comenzar, ¿cuál es tu *nombre completo*?');
              await docRef.set({ paso: 1 });
            } else {
              await enviarMensaje(from, '👋 Hola! Escribe *hola* para iniciar tu proceso de reclutamiento.');
            }

          } else if (candidato.paso === 1) {
            await docRef.set({ paso: 2, nombre: message.text.body }, { merge: true });
            await enviarMensaje(from, `Mucho gusto *${message.text.body}* 😊\n\n¿Cuál es tu *número de teléfono* de contacto?`);

          } else if (candidato.paso === 2) {
            await docRef.set({ paso: 3, telefono: message.text.body }, { merge: true });
            await enviarMensaje(from, `✅ Perfecto!\n\nNecesito que me envíes los siguientes documentos uno por uno:\n\n📄 1. Solicitud de empleo\n🚗 2. Licencia federal\n🏥 3. Apto médico\n🧾 4. Constancia fiscal\n\nComencemos. Por favor envía tu *📄 Solicitud de empleo* (foto o PDF)`);

          } else if (candidato.paso >= 3 && candidato.paso <= 6) {
            await enviarMensaje(from, '📎 Por favor envía el documento como *foto o PDF*, no como texto.');

          } else if (candidato.paso === 7) {
            await enviarMensaje(from, '✅ Tu expediente ya está completo. Nos pondremos en contacto contigo pronto.');
          }

        } else if (tipo === 'image' || tipo === 'document') {

          if (candidato.paso === 3) {
            await docRef.set({ paso: 4, solicitud_empleo: '✅ Recibida' }, { merge: true });
            await enviarMensaje(from, '✅ *Solicitud de empleo* recibida!\n\nAhora envía tu *🚗 Licencia federal* (foto o PDF)');

          } else if (candidato.paso === 4) {
            await docRef.set({ paso: 5, licencia_federal: '✅ Recibida' }, { merge: true });
            await enviarMensaje(from, '✅ *Licencia federal* recibida!\n\nAhora envía tu *🏥 Apto médico* (foto o PDF)');

          } else if (candidato.paso === 5) {
            await docRef.set({ paso: 6, apto_medico: '✅ Recibido' }, { merge: true });
            await enviarMensaje(from, '✅ *Apto médico* recibido!\n\nPor último envía tu *🧾 Constancia fiscal* (foto o PDF)');

          } else if (candidato.paso === 6) {
            await docRef.set({
              paso: 7,
              constancia_fiscal: '✅ Recibida',
              fecha_completado: new Date().toISOString()
            }, { merge: true });

            const datosActualizados = (await docRef.get()).data();
            await enviarMensaje(from, `🎉 ¡Felicidades *${datosActualizados.nombre}*!\n\nTu expediente está *completo* ✅\n\nNos pondremos en contacto contigo muy pronto.\n\n¡Muchas gracias por tu interés! 😊`);

            // Notificar al reclutador
            await enviarMensaje(NUMERO_RECLUTADOR,
              `🔔 *NUEVO CANDIDATO COMPLETO*\n\n👤 Nombre: ${datosActualizados.nombre}\n📱 Teléfono: ${datosActualizados.telefono}\n📞 WhatsApp: +${from}\n\n✅ Solicitud de empleo\n✅ Licencia federal\n✅ Apto médico\n✅ Constancia fiscal\n\n📅 Fecha: ${new Date().toLocaleString('es-MX')}`
            );

          } else if (candidato.paso === 0) {
            await enviarMensaje(from, '👋 Escribe *hola* para iniciar tu proceso de reclutamiento.');
          } else {
            await enviarMensaje(from, '✅ Documento recibido. Escribe *hola* si deseas iniciar un nuevo proceso.');
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
});

// Función para enviar mensajes
async function enviarMensaje(to, mensaje) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      { messaging_product: 'whatsapp', to, type: 'text', text: { body: mensaje } },
      { headers: { Authorization: `Bearer ${process.env.TOKEN_ACCESO}`, 'Content-Type': 'application/json' } }
    );
    console.log('Mensaje enviado a:', to);
  } catch (error) {
    console.error('Error enviando mensaje:', error.response?.data);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Bot corriendo en puerto ${PORT}`));