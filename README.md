# GiroUp

**Menos papel. Mais direção.**

## Avaliação Integrativa — UNIPLAC · 2026/2

Projeto acadêmico da **Equipe 4**, desenvolvido para a **Avaliação Integrativa do curso de Sistemas de Informação da Universidade do Planalto Catarinense (UNIPLAC)**, no **segundo semestre de 2026**, em Lages, Santa Catarina.

**Desafio 2: Gestor Inteligente de Pequenos Negócios.** O objetivo é demonstrar como dados financeiros básicos podem virar informações claras para apoiar decisões de micro e pequenos empreendedores.

**Líder da equipe:** Bernardo Stramosk Luckman — **8º semestre**.

| Integrante | Semestre | Participação |
| --- | :---: | --- |
| Bernardo Stramosk Luckman | 8º | Líder da Equipe 4 |
| Brenda Ribeiro Luiz | 2º | Integrante |
| Marcos Vinicius da Silva Zimmermann | 2º | Integrante |
| Leandro Conceição Rodrigues | 2º | Integrante |
| Alexandre Rocha | 4º | Integrante |
| Gustavo Gonsalves Branco | 4º | Integrante |
| Nicolas Santos Ribeiro | 4º | Integrante |
| Arthur Barbosa Abreu | 6º | Integrante |
| João Pedro Bastos Fernandes | 6º | Integrante |
| Rayssa Romaniuk Riscarolli | 6º | Integrante |

A proposta reúne estudantes de diferentes semestres em uma solução aplicada, articulando pesquisa de validação, desenvolvimento de software e apresentação em formato de pitch.

**Referência institucional:** [curso de Sistemas de Informação — UNIPLAC](https://ww4.uniplaclages.edu.br/graduacao/grade/49-sistemas-de-informacao). O período, a composição e a liderança da Equipe 4 foram informados pela equipe.

**Repositório:** [vzimmermannn/GiroUP](https://github.com/vzimmermannn/GiroUP).

**Material da apresentação:** [resumo para a equipe](docs/RESUMO-PARA-EQUIPE.md) · [roteiro do pitch](docs/ROTEIRO-PITCH.md) · [mensagem para o grupo](docs/MENSAGEM-GRUPO.txt).

---


MVP Android para ajudar micro e pequenos empreendedores a compreender o dinheiro do negócio, precificar com custos reais e antecipar apertos de caixa.

O GiroUp reúne entrada de dados, organização, indicadores e orientação prática em uma interface lilás/roxa, com temas claro e escuro.

![Prévia do acesso](docs/screenshots/01-login.png)

## Começar

- **Android:** instale o APK de demonstração entregue com o projeto. Android 8.0/API 26 ou superior; mantenha o Android System WebView atualizado.
- **Demonstração:** toque em **Explorar demonstração**. Os números são fictícios, separados da base pessoal e preparados para o pitch.
- **Uso local:** informe nome, negócio e PIN de quatro números. O acesso é local, sem conta em nuvem.
- **Primeiro contato:** o tour apresenta caixa, preço, futuro, aprendizagem e assistente.
- **Backup:** use Mais → Meu negócio. Exporte antes de desinstalar, limpar dados ou trocar o aparelho.

O app abre e faz a gestão local sem servidor. Internet é necessária para abrir conteúdos externos e para a IA generativa opcional.

## O que o MVP entrega

| Recurso | Comportamento |
| --- | --- |
| Acesso simples | Nome, negócio e PIN local; sessão encerrada ao sair. Conta de demonstração separada. |
| Tour inicial | Seis passos com linguagem simples e acesso novamente pelo menu. |
| Meu caixa | Entradas, despesas, categorias, datas, pendências, busca, edição e confirmação de baixa. |
| Preço certo | Materiais, tempo, terceiros, estrutura, equipe, impostos, cartão, comissão e margem. |
| Orçamentos | Salvar preço e converter em recebível depois de confirmar os dados. |
| Futuro | Saldo por vencimento, risco de insuficiência e cenários de 15/30/60 dias. |
| Plano mensal | Faturamento e resultado hipotéticos, descontando todos os custos fixos do mês. |
| Reserva diária | Meta para completar o valor da próxima conta, sem confundir com saldo livre. |
| Digitalização | Câmera ou imagem da galeria, OCR local no Android, leitura de códigos e revisão antes de salvar. |
| Caderno | Sugestões de entradas e saídas por linha; totais e saldos não viram novas operações. |
| Equipe | Salário, provisões informadas, benefícios e horas produtivas no custo do serviço. |
| Estoque | Quantidade, custo unitário, mínimo e alerta de reposição; controle manual. |
| Aprender e crescer | Acesso a conteúdos de gestão e precificação do Sebrae. |
| Assistente | Análises locais de caixa, preços, gastos e negociação; conexão generativa opcional. |
| Aparência | Tema claro, escuro ou seguindo o aparelho, com preferência persistente. |
| Monetização | Sete dias grátis e oferta anual de R$ 29,99, com checkout demonstrativo. |

## Assinatura e pagamento — simulação explícita

A hipótese comercial deste MVP é **R$ 29,99 pelo ano inteiro**, e não por mês:

- Teste de sete dias, sem cartão.
- À vista: R$ 29,99.
- Parcelado no cartão de teste: **11 × R$ 2,50 + 1 × R$ 2,49**, total de R$ 29,99.
- Pix demonstrativo é à vista.
- Confirmação, pedido e validade anual são fictícios e salvos localmente.

Não existe cobrança real, gateway ativo, renovação automática, cartão real ou Pix pagável. O desenho mostrado na opção Pix não é um QR Code bancário. A assinatura simulada não vira despesa da empresa no caixa.

Para preservar a demonstração e o acesso aos próprios dados, o fim do teste não bloqueia os registros nem o backup. O preço é uma hipótese a validar com clientes e custos de operação; não comprova rentabilidade. Uma versão comercial deve implementar autenticação em servidor, cobrança verificada e limites de uso de IA.

## Câmera e documentos

O Android usa **ML Kit Text Recognition 16.0.1** e **Barcode Scanning 17.3.0**, com os modelos incluídos no APK.

1. Escolha Boletos, Caderno, Notas e recibos ou Estoque.
2. Abra a câmera do aparelho ou selecione uma foto.
3. O reconhecimento devolve texto e códigos encontrados.
4. Corrija o texto, confira as sugestões e toque em **Revisar**.
5. Confirme o formulário para criar o lançamento ou o item de estoque.

As fotos não são enviadas ao servidor de IA. A captura usa um arquivo temporário do app e o seletor de imagens do Android; não pede acesso amplo ao armazenamento.

**Limites importantes:**

- OCR funciona melhor com impressão e letra de forma. Não há garantia para letra cursiva, fotos desfocadas ou texto incompleto.
- Boletos bancários de 44/47 dígitos têm conferência dos dígitos verificadores e sugestão de valor.
- Quando o vencimento vem só do fator do código, usamos o ciclo iniciado em 22/02/2025 e pedimos conferência da data impressa.
- Contas de consumo de 48 dígitos são sinalizadas para preenchimento/revisão manual; o MVP não valida o código de arrecadação.
- Conferir dígito não confirma beneficiário, autenticidade ou registro bancário.
- Não abrimos URLs de QR Code automaticamente e não pagamos boletos.
- Anotações iguais são preservadas, com aviso para conferir se são operações diferentes. Não excluímos duas vendas legítimas só porque têm o mesmo valor.
- Quantidade e unidade de estoque continuam sendo informadas no cadastro.
- No navegador, o OCR nativo não está disponível: há exemplos fictícios e campo para colar/corrigir texto. A leitura automática de fotos está no APK Android.

## Como o GiroUp enfrenta o problema

As cinco entrevistas de validação trouxeram controle em caderno, oscilação de serviços, recebimentos posteriores, dificuldade de distinguir faturamento de caixa e interesse em orientação. Algumas empresas já possuíam bom controle; não é correto afirmar que todas enfrentaram falta de dinheiro.

O app transforma isso em um fluxo demonstrável:

**Registrar ou digitalizar → revisar → organizar → calcular → apontar risco → apoiar uma decisão.**

Exemplo fictício do preço:

- Serviço cobrado a R$ 100, com R$ 70 de material.
- Estrutura e equipe: R$ 6.120/mês; capacidade produtiva de 220 horas.
- Uma hora de serviço aloca R$ 27,82 de custos mensais.
- Impostos e cartão: 7%; margem desejada: 20%.
- O preço sugerido é R$ 134,00. Cobrar R$ 100 deixa aproximadamente R$ 4,82 descobertos nos custos informados.

Exemplo fictício do caixa:

- Disponível hoje: R$ 4.100.
- Conta de R$ 5.000 em dois dias.
- Recebimento de R$ 2.200 em oito dias.
- Embora o saldo final seja positivo em R$ 1.300, falta R$ 900 antes do recebimento.

A informação útil é antecipar um recebimento ou negociar o vencimento antes de gastar o dinheiro disponível.

## Cursos do Sebrae

A seção **Aprender e crescer** integra a navegação do app com links para conteúdos do Sebrae:

- [Formação do preço de venda](https://loja.sebrae.com.br/formac-o-do-preco-de-venda-1-371440100236)
- [Para onde vai meu dinheiro?](https://loja.sebrae.com.br/para-onde-vai-meu-dinheiro-1-3712431840)
- [Como definir preço de venda](https://rs.loja.sebrae.com.br/como-definir-preco-de-venda)

Os cursos abrem no navegador e seguem as condições de acesso, preço, cadastro e certificação do Sebrae. Não são cursos hospedados dentro do GiroUp e não há parceria oficial declarada.

## Cálculo e premissas

**Custo mensal** = despesas fixas + salários + encargos/provisões informados + benefícios.

**Hora produtiva média** = custo mensal ÷ suas horas vendáveis e horas vendáveis da equipe.

**Custo da venda** = materiais + terceiros + frete/embalagem + hora produtiva média × horas totais do serviço.

**Preço sugerido** = custo da venda ÷ [1 − (impostos + cartão + comissão + margem) / 100].

A margem é sobre o preço de venda. Os percentuais precisam somar menos de 100%. O preço mínimo para empatar usa a mesma conta sem margem.

O rateio é médio: informe as horas de todas as pessoas envolvidas no serviço. Uma operação com equipes de custos muito diferentes pode precisar de centros de custo numa versão futura.

Custos da calculadora não geram pagamentos automáticos. Não repita o salário no campo de terceiros. Imposto fixo, como DAS, pode ser custo mensal; não duplique no percentual de venda. Em financiamento, informe juros/custos no preço e registre a parcela integral no fluxo de caixa.

**Disponível** = saldo inicial + dinheiro recebido − pagamentos realizados.

**Resultado de caixa em 30 dias** não inclui o saldo inicial e não é lucro contábil.

**Projeção** considera apenas compromissos cadastrados. Conservador usa 70% dos recebimentos; cadastrado, 100%; otimista, 115% como hipótese explícita. Não reduzimos contas a pagar para fazer o cenário parecer melhor. Saídas são consideradas antes de entradas no mesmo dia para revelar risco de insuficiência.

**Simulação mensal** desconta materiais, terceiros, frete, taxas e todos os custos fixos e salários do mês. Não é somada ao caixa confirmado.

## IA opcional

O modo padrão usa cálculos e regras locais e se apresenta como **Análise local**. Não é IA generativa.

A integração opcional segue o fluxo app → servidor HTTPS → OpenAI Responses API. O arquivo **server/server.mjs** usa Node.js 22+ sem dependências externas.

Configure no servidor, nunca no app:

- **OPENAI_API_KEY**: chave privada da conta de API.
- **OPENAI_MODEL**: identificador de um modelo habilitado na conta.
- **HOST**: padrão 127.0.0.1.
- **PORT**: padrão 8787.
- **ALLOWED_ORIGIN**: origem exata autorizada, se usar a prévia web.

Execute **node --env-file=server/.env server/server.mjs** depois de criar esse arquivo local com base em **server/.env.example**. Alternativamente, configure as variáveis diretamente no ambiente.

Publique o processo atrás de HTTPS e de controle de acesso para a equipe; não exponha uma chave de API num servidor aberto. O limite por IP do exemplo não substitui autenticação. Cadastre a URL completa **https://seu-servidor/api/chat** em Mais → Meu negócio.

A pergunta atual e um resumo financeiro são enviados apenas quando o usuário consulta a IA conectada. Não enviamos fotos nem a lista de nomes de clientes/funcionários. O servidor não mantém memória das mensagens anteriores. Sem chave e servidor, a análise local continua funcionando.

## Executar e reconstruir

### Prévia no computador

Instale Node.js 22 ou superior e execute, na raiz:

    node scripts/preview.cjs

Abra **http://localhost:8766**. Para fotos com OCR, use o Android.

### Android

Requisitos: Android Studio, JDK 17 ou 21, SDK Android 35 e Build Tools 35.0.0. O Gradle Wrapper 8.11.1 está incluído; Android Gradle Plugin 8.9.2.

Configure o SDK pelo Android Studio ou pelo arquivo local.properties, que não é versionado. Depois:

    gradlew.bat assembleDebug

No Linux/macOS:

    bash gradlew assembleDebug

O APK fica em **app/build/outputs/apk/debug/app-debug.apk**. A primeira compilação baixa as bibliotecas de OCR e os modelos.

A variável opcional **GIROUP_KEYSTORE** permite usar um keystore de demonstração com alias **androiddebugkey** e senha de debug **android**. Sem ela, usa a assinatura debug padrão. Produção requer chave de release própria.

Este GiroUp usa o identificador Android **br.com.giroup**, separado da versão anterior Conta Fácil. Para trazer os lançamentos antigos, exporte um backup no aplicativo anterior e importe no GiroUp. O backup financeiro não contém PIN nem assinatura local.

### Testes

    node test-finance.cjs
    node test-giroup.cjs
    node server/test-server.mjs

São 14 testes financeiros, 12 de plano/digitalização e 6 do servidor, com provedor de IA simulado. Não são chamadas reais de cobrança ou IA.

O workflow **.github/workflows/android.yml** testa o núcleo e compila um APK de debug como artefato do GitHub Actions. A execução remota depende de o GitHub permitir Actions no repositório.

## Organização do código

- **app/src/main/java/br/com/giroup/MainActivity.java**: Android, câmera, seletor de imagens, OCR, códigos, temas, backup e ponte HTTPS.
- **app/src/main/assets/core.js**: núcleo financeiro.
- **app/src/main/assets/giro-core.js**: plano, parcelas e interpretação de documentos.
- **app/src/main/assets/app.js**: gestão, telas base, formulários e tour.
- **app/src/main/assets/giro-ui.js**: acesso local, assinatura simulada, temas e digitalização.
- **app/src/main/assets/style.css**: identidade e responsividade.
- **server/**: integração generativa opcional.
- **docs/**: material da equipe, pitch, limites e capturas de tela.
- **scripts/preview.cjs**: prévia local sem instalar pacotes.

## Limites de produção

Este é um MVP para demonstração. O PIN local é derivado com PBKDF2/SHA-256, sal aleatório e 120 mil iterações; não é uma conta autenticada em servidor e não criptografa a base. Não há recuperação de PIN, sincronização ou isolamento multiusuário de produção.

Não há cobrança real, pagamentos bancários, emissão de nota fiscal, leitura fiscal oficial, contabilidade, folha de pagamento oficial ou baixa automática do estoque. Não prometa resultados ou economia garantidos. Fotos reais e recursos nativos devem ser conferidos no aparelho usado na apresentação.

## Referências técnicas e de negócio

- [Sebrae — formação de preços](https://meuatendimento.sebrae.com.br/sites/PortalSebrae/artigos/como-definir-o-preco-de-venda-de-um-produto-ou-servico%2Ccc9836627a963410VgnVCM1000003b74010aRCRD)
- [ML Kit — texto no Android](https://developers.google.com/ml-kit/vision/text-recognition/v2/android)
- [ML Kit — códigos no Android](https://developers.google.com/ml-kit/vision/barcode-scanning/android)
- [Banco do Brasil — especificações de boleto e fator de vencimento](https://www.bb.com.br/docs/pub/emp/empl/dwn/Doc5175Bloqueto.pdf)
- [OpenAI — geração de texto](https://developers.openai.com/api/docs/guides/text)

