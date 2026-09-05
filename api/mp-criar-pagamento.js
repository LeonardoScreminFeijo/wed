import { MercadoPagoConfig, Payment } from "mercadopago";
import { ITENS_PRESENTES } from "./_lib/itens-presentes.js";
import { ServerLogger } from "./_lib/server-logger.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // Mesma origin do site (Vercel Functions) — sem necessidade de CORS.
  if (req.method !== "POST") {
    res.status(405).json({ sucesso: false, mensagem: "Método não permitido" });
    return;
  }

  const { item, valor, selectedPaymentMethod, formData } = req.body || {};

  const presente = ITENS_PRESENTES[item];
  if (!presente) {
    res.status(400).json({ sucesso: false, mensagem: "Item de presente inválido" });
    return;
  }
  if (!formData || !selectedPaymentMethod) {
    res.status(400).json({ sucesso: false, mensagem: "Dados de pagamento ausentes" });
    return;
  }

  // Itens de valor fixo usam o valor da whitelist. O "Pix Livre" aceita o
  // valor do convidado, mas o server revalida o piso — nunca confia no client.
  let valorPagamento = presente.valor;
  if (presente.livre) {
    const valorNumerico = Number(valor);
    if (!Number.isFinite(valorNumerico) || valorNumerico < presente.valorMinimo) {
      res.status(400).json({
        sucesso: false,
        mensagem: `Valor mínimo de R$ ${presente.valorMinimo.toFixed(2)}`,
      });
      return;
    }
    valorPagamento = Math.round(valorNumerico * 100) / 100;
  }

  // Payment Brick manda payment_method_id "pix" ou os dados de cartão (token, installments, etc).
  const corpoPagamento = {
    transaction_amount: valorPagamento,
    description: presente.titulo,
    payment_method_id: formData.payment_method_id,
    payer: formData.payer,
  };

  if (selectedPaymentMethod !== "bank_transfer") {
    corpoPagamento.token = formData.token;
    corpoPagamento.installments = formData.installments;
    corpoPagamento.issuer_id = formData.issuer_id;
  }

  try {
    const payment = new Payment(client);
    const resultado = await payment.create({
      body: corpoPagamento,
      requestOptions: { idempotencyKey: `${item}-${Date.now()}` },
    });

    ServerLogger.info("PAGAMENTO_CRIADO", {
      item,
      metodo: selectedPaymentMethod,
      status: resultado.status,
      payment_id: resultado.id,
    });

    res.status(200).json({
      sucesso: true,
      status: resultado.status,
      status_detail: resultado.status_detail,
      payment_id: resultado.id,
      point_of_interaction: resultado.point_of_interaction,
    });
  } catch (erro) {
    ServerLogger.error("PAGAMENTO_FALHOU", erro, { item, metodo: selectedPaymentMethod });
    res.status(500).json({ sucesso: false, mensagem: "Não foi possível processar o pagamento" });
  }
}
