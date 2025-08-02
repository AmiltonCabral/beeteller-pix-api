## Exemplos de requisições e respostas

## GET `/api/pix/{ispb}/stream/start` + `Accept: "application/json"`

### Request

URL: `/api/pix/32074986/stream/start`

Headers

```
Accept: "application/json"
...
```

### Response 200

Headers

```
Pull-Next: "/api/pix/32074986/stream/17myxj5wskjf"
Content-Type: "application/json"
...
```

Data

```json
{
  "endToEndId": "E320749862024022119277T3lEBbUM0z",
  "valor": 90.2,
  "pagador": {
    "nome": "Marcos José",
    "cpfCnpj": "98716278190",
    "ispb": "00000000",
    "agencia": "0001",
    "contaTransacional": "1231231",
    "tipoConta": "CACC"
  },
  "recebedor": {
    "nome": "Flavio José",
    "cpfCnpj": "77615678291",
    "ispb": "32074986",
    "agencia": "0361",
    "contaTransacional": "1210098",
    "tipoConta": "SVGS"
  },
  "campoLivre": "",
  "txId": "h7a786d8a7s6gd1hgs",
  "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
}
```

## GET `/api/pix/{ispb}/stream/start` + `Accept: "multipart/json"`

### Request

URL: `/api/pix/00000000/stream/start`

Headers

```
Accept: "multipart/json"
...
```

### Response 200

Headers

```
Pull-Next: "/api/pix/00000000/stream/17myxj5wskjf"
Content-Type: "application/json"
...
```

Data

```json
[
  {
    "endToEndId": "E320749862024022119277T3lEBbUM0z",
    "valor": 90.2,
    "pagador": {
      "nome": "Marcos José",
      "cpfCnpj": "98716278190",
      "ispb": "32074986",
      "agencia": "0001",
      "contaTransacional": "1231231",
      "tipoConta": "CACC"
    },
    "recebedor": {
      "nome": "Flavio José",
      "cpfCnpj": "77615678291",
      "ispb": "00000000",
      "agencia": "0361",
      "contaTransacional": "1210098",
      "tipoConta": "SVGS"
    },
    "campoLivre": "",
    "txId": "h7a786d8a7s6gd1hgs",
    "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
  },
  {
    "endToEndId": "E320749862024022119277T3lEBbUM0z",
    "valor": 90.2,
    "pagador": {
      "nome": "Marcos José",
      "cpfCnpj": "98716278190",
      "ispb": "32074986",
      "agencia": "0001",
      "contaTransacional": "1231231",
      "tipoConta": "CACC"
    },
    "recebedor": {
      "nome": "Flavio José",
      "cpfCnpj": "77615678291",
      "ispb": "00000000",
      "agencia": "0361",
      "contaTransacional": "1210098",
      "tipoConta": "SVGS"
    },
    "campoLivre": "",
    "txId": "h7a786d8a7s6gd1hgs",
    "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
  },
  {
    "endToEndId": "E320749862024022119277T3lEBbUM0z",
    "valor": 90.2,
    "pagador": {
      "nome": "Marcos José",
      "cpfCnpj": "98716278190",
      "ispb": "32074986",
      "agencia": "0001",
      "contaTransacional": "1231231",
      "tipoConta": "CACC"
    },
    "recebedor": {
      "nome": "Flavio José",
      "cpfCnpj": "77615678291",
      "ispb": "00000000",
      "agencia": "0361",
      "contaTransacional": "1210098",
      "tipoConta": "SVGS"
    },
    "campoLivre": "",
    "txId": "h7a786d8a7s6gd1hgs",
    "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
  }
]
```

## GET `/api/pix/{ispb}/stream/{interationId}` + `Accept: "application/json"`

### Request

URL: `/api/pix/32074986/stream/17myxj5wskjf`

Headers

```
Accept: "application/json"
...
```

### Response 200

Headers

```
Pull-Next: "/api/pix/32074986/stream/9kp6a6l7c2ii"
Content-Type: "application/json"
...
```

Data

```json
{
  "endToEndId": "E320749862024022119277T3lEBbUM0z",
  "valor": 90.2,
  "pagador": {
    "nome": "Marcos José",
    "cpfCnpj": "98716278190",
    "ispb": "00000000",
    "agencia": "0001",
    "contaTransacional": "1231231",
    "tipoConta": "CACC"
  },
  "recebedor": {
    "nome": "Flavio José",
    "cpfCnpj": "77615678291",
    "ispb": "32074986",
    "agencia": "0361",
    "contaTransacional": "1210098",
    "tipoConta": "SVGS"
  },
  "campoLivre": "",
  "txId": "h7a786d8a7s6gd1hgs",
  "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
}
```

## GET `/api/pix/{ispb}/stream/{interationId}` + `Accept: "multipart/json"`

### Request

URL: `/api/pix/00000000/stream/17myxj5wskjf`

Headers

```
Accept: "multipart/json"
...
```

### Response 200

Headers

```
Pull-Next: "/api/pix/00000000/stream/9kp6a6l7c2ii"
Content-Type: "application/json"
...
```

Data

```json
[
  {
    "endToEndId": "E320749862024022119277T3lEBbUM0z",
    "valor": 90.2,
    "pagador": {
      "nome": "Marcos José",
      "cpfCnpj": "98716278190",
      "ispb": "32074986",
      "agencia": "0001",
      "contaTransacional": "1231231",
      "tipoConta": "CACC"
    },
    "recebedor": {
      "nome": "Flavio José",
      "cpfCnpj": "77615678291",
      "ispb": "00000000",
      "agencia": "0361",
      "contaTransacional": "1210098",
      "tipoConta": "SVGS"
    },
    "campoLivre": "",
    "txId": "h7a786d8a7s6gd1hgs",
    "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
  },
  {
    "endToEndId": "E320749862024022119277T3lEBbUM0z",
    "valor": 90.2,
    "pagador": {
      "nome": "Marcos José",
      "cpfCnpj": "98716278190",
      "ispb": "32074986",
      "agencia": "0001",
      "contaTransacional": "1231231",
      "tipoConta": "CACC"
    },
    "recebedor": {
      "nome": "Flavio José",
      "cpfCnpj": "77615678291",
      "ispb": "00000000",
      "agencia": "0361",
      "contaTransacional": "1210098",
      "tipoConta": "SVGS"
    },
    "campoLivre": "",
    "txId": "h7a786d8a7s6gd1hgs",
    "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
  },
  {
    "endToEndId": "E320749862024022119277T3lEBbUM0z",
    "valor": 90.2,
    "pagador": {
      "nome": "Marcos José",
      "cpfCnpj": "98716278190",
      "ispb": "32074986",
      "agencia": "0001",
      "contaTransacional": "1231231",
      "tipoConta": "CACC"
    },
    "recebedor": {
      "nome": "Flavio José",
      "cpfCnpj": "77615678291",
      "ispb": "00000000",
      "agencia": "0361",
      "contaTransacional": "1210098",
      "tipoConta": "SVGS"
    },
    "campoLivre": "",
    "txId": "h7a786d8a7s6gd1hgs",
    "dataHoraPagamento": "2022-07-23T19:47:18.108Z"
  }
]
```

## DELETE `/api/pix/{ispb}/stream/{interationId}`

### Request

URL: `/api/pix/32074986/stream/9kp6a6l7c2ii`

### Response 200

Data

```json
{}
```
