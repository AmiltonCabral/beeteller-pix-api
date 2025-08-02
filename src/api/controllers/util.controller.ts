import type { Request, Response } from "express";
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
export const generatePixMessages = (req: Request, res: Response): void => {
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

    // TODO:
    // 1. Conectar ao banco de dados.
    // 2. Inserir o array 'messages' na tabela de mensagens PIX.
    //    Ex: await PixMessageModel.insertMany(messages);

    res.status(201).json({
      message: `${count} PIX mensages created to the ISPB ${ispb}.`,
      data: messages,
    });
  } catch (error) {
    const errorCode = `#${Date.now()}`;
    console.error(
      `Error generating the messages with code ${errorCode}`,
      error
    );
    res
      .status(500)
      .json({
        error:
          "Internal error, please open a ticket and give the code ${errorCode}",
      });
  }
};
