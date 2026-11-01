# GiroUp — guia para a Equipe 4 e criação dos slides

**Avaliação Integrativa · Sistemas de Informação · Universidade do Planalto Catarinense (UNIPLAC) · 2026/2**  
**Líder:** Bernardo Stramosk Luckman, 8º semestre.  
A composição completa da equipe está no README do repositório.

## 1. A ideia em uma frase

**GiroUp transforma o dinheiro que o empreendedor anota em clareza para cobrar, pagar e planejar melhor.**

É um aplicativo Android para micro e pequenos negócios. Seu diferencial principal é a calculadora de preço, que inclui custos que muitas vezes não aparecem na conta mental do empresário. A câmera facilita sair do papel, e a previsão mostra quando pode faltar dinheiro.

Sugestão de frase de abertura: **“A peça custou R$ 70 e o serviço foi vendido por R$ 100. Sobrou R$ 30? Nem sempre.”**

## 2. Qual problema estamos resolvendo?

O empreendedor costuma concentrar atendimento, venda, execução e administração. Ele pode até anotar entradas e saídas, mas ainda ter dificuldade para responder:

- Quanto realmente está disponível?
- A conta que vence amanhã cabe no caixa?
- Estou cobrando o suficiente para sustentar a operação?
- Que parte do valor recebido precisa pagar estrutura e equipe?
- Quanto posso reservar para não chegar despreparado ao vencimento?

O problema do desafio não é apenas falta de registro: é dificuldade de transformar registros em uma decisão útil.

## 3. O que aprendemos na validação?

Foram consideradas cinco entrevistas qualitativas com pequenos negócios. Apareceram controle em caderno, variação no movimento, recebimentos posteriores e interesse em orientação. Um relato descreveu a prática de separar um pouco de dinheiro por dia para contas futuras.

Isso orientou quatro decisões:

1. Linguagem simples e tour inicial.
2. Entrada rápida, inclusive aproveitando o papel por câmera.
3. Diferença clara entre valor recebido, resultado e saldo disponível.
4. Reserva diária e alertas antes do vencimento.

**Cuidado nos slides:** algumas empresas disseram que já mantêm controle e não tiveram falta de caixa. Não apresentem a amostra como se todas tivessem a mesma dor. As entrevistas validam necessidades e contexto; não comprovam que o app já aumentou lucro.

## 4. Como a solução responde a cada dor?

| Dor observada ou apresentada no desafio | Resposta no GiroUp | Decisão apoiada |
| --- | --- | --- |
| Anotações espalhadas | Registro rápido, câmera e revisão das sugestões | Centralizar entradas e despesas |
| Confundir recebível com dinheiro disponível | Separação entre recebido/pago e pendente | Evitar gastar um valor que ainda não entrou |
| Desconhecer custo real do serviço | Rateio de estrutura, equipe e tempo na calculadora | Rever o preço e a margem |
| Contas vencem antes de o cliente pagar | Projeção por data e alerta de insuficiência | Negociar prazo ou antecipar recebimento |
| Falta de reserva | Meta diária para a próxima conta | Separar dinheiro com antecedência |
| Dificuldade para interpretar números | Indicadores e assistente local | Entender o que merece atenção |
| Necessidade de aprender gestão | Acesso a conteúdos do Sebrae | Continuar a capacitação |
| Pouco tempo para aprender um sistema | Tour, acesso simples e exemplos prontos | Começar a usar sem treinamento longo |

## 5. O diferencial: preço que inclui o que fica escondido

O empreendedor informa material, tempo, taxas e margem. Na estrutura do negócio, ele inclui aluguel, água, energia, internet, contabilidade, sistemas, pró-labore e outros gastos. A equipe acrescenta salários, benefícios, provisões informadas e horas produtivas.

O app divide os custos mensais pela capacidade produtiva e aloca a parcela correspondente ao serviço.

### Exemplo fictício do MVP

- Material: **R$ 70**.
- Preço atual: **R$ 100**.
- Tempo: **1 hora**.
- Estrutura e equipe: **R$ 6.120/mês**.
- Capacidade produtiva: **220 horas/mês**.
- Estrutura/equipe alocada: **R$ 27,82 por serviço**.
- Imposto e cartão: **7%**.
- Margem desejada sobre o preço de venda: **20%**.

O preço sugerido é **R$ 134**. O preço para empatar é aproximadamente **R$ 105,18**. Ao cobrar R$ 100, a sobra estimada depois dos custos informados é **negativa em R$ 4,82**.

Esse é o momento mais forte do pitch: mostrar que o custo não termina na peça.

O app também compara o resultado de vender o mesmo volume a preços diferentes. Com 20 vendas semelhantes no exemplo, o ajuste de preço representa uma diferença hipotética de **R$ 632,40 na sobra**. Não é dinheiro já ganho, economia comprovada ou promessa de que os clientes aceitarão o preço.

## 6. Por que lucro aparente não garante dinheiro no vencimento?

O exemplo de caixa começa com:

- R$ 4.100 disponíveis.
- Uma conta de R$ 5.000 em dois dias.
- R$ 2.200 a receber em oito dias.

O saldo final previsto é R$ 1.300, mas primeiro faltam R$ 900. O app destaca a data do aperto.

**A decisão útil:** negociar a conta ou antecipar um recebimento antes de comprometer o dinheiro disponível.

Cenários conservador, cadastrado e otimista permitem testar recebimentos menores ou maiores. São hipóteses sobre os valores cadastrados, não previsões infalíveis de vendas.

A simulação mensal de vendas é separada: estima faturamento e resultado descontando todos os custos fixos do mês, sem esconder o efeito da ociosidade.

## 7. A ponte com o caderno: câmera e digitalização

O fluxo é **fotografar → reconhecer → revisar → salvar**.

No Android, o OCR e a leitura de códigos são processados com modelos incluídos no aplicativo. O empresário pode usar:

- Boletos: valor/data sugeridos, linha digitável ou código quando reconhecidos.
- Caderno: sugestões de entradas e saídas por linha.
- Recibos, notas e comprovantes: extração de texto e valores para revisão.
- Estoque: texto e custo sugeridos para preencher o cadastro de item.

Não existe pagamento bancário automático. O app não confirma autenticidade do boleto. Boletos de 44/47 dígitos têm conferência matemática; contas de consumo de 48 dígitos exigem revisão manual neste MVP.

**Não prometam leitura perfeita de qualquer letra manuscrita.** Letra de forma e impressão são mais adequadas; cursiva e imagens ruins podem exigir digitação. No navegador, usamos texto/exemplos; a leitura automática de fotos fica no APK.

## 8. Cursos e desenvolvimento do empreendedor

A seção **Aprender e crescer** reúne acessos a conteúdos do Sebrae sobre formação do preço de venda, fluxo de caixa e destino do dinheiro.

O objetivo é unir ferramenta e aprendizagem: o empreendedor entende um problema no app e encontra conteúdo para melhorar sua gestão.

**Como explicar corretamente:** os links estão integrados à navegação, mas o curso abre no site do Sebrae. Cadastro, preço, disponibilidade e certificação seguem as regras do Sebrae. Não há parceria oficial declarada nem curso/certificado hospedado dentro do GiroUp.

## 9. Assistente e IA

O assistente padrão já explica caixa, custos, preços e negociação com os dados cadastrados. Ele é identificado como **Análise local** e funciona sem conexão.

Há código para conectar uma IA generativa por servidor HTTPS. Essa integração precisa de chave de API, modelo e servidor próprios. Fotos e a lista de nomes de clientes/funcionários não são enviadas nessa consulta; o app envia a pergunta e um resumo financeiro.

No pitch sem servidor configurado, digam **“assistente de análise financeira local”**, não que uma IA generativa já está conectada.

## 10. Acesso, aparência e experiência

O GiroUp tem:

- Acesso local com nome, negócio e PIN de quatro números.
- Conta de demonstração separada para apresentar sem dados reais.
- Tour em seis passos.
- Temas claro, escuro e seguindo o aparelho.
- Dados salvos localmente e backup para exportar/restaurar.
- Equipe, estoque e orçamentos acessíveis pelo menu.

O PIN é um recurso do MVP, não uma autenticação em nuvem ou criptografia financeira. Não há sincronização multiaparelho.

## 11. Como pretendemos gerar receita?

A hipótese demonstrada é:

**7 dias grátis, sem cartão → plano anual de R$ 29,99.**

O pagamento pode ser demonstrado à vista, em Pix fictício ou cartão de teste. Em 12 parcelas: **11 × R$ 2,50 + 1 × R$ 2,49**, total de R$ 29,99.

O checkout mostra confirmação e validade anual, sempre identificado como simulação. Não coleta dados bancários reais nem faz cobrança.

O preço deve ser validado comercialmente. Antes de vender de verdade, a equipe precisa considerar custo de suporte, infraestrutura, taxas, uso da IA e retenção. Não há bloqueio real dos dados após o teste nem renovação automática neste MVP.

## 12. Sugestão de slides

1. **Capa:** GiroUp, frase central, UNIPLAC, Sistemas de Informação, Avaliação Integrativa 2026/2, Equipe 4.
2. **A dor:** “Vendi por R$ 100. Quanto sobrou?” Use o exemplo da peça de R$ 70.
3. **Pesquisa:** cinco entrevistas qualitativas e os aprendizados, sem percentuais inventados.
4. **Solução:** entrada → organização → indicadores → informação útil → decisão.
5. **Diferencial:** calculadora com o custo escondido; destaque R$ 134 e R$ 4,82 negativos no preço atual.
6. **Antecipação:** linha do caixa com a conta antes do recebimento e risco de R$ 900.
7. **Inclusão na prática:** caderno/câmera, revisão, acesso simples, tour e tema escuro.
8. **Crescimento:** assistente local, capacitação pelo Sebrae, equipe e estoque como apoio.
9. **Modelo de receita:** teste de 7 dias e R$ 29,99/ano; checkout de demonstração.
10. **MVP e próximos passos:** o que está funcional, limites e integrações necessárias para produção.

**Visual:** fundo claro/lilás ou escuro, roxo como cor principal, pouco texto e capturas reais do aplicativo. Evitem uma tela cheia de funcionalidades; mostrem a decisão que cada uma permite tomar.

## 13. O que podemos afirmar com segurança?

- O MVP organiza lançamentos e calcula indicadores.
- O exemplo revela um custo escondido e uma insuficiência de caixa.
- Os cenários e o assistente local usam dados informados.
- O Android tem código e bibliotecas de câmera/OCR incorporados.
- A monetização está demonstrada por um checkout simulado.
- O código completo e os testes ficam disponíveis no GitHub para evolução.

Não afirmar: lucro real comprovado, cobrança ativa, previsão garantida, parceria com Sebrae, autenticação bancária, leitura perfeita de manuscrito, contabilidade oficial ou que o app já foi validado em toda a população de pequenos negócios.

## 14. Próximos passos após a avaliação

Testar com empresários usando dados reais consentidos; medir tempo para registrar e taxa de correção do OCR; validar disposição a pagar; priorizar melhorias do público; implementar autenticação e backup em servidor se necessário; integrar cobrança real verificada; testar em aparelhos variados; avaliar custos da IA e requisitos de privacidade antes de publicar comercialmente.

