# Taggram

Olá!

Estamos empolgados que você se interessou em fazer parte da equipe Tagview! Montamos um desafio baseado em um problema semelhante aos que resolvemos no nosso dia a dia para conhecer um pouco mais sobre você.

![Preview](preview.png)

## Implementação
Taggram é um site onde os usuários conseguem interagir com comentários de uma foto.

A sua implementação deve se basear no [layout](#layout), obter os dados através da [API](#api) e seguir os [requisitos](#requisitos).

Em [/base](base) você encontra um esqueleto da aplicação com alguns exemplos, você pode aproveitar esses arquivos para implementar a sua solução.

### Layout
Você pode visualizar o layout [clicando aqui](https://www.figma.com/file/96DdmM0aScr0uihjwx6LxM/Taggram?node-id=1598%3A14). Ao se cadastrar no Figma você terá acesso às medidas, espaçamentos, cores e poderá baixar os ícones utilizados no layout. Também disponibilizamos [um protótipo](https://www.figma.com/proto/96DdmM0aScr0uihjwx6LxM/Taggram?page-id=0%3A1&node-id=1598%3A14&viewport=241%2C48%2C0.7&scaling=min-zoom) que simula o funcionamento da página.

### API
Desenvolvemos uma API REST que deve ser utilizada para obter os dados dos usuários, publicações e comentários. Ela possui três endpoints, conheça cada um deles na [**documentação**](API.md). Use essa API à vontade durante o desenvolvimento.

### Requisitos
1. A aplicação deve exibir:
    - Os dados do usuário
    - Os dados da publicação
    - A lista de comentários da publicação
2. A aplicação deve exibir a lista de publicações relacionadas ("mais publicações")
   - Você deve exibir na lista **somente** as publicações relacionadas que possuírem **pelo menos 3 comentários**
3. A aplicação deve permitir:
    - Que o usuário curta um comentário, e atualizar o contador de curtidas
    - Que o usuário remova a sua curtida de um comentário, e atualizar o contador de curtidas
4. Quando as requisições para [curtir ou remover curtida de um comentário falharem](API.md#atenção-warning), exibir um alerta avisando o usuário que o `Não foi possível curtir/descurtir comentário, tente novamente`. Você pode usar o `Window.alert` ou outro elemento visual para exibir essa mensagem
5. Você pode continuar a implementação sem nenhum framework ou escolher entre ReactJS, AngularJS ou VueJS
6. Você pode utilizar qualquer outra biblioteca que achar necessário (jQuery, por exemplo)
7. **As requisições para a API devem ser feitas client-side (no próprio navegador)**. **Não** queremos que você utilize JSP, ASP ou qualquer ferramenta server-side.

## Submissão
Envie o URL de um repositório git público por email para `team@tagview.com.br`. Usamos bastante o [GitHub](https://github.com) e o [GitLab](https://gitlab.com).

## Boa sorte!
Analisamos mais do que somente o resultado final então nos envie a sua solução mesmo se você encontrar problemas implementando algum detalhe.

### Critérios de avaliação
- Capacidade de assimilar um conteúdo novo
- Organização
- Atenção aos requisitos
- Preocupação com a usabilidade (experiência do usuário)
- Empenho em entregar algo, mesmo que minimamente funcional
- Tratamento de erros

Caso tenha dúvidas, envie um e-mail para `team@tagview.com.br` :technologist:
