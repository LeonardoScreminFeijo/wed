import { MercadoPagoConfig, Payment } from "mercadopago";
import { ServerLogger } from "./_lib/server-logger.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Notificação do MP só traz um ID — nunca confiar no status que vier no payload,
// sempre reconsultar o pagamento real na API antes de dar como confirmado.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { type, data } = req.body || {};

  if (type !== "payment" || !data?.id) {
    res.status(200).end();
    return;
  }

  try {
    const payment = new Payment(client);
    const resultado = await payment.get({ id: data.id });

    ServerLogger.info("WEBHOOK_PAGAMENTO", {
      payment_id: resultado.id,
      status: resultado.status,
      item: resultado.description,
    });

    // TODO: quando houver persistência (planilha/CRUD), gravar confirmação aqui
    // quando resultado.status === "approved".

    res.status(200).end();
  } catch (erro) {
    ServerLogger.error("WEBHOOK_FALHOU", erro, { payment_id: data.id });
    res.status(200).end(); // 200 sempre, senão o MP fica reenviando o webhook
  }
}
