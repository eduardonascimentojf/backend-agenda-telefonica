> Renomeie o arquivo `.env.example` para `.env` e o preencha;

- Instale as dependências com

```sh
yarn install
```

- Executa as migrations com

```sh
yarn prisma migrate dev
```

- Inicie o servidor com

```sh
yarn dev
```

## Rotas

`http://localhost:4000`

- GET
  - /ListContact
  - /ListContactFavorite
- POST
  - /newContact
  - PUT
  - /setFavorite/:id
  - /editContact/:id
- DELETE
  - /DeletContact
  - //DeletContact/:id

