# Taggram - API

Aqui você encontrará detalhes da API que você deve usar na sua implementação. Ela é uma API REST pública e está disponível no endereço a seguir:
```
https://taggram.herokuapp.com
```

## Endpoints

### GET /me
Informa os dados de um usuário. É ele que aparece na barra do topo da página e deverá ser o autor dos comentários criados.

###### Resposta
Um [usuário](#usuário) aleatório.

<details>
<summary>Exemplo</summary>

```
{
  "username": "Mervin.Crooks11",
  "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stayuber/128.jpg"
}
```
</details>

### GET /post
Informa os dados de uma publicação. Ela deve ser exibida no centro da página.

###### Resposta
Uma [publicação](#publicação) aleatória.

<details>
<summary>Exemplo</summary>

```
{
  "uuid": "f198e91a-1819-4da1-b7af-80a3aa9f3c90",
  "user": {
    "username": "Tremaine43",
    "avatar": null
  },
  "photo": "https://source.unsplash.com/random/800x800",
  "created_at": "2020-03-01T10:49:08.880Z",
  "location": {
    "city": "Robertsberg",
    "country": "Kyrgyz Republic"
  },
  "comments": [
    {
      "user": {
        "username": "Cali83",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/cyril_gaillard/128.jpg"
      },
      "message": "We need to transmit the auxiliary IB port!",
      "created_at": "2020-10-09T23:02:20.716Z"
    }
  ]
}
```
</details>

### POST /posts/*{postUUID}*/comments
Cria um novo comentário em uma publicação. `{postUUID}` é o `uuid` da publicação exibida.

##### ATENÇÃO :warning:
> Esse endpoint retorna [um erro](#erro-aleatório) **intencionalmente** em um terço das chamadas, você deve tratar esse erro como está [especificado nos requisitos](README.md#requisitos). Porém, durante o desenvolvimento você pode forçar que os erros deixem de ser lançados utilizando o parâmetro `stable`: `POST /posts/{postUUID}/comments?stable=true`.

###### Requisição
Deve seguir o formato `application/json`. Se algum campo obrigatório não for informado ou possuir um valor inválido a API [retorna um erro](#respostas-de-erro).

Campo      | Requerido | Tipo   | Sobre
-----------|-----------|--------|------
username   | Sim       | String | Username do usuário autor
message    | Sim       | String | Conteúdo do comentário

<details>
<summary>Exemplo</summary>

```
{
  "username": "Brielle48",
  "message": "hello world"
}
```
</details>

###### Resposta
A lista de [comentários](#comentário) atualizada com os últimos comentários e contendo o que você adicionou.

<details>
<summary>Exemplo</summary>

```
[  
  {
    "user": {
      "username": "Cali83",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/cyril_gaillard/128.jpg"
    },
    "message": "We need to transmit the auxiliary IB port!",
    "created_at": "2020-10-09T23:02:20.716Z"
  },
  {
    "user": {
      "username": "Brielle48",
      "avatar": null
    },
    "message": "hello world",
    "created_at": "2020-10-09T23:55:59.531Z"
  }
]
```
</details>

## Entidades

### Usuário
Campo      | Tipo   | Sobre
-----------|--------|------
username   | String | Apelido do usuário (não existe outro usuário com o mesmo apelido)
avatar     | String | URL da foto do usuário. **Pode ser nulo**

### Publicação
Campo      | Tipo   | Sobre
-----------|--------|------
uuid       | String | ID único da publicação
user       | Object | Um [usuário](#usuário). O autor da publicação
photo      | String | URL da foto da publicação
created_at | String | Data de criação no formato ISO 8601
location   | Object | Uma [localização](#localização)
comments   | Array  | Uma lista de [comentários](#comentário)

### Localização
Campo      | Tipo   | Sobre
-----------|--------|------
city       | String | Nome da cidade
country    | String | Nome do país

### Comentário
Campo      | Tipo   | Sobre
-----------|--------|------
user       | Object | Um [usuário](#usuário). O autor do comentário
message    | String | Conteúdo do comentário
created_at | String | Data de criação no formato ISO 8601

## Respostas de erro

### Erro aleatório
Lançado intencionalmente com a probabilidade de 33%. [Saiba mais](#atenção-warning).

Campo      | Sobre
-----------|------
type       | `random_error`
status     | 500

### Publicação não encontrada
Lançado quando o `uuid` informado não se refere a nenhuma publicação válida.

Campo      | Sobre
-----------|------
type       | `post_not_found`
status     | 404
uuid       | `uuid` informado

### Usuário não encontrado
Lançado quando o `username` informado não se refere a nenhum usuário válido.

Campo      | Sobre
-----------|------
type       | `user_not_found`
status     | 400
username   | `username` informado

### Campo requerido
Lançado quando algum parâmetro obrigatório não é informado.

Campo      | Sobre
-----------|------
type       | `missing_property`
status     | 400
properties | Lista contendo todos os campos obrigatórios que não foram informados
