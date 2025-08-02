import type { Request, Response } from "express";
import { pool } from "../../database/db";
const { faker } = require("@faker-js/faker");

interface PixMessage {
  endToEndId: string;
  valor: number;
  pagador: {
    nome: string;
    cpfCnpj: string;
    ispb: string;
    agencia: string;
    contaTransacional: string;
    tipoConta: "CACC" | "SVGS";
  };
  recebedor: {
    nome: string;
    cpfCnpj: string;
    ispb: string;
    agencia: string;
    contaTransacional: string;
    tipoConta: "CACC" | "SVGS";
  };
  campoLivre?: string;
  txId: string;
  dataHoraPagamento: string;
}

/**
 * Generates a random PIX message
 */
const createRandomPixMessage = (ispbRecebedor: string): PixMessage => {
  const tipoConta = () => faker.helpers.arrayElement(["CACC", "SVGS"] as const);

  const message: PixMessage = {
    endToEndId: `E${faker.string.numeric(8)}${new Date()
      .toISOString()
      .replace(/\D/g, "")}${faker.string.alphanumeric(10)}`,
    valor: parseFloat(faker.finance.amount(1.0, 5000.0, 2)),
    pagador: {
      nome: faker.person.fullName(),
      cpfCnpj: faker.string.numeric(11),
      ispb: faker.string.numeric(8),
      agencia: "0001",
      contaTransacional: faker.string.numeric(7),
      tipoConta: tipoConta(),
    },
    recebedor: {
      nome: faker.person.fullName(),
      cpfCnpj: faker.string.numeric(11),
      ispb: ispbRecebedor,
      agencia: faker.string.numeric(4),
      contaTransacional: faker.string.numeric(8),
      tipoConta: tipoConta(),
    },
    txId: faker.string.alphanumeric(25),
    dataHoraPagamento: new Date().toISOString(),
  };

  return message;
};

/**
 * Generate N random pix messages where the specified ISPB is the receiver.
 */
export const generatePixMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ispb, number } = req.params;
  const count = parseInt(number ?? "0", 10);

  if (
    !ispb ||
    ispb.length !== 8 ||
    !ispb.split("").every((char) => char >= "0" && char <= "9")
  ) {
    res.status(400).json({
      error: "Invalid ISPB. A valid ISPB contains 8 digits.",
    });
    return;
  }

  if (isNaN(count) || count <= 0) {
    res.status(400).json({
      error: "Invalid `number`. Please provide a natural number >1",
    });
    return;
  }

  try {
    const messages: PixMessage[] = [];
    for (let i = 0; i < count; i++) {
      messages.push(createRandomPixMessage(ispb));
    }

    const client = await pool.connect();

    await client.query("BEGIN");

    const insertQuery = `
            INSERT INTO pix_messages (end_to_end_id, valor, pagador, recebedor, tx_id, data_hora_pagamento, recebedor_ispb)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            -- ON CONFLICT (end_to_end_id) DO NOTHING;
        `;

    for (const msg of messages) {
      const values = [
        msg.endToEndId,
        msg.valor,
        JSON.stringify(msg.pagador),
        JSON.stringify(msg.recebedor),
        msg.txId,
        msg.dataHoraPagamento,
        msg.recebedor.ispb,
      ];
      await client.query(insertQuery, values);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: `${count} PIX messages inserted on the Database to the ISPB ${ispb}.`,
    });
  } catch (error) {
    const errorCode = `#${Date.now()}`;
    console.error(
      `Error generating the messages with code ${errorCode}`,
      error
    );
    res.status(500).json({
      error:
        "Internal error, please open a ticket and give the code ${errorCode}",
    });
  }
};
