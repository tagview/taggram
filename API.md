# Taggram - API

Aqui você encontrará detalhes da API que você deve usar na sua implementação. Ela é uma API REST pública e está disponível no endereço a seguir:
```
https://taggram.herokuapp.com
```

## Endpoints

### GET /me
Informa os dados de um usuário. É ele que aparece na barra do topo da página e deverá ser o autor das curtidas feitas.

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

### GET /post?username=*{username}*
Informa os dados de uma publicação. Ela deve ser exibida no centro da página.

###### Requisição
Se algum campo obrigatório não for informado ou possuir um valor inválido a API [retorna um erro](#respostas-de-erro).

Campo      | Requerido | Tipo   | Sobre
-----------|-----------|--------|------
username   | Sim       | String | Username do usuário atual obtido em `GET /me`

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
  "created_at": "17/8/2021 - 13:55",
  "location": {
    "city": "Robertsberg",
    "country": "Kyrgyz Republic"
  },
  "comments": [
    {
      "uuid": "f53c17e6-1d34-4b16-9e63-ad05d7d67064",
      "user": {
        "username": "Cali83",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/cyril_gaillard/128.jpg"
      },
      "message": "We need to transmit the auxiliary IB port!",
      "created_at": "9h",
      "has_liked": true,
      "like_count": 2
    }
  ]
}
```
</details>

### GET /posts/*{postUUID}*/related
Informa a lista de publicações relacionadas, deve ser exibida em "mais publicações". `{postUUID}` é o `uuid` da publicação exibida.

###### Resposta
Uma lista de [publicações relacionadas](#publicação-relacionada).

<details>
<summary>Exemplo</summary>

```
[
  {
    "uuid": "fae06f51-1f20-473f-b0db-48f5c54c6ad1",
    "photo": "https://source.unsplash.com/random/800x800",
    "commentCount": 0
  },
  {
    "uuid": "86be3283-6014-4cc2-ac07-eb73cdd1fc26",
    "photo": "https://source.unsplash.com/random/800x800",
    "commentCount": 4
  },
  {
    "uuid": "34aef4b8-5c9e-4ab3-89fb-a5b962ac6ee1",
    "photo": "https://source.unsplash.com/random/800x800",
    "commentCount": 2
  }
]
```
</details>

### POST /comments/*{commentUUID}*/like
**Adiciona** uma curtida em um comentário. `{commentUUID}` é o `uuid` do comentário selecionado.

##### ATENÇÃO :warning:
> Esse endpoint retorna [um erro](#erro-aleatório) **intencionalmente** algumas vezes, você deve tratar esse erro como está [especificado nos requisitos](README.md#requisitos). Porém, durante o desenvolvimento você pode forçar que os erros deixem de ser lançados utilizando o parâmetro `force`: `POST /comments/*{commentUUID}*/like?force=true`.

###### Requisição
Deve seguir o formato `application/json`. Se algum campo obrigatório não for informado ou possuir um valor inválido a API [retorna um erro](#respostas-de-erro).

Campo      | Requerido | Tipo   | Sobre
-----------|-----------|--------|------
username   | Sim       | String | Username do usuário adicionando a curtida

<details>
<summary>Exemplo</summary>

```
{
  "username": "Brielle48"
}
```
</details>

###### Resposta
O [comentário](#comentário) atualizado.

<details>
<summary>Exemplo</summary>

```
{
  "uuid": "f53c17e6-1d34-4b16-9e63-ad05d7d67064",
  "user": {
    "username": "Cali83",
    "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/cyril_gaillard/128.jpg"
  },
  "message": "We need to transmit the auxiliary IB port!",
  "created_at": "9h",
  "has_liked": true,
  "like_count": 2
}
```
</details>

### POST /comments/*{commentUUID}*/unlike
**Remove** uma curtida em um comentário. `{commentUUID}` é o `uuid` do comentário selecionado.

##### ATENÇÃO :warning:
> Esse endpoint retorna [um erro](#erro-aleatório) **intencionalmente** algumas vezes, você deve tratar esse erro como está [especificado nos requisitos](README.md#requisitos). Porém, durante o desenvolvimento você pode forçar que os erros deixem de ser lançados utilizando o parâmetro `force`: `POST /comments/*{commentUUID}*/unlike?force=true`.

###### Requisição
Deve seguir o formato `application/json`. Se algum campo obrigatório não for informado ou possuir um valor inválido a API [retorna um erro](#respostas-de-erro).

Campo      | Requerido | Tipo   | Sobre
-----------|-----------|--------|------
username   | Sim       | String | Username do usuário removendo a curtida

<details>
<summary>Exemplo</summary>

```
{
  "username": "Brielle48"
}
```
</details>

###### Resposta
O [comentário](#comentário) atualizado.

<details>
<summary>Exemplo</summary>

```
{
  "uuid": "f53c17e6-1d34-4b16-9e63-ad05d7d67064",
  "user": {
    "username": "Cali83",
    "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/cyril_gaillard/128.jpg"
  },
  "message": "We need to transmit the auxiliary IB port!",
  "created_at": "9h",
  "has_liked": false,
  "like_count": 1
}
```
</details>

## Entidades

### Usuário
Campo      | Tipo   | Sobre
-----------|--------|------
username   | String | Apelido do usuário (não existe outro usuário com o mesmo apelido)
avatar     | String | URL da imagem do usuário. **Pode ser nulo**

### Publicação
Campo      | Tipo   | Sobre
-----------|--------|------
uuid       | String | ID único da publicação
user       | Object | Um [usuário](#usuário). O autor da publicação
photo      | String | URL da imagem da publicação
created_at | String | Momento de criação
location   | Object | Uma [localização](#localização)
comments   | Array  | Uma lista de [comentários](#comentário)

### Publicação relacionada
Campo        | Tipo   | Sobre
-------------|--------|------
uuid         | String | ID único da publicação
photo        | String | URL da imagem da publicação
comment_count| Number | Quantidade de comentários na publicação

### Localização
Campo      | Tipo   | Sobre
-----------|--------|------
city       | String | Nome da cidade
country    | String | Nome do país

### Comentário
Campo      | Tipo    | Sobre
-----------|---------|------
uuid       | String  | ID único do comentário
user       | Object  | Um [usuário](#usuário). O autor do comentário
message    | String  | Conteúdo do comentário
created_at | String  | Momento de criação
like_count | Number  | Quantidade de curtidas
has_liked  | Boolean | Se o usuário já curtiu ou não esse comentário

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

### Comentário não encontrado
Lançado quando o `comment` informado não se refere a nenhum usuário válido.

Campo      | Sobre
-----------|------
type       | `comment_not_found`
status     | 400
uuid       | `uuid` informado

### Campo requerido
Lançado quando algum parâmetro obrigatório não é informado.

Campo      | Sobre
-----------|------
type       | `missing_property`
status     | 400
properties | Lista contendo todos os campos obrigatórios que não foram informados
