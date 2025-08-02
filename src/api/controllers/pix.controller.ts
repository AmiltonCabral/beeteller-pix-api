import type { Request, Response } from "express";

export const startStream = (req: Request, res: Response): void => {
  const { ispb } = req.params;
  const acceptHeader = req.header("Accept");

  // TODO:
  // 1. Verificar o limite de coletores simultâneos para o ISPB.
  //    - Se excedido, retornar status 429.
  // 2. Gerar um 'interactionId' único para este novo stream.
  // 3. Implementar o long polling para aguardar mensagens.
  // 4. Buscar mensagens no banco de dados que não foram coletadas.
  // 5. Formatar a resposta (single ou multipart json) com base no cabeçalho 'Accept'.
  // 6. Retornar status 200 com as mensagens ou 204 se não houver mensagens após o timeout.
  // 7. Adicionar o cabeçalho 'Pull-Next' na resposta.

  console.log(`ISPB: ${ispb}`);
  console.log(`Type: ${acceptHeader}`);

  const interactionId = "5oj7tm0jow61"; // example
  const pullNextUrl = `/api/pix/${ispb}/stream/${interactionId}`;

  res.setHeader("Pull-Next", pullNextUrl);
  res.status(200).json({
    message: `First placeholder for the ISPB stream ${ispb}.`,
    next_url: pullNextUrl,
  });
};
