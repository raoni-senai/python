import { CourseSection } from '../types';

export const ptSyllabusTranslations: Record<string, { title: string; description?: string; summary?: string; contentMarkdown?: string }> = {
  // Sections
  'basics': {
    title: '1. Fundamentos e Sintaxe de Python',
    description: 'Aprenda a anatomia central do Python, como exibir saídas e escrever códigos limpos e estruturados usando a identação.',
  },
  'variables': {
    title: '2. Variáveis, Números e Booleanos',
    description: 'Domine variáveis dinâmicas, tipos de dados do Python, cálculos numéricos e condições lógicas.',
  },
  'control-flow': {
    title: '3. Estruturas Condicionais e Loops',
    description: 'Controle o fluxo dos seus scripts usando tomadas de decisão if-else e estruturas de repetição while e for.',
  },
  'datastructs': {
    title: '4. Estruturas de Dados / Coleções',
    description: 'Trabalhe com coleções estruturadas de dados usando as listas, dicionários, tuplas e conjuntos nativos do Python.',
  },
  'functions': {
    title: '5. Funções e Expressões Lambda',
    description: 'Crie códigos reutilizáveis, modulares e eficientes declarando funções com parâmetros e retornos personalizados.',
  },

  // Section 1 Lessons
  'intro': {
    title: 'Introdução ao Python',
    summary: 'O que é Python e por que ele é tão popular para desenvolvimento web, scripts, ciência de dados e IA?',
    contentMarkdown: `### Bem-vindo ao Python!

Python é uma linguagem de programação de alto nível, extremamente amigável para humanos, criada por **Guido van Rossum** e lançada em 1991.

É muito amada por sua legibilidade, simplicidade e amplamente utilizada em:
* **Desenvolvimento Web** (Django, Flask, FastAPI)
* **Ciência de Dados e Inteligência Artificial** (Pandas, NumPy, PyTorch, Gemini API)
* **Automação e Scripts**

#### Sua Primeira Instrução em Python
Para exibir qualquer texto na tela no console de execução, o Python usa a função simples \`print()\`:

\`\`\`python
print("Olá, Mundo!")
\`\`\`
`,
  },
  'syntax': {
    title: 'Sintaxe e Indentação',
    summary: 'Aprenda como a indentação define blocos lógicos estruturais no Python.',
    contentMarkdown: `### Indentação no Python

Ao contrário de outras linguagens de programação que utilizam chaves \`{}\` para definir blocos, o Python **exige o uso de indentação** (espaços ou tabs) para definir o escopo de estruturas como condicionais, loops e funções:

\`\`\`python
if 5 > 2:
    print("Cinco é maior que dois!")
\`\`\`

Se você esquecer de indentar os blocos internos, o Python acusará um erro de compilação imediato do tipo \`IndentationError\`:

\`\`\`python
# Isto causará um erro!
if 5 > 2:
print("Sem indentar!")
\`\`\`
`,
  },
  'comments': {
    title: 'Comentários no Código',
    summary: 'Aprenda como escrever anotações no seu código que são ignoradas pelo interpretador.',
    contentMarkdown: `### Comentários em Python

Comentários servem para explicar o funcionamento do código e torná-lo mais legível. Eles são totalmente ignorados pelo computador durante a execução.

* **Comentários de linha única** começam com o caractere de cerquilha/hash \`#\`.
* Qualquer texto inserido após o \`#\` é considerado comentário.

\`\`\`python
# Isto é um comentário inicial explicativo
print("Python no SENAI") # Comentário na mesma linha
\`\`\`
`,
  },
  'input': {
    title: 'Entrada Interativa (input)',
    summary: 'Capture respostas ativas do teclado do usuário direto nos scripts do Python.',
    contentMarkdown: `### A Função input()

O Python permite capturar dados digitados ativamente pelo usuário no console usando a função nativa \`input()\`:

* Ela interrompe temporariamente a execução do programa e aguarda o usuário digitar um texto e pressionar Enter.
* Ela sempre retorna a resposta digitada na forma de texto (string).

\`\`\`python
nome = "Erick" # Simulação de entrada
print("O nome cadastrado é: " + nome)
\`\`\`
`,
  },
  'basics_wrap': {
    title: 'Conclusão de Fundamentos',
    summary: 'Um teste prático rápido revisando comandos essenciais, sintaxe e regras de indentação.',
    contentMarkdown: `### Revisão do Módulo 1

Completamos a primeira parte de fundamentos básicos em Python:
* \`print()\` é usado para exibir dados na tela.
* Dois-pontos \`:\` iniciam blocos nested contendo lógica interna.
* A indentação correta usa exatamente **4 espaços**.
* O caractere \`#\` inicia anotações/comentários ocultos para o programador.
`,
  },

  // Section 2 Lessons
  'vars': {
    title: 'Variáveis e Tipagem Dinâmica',
    summary: 'Como criar variáveis instantâneas, regras de nomes e funcionamento de tipos automáticos.',
    contentMarkdown: `### Variáveis no Python

Variáveis funcionam como caixas etiquetadas que armazenam dados na memória do computador.

Diferente de linguagens rígidas como Java ou C++, o Python oferece **tipagem dinâmica**:
* Não é preciso declarar se uma variável é texto ou número antes de utilizá-la.
* A variável é criada automaticamente no exato momento em que você atribui um valor usando o operador de igualdade \`=\`.

\`\`\`python
x = 100
usuario = "Guilherme"
print(usuario, x)
\`\`\`
`,
  },
  'booleans': {
    title: 'Booleanos e Operadores de Comparação',
    summary: 'Compreenda a lógica True & False e as principais expressões de comparação.',
    contentMarkdown: `### Valores Booleanos

Booleanos representam apenas dois estados lógicos possíveis: **True** (Verdadeiro) ou **False** (Falso).

Sempre que comparamos duas expressões, o Python avalia a lógica e retorna um bool:
* \`==\` : Igual a
* \`!=\` : Diferente de
* \`>\` : Maior que
* \`<\` : Menor que

*Nota importante:* Lembre-se que em Python as iniciais devem ser maiúsculas: \`True\` e \`False\` (e não \`true\` ou \`false\`).
`,
  },
  'numbers': {
    title: 'Números e Cômputo Matemático',
    summary: 'Efetue cálculos usando tipos como inteiros, decimais flutuantes e operadores matemáticos.',
    contentMarkdown: `### Números no Python

Existem três classificações fundamentais de números no Python:
* \`int\`: Inteiros de qualquer tamanho (ex: \`10\`, \`-450\`).
* \`float\`: Números decimais com ponto (ex: \`19.99\`, \`3.1415\`).
* \`complex\`: Números imaginários complexos (ex: \`2+3j\`).

#### Principais Operadores Matemáticos:
* \`+\` Adição | \`-\` Subtração | \`*\` Multiplicação | \`/\` Divisão decimal
* \`%\` Módulo (resto da divisão) | \`**\` Exponenciação (potência)
`,
  },
  'strings': {
    title: 'Operações de Strings (Textos)',
    summary: 'Domine aspas múltiplas, concatenação, índices e manipulação de texto no Python.',
    contentMarkdown: `### Strings em Python

Qualquer texto inserido entre aspas simples (\`'\`) ou aspas duplas (\`"\`) é considerado uma String.

* **Strings Multilinhas**: Podem ser declaradas usando três aspas consecutivas (\`"""\`).
* **Concatenação**: É possível juntar dois textos usando o sinal de soma \`+\`.
* **Indexação**: Acesse caracteres específicos usando colchetes com índice iniciando em zero: \`texto[0]\`.

\`\`\`python
curso = "Python"
print("Estudando " + curso)
\`\`\`
`,
  },
  'casting': {
    title: 'Conversão de Tipos (Casting)',
    summary: 'Converta tipos de variáveis de forma forçada usando int(), float() e str().',
    contentMarkdown: `### Type Casting no Python

Às vezes você precisa converter o valor de uma variável para um tipo específico. Para isso usamos funções de conversão (casting):

* \`int()\`: Converte para número inteiro.
* \`float()\`: Converte para decimal/flutuante.
* \`str()\`: Converte para texto/string.

Isso é muito comum quando recebemos números em strings e precisamos somá-los matematicamente:

\`\`\`python
texto_num = "45"
numero_real = int(texto_num) # Agora é 45 inteiro
print(numero_real + 5) # Imprime 50
\`\`\`
`,
  },

  // Section 3 Lessons
  'ifelse': {
    title: 'Condicionais If ... Else',
    summary: 'Construa desvios lógicos de decisão múltipla usando if, elif e else.',
    contentMarkdown: `### Condicionais If, Elif e Else

Para criar decisões no algoritmo, utilizamos estruturas de teste que desviam a execução do programa dependendo da condição logística estabelecida:

* \`if\` (se): Executa o bloco caso a condição seja Verdadeira.
* \`elif\` (senão se): Adiciona condições intermediárias caso as anteriores sejam Falsas.
* \`else\` (senão): Bloco reserva executado se absolutamente todas as condições anteriores falharem.

\`\`\`python
media = 7.5
if media >= 9.0:
    print("Excelente!")
elif media >= 7.0:
    print("Aprovado!")
else:
    print("Estude mais!")
\`\`\`
`,
  },
  'loops': {
    title: 'Laços de Repetição (While & For)',
    summary: 'Como iterar sequências e blocos lógicos usando loops estruturados.',
    contentMarkdown: `### Loops While e For

Estruturas de repetição executam o mesmo trecho de código enquanto uma determinada condição se mantiver lógica:

* **Loop While**: Repete o bloco continuamente *enquanto* a sua expressão inicial for verdadeira. Exige controle de incremento para evitar loops infinitos.
* **Loop For**: Percorre sequências predefinidas, listas ou conjuntos passo a passo de forma automatizada.

\`\`\`python
# Exemplo de loop while
contador = 1
while contador <= 3:
    print("Passo:", contador)
    contador += 1
\`\`\`
`,
  },
  'nested_if': {
    title: 'Decisões Aninhadas',
    summary: 'Aprenda como aninhar comandos condicionais if e else de forma legível.',
    contentMarkdown: `### Condicionais Aninhadas

Podemos estruturar decisões consecutivas colocando comandos condicionais dentro de outras ramificações condicionais já existentes:

\`\`\`python
idade = 20
possui_carteira = True

if idade >= 18:
    if possui_carteira:
        print("Autorizado a dirigir!")
    else:
        print("Maior de idade, mas sem habilitação.")
else:
    print("Menor de idade.")
\`\`\`
`,
  },
  'logical_ops': {
    title: 'Operadores Lógicos',
    summary: 'Combine condições lógicas usando as palavras-chave and, or e not.',
    contentMarkdown: `### Operadores Lógicos

Permitem construir validações complexas combinando mais de um teste lógico na mesma instrução:

* \`and\` (E): Exige que **todas** as condições individuais sejam verdadeiras.
* \`or\` (OU): Exige que **pelo menos uma** condição seja verdadeira.
* \`not\` (NÃO): Inverte o estado lógico de verdadeiro para falso, e vice-versa.

\`\`\`python
saldo = 500
limite_especial = 1000
pode_comprar = saldo > 0 and limite_especial > 100
print(pode_comprar) # True
\`\`\`
`,
  },
  'range_fn': {
    title: 'A Função range()',
    summary: 'Gere sequências numéricas escalonadas e controle o número de repetições.',
    contentMarkdown: `### A Função range()

Para executar blocos de repetição de forma demarcada por uma contagem específica de vezes, o Python oferece a função geradora de intervalos numéricos \`range()\`:

* Ela inicia em \`0\` por padrão, e incrementa de \`1\` em \`1\` antes de atingir o limite limite de parada especificado.

\`\`\`python
# Retorna números de 0 até 2 (3 itens)
for i in range(3):
    print("Repetição número:", i)
\`\`\`
`,
  },
  'list_loops': {
    title: 'Iterando sobre Listas',
    summary: 'Aprenda a percorrer de forma direta todos os valores contidos em coleções.',
    contentMarkdown: `### Iterando sobre Listas

Você pode usar o loop \`for\` para percorrer de forma automática e elegante todos os itens armazenados individualmente dentro de uma lista de dados, sem precisar manipular índices numéricos manualmente:

\`\`\`python
linguagens = ["Python", "JavaScript", "SQL"]
for lang in linguagens:
    print("Aprenda:", lang)
\`\`\`
`,
  },
  'break_control': {
    title: 'A Instrução break',
    summary: 'Como interromper e sair de um loop antes do fim programado.',
    contentMarkdown: `### O Comando break

A instrução \`break\` é usada para forçar a parada e a saída imediata de qualquer loop repetitivo antes que ele atinja seu gatilho padrão de encerramento natural:

\`\`\`python
for num in range(10):
    if num == 4:
        break # Aborta o loop na hora!
    print("Número:", num)
# Imprimirá apenas: 0, 1, 2, 3
\`\`\`
`,
  },
  'continue_control': {
    title: 'A Instrução continue',
    summary: 'O meio ideal para pular certas iterações do loop e saltar para o próximo índice.',
    contentMarkdown: `### O Comando continue

Diferente do \`break\` que interrompe de vez, o comando \`continue\` apenas **pula a iteração atual**, ignorando as linhas abaixo dele e voltando diretamente ao cabeçalho do loop para executar o próximo passo da repetição:

\`\`\`python
for num in range(5):
    if num == 2:
        continue # Pula o número 2
    print("Item:", num)
# Imprime: 0, 1, 3, 4
\`\`\`
`,
  },
  'loop_else': {
    title: 'Laço com Cláusula Else',
    summary: 'Execute blocos lógicos específicos que rodam após o encerramento do loop.',
    contentMarkdown: `### Cláusula Else em Loops

O Python oferece uma funcionalidade única que permite associar uma ramificação \`else\` ao encerramento de loops \`for\` ou \`while\`.

* Este bloco de código é acionado apenas se o loop terminar **de forma natural**, sem ter sido interrompido por um comando \`break\` interno.

\`\`\`python
for x in range(3):
    print(x)
else:
    print("Loop finalizado com sucesso!")
\`\`\`
`,
  },
  'infinite_loop': {
    title: 'Prevenção de Loops Infinitos',
    summary: 'Como programar condições seguras em loops para evitar que o navegador trave.',
    contentMarkdown: `### Loops Infinitos

Um loop infinito ocorre quando a condição do loop \`while\` permanece constantemente verdadeira, fazendo com que o script execute sem parar na memória do processador.

No nosso simulador de sandbox, incluímos travas de proteção que interrompem repetições exageradas para segurança do seu navegador, mas é dever do desenvolvedor garantir que as variáveis de controle de loops sejam modificadas incrementalmente a cada passo:

\`\`\`python
# Cuidado, isso precisa incrementar!
contador = 0
while contador < 5:
    print(contador)
    contador += 1 # Essencial para parar o loop!
\`\`\`
`,
  },

  // Section 4 Lessons
  'lists': {
    title: 'Listas em Python (Arrays)',
    summary: 'Coleções ordenadas, mutáveis e extremamente versáteis em Python.',
    contentMarkdown: `### Listas de Dados

Listas permitem armazenar múltiplos itens organizados de forma sequencial em uma única variável utilizando colchetes \`[]\`:

* **Ordenada**: Mantém a exata ordem física original em que os dados foram adicionados.
* **Mutável**: Você pode alterar os elementos, adicionar novos itens ou excluir dados existentes a qualquer momento.
* **Duplicadas**: Permite armazenar itens idênticos livremente.

\`\`\`python
alunos = ["Sarah", "Pablo", "Alice"]
alunos.append("Breno") # Adiciona Breno ao fim
print(alunos)
\`\`\`
`,
  },
  'dicts': {
    title: 'Dicionários (Chave: Valor)',
    summary: 'Modelos de dados estruturados e indexados por chaves exclusivas.',
    contentMarkdown: `### Dicionários no Python

Dicionários são usados para mapear dados em estruturas do tipo **chave-valor** usando chaves \`{}\`. Funcionam como um banco de dados interno simples:

* Não permite chaves duplicadas.
* Permite consulta rápida baseando-se no nome da chave de registro.

\`\`\`python
aluno = {
    "nome": "Gustavo",
    "idade": 17,
    "xp": 350
}
print(aluno["nome"], "possui", aluno["xp"], "XP")
\`\`\`
`,
  },
  'tuples': {
    title: 'Tuplas (Imutáveis)',
    summary: 'Sequências ordenadas especiais e imutáveis delimitadas por parênteses.',
    contentMarkdown: `### Tuplas em Python

Tuplas são coleções estruturadas que funcionam de maneira idêntica às listas normais, porém com uma característica crucial: elas são **imutáveis** (não podem ser alteradas pós-criação):

* Declaradas usando parênteses \`()\`.
* Ideais para dados de configuração constante do sistema que nunca devem sofrer alterações por segurança.

\`\`\`python
coordenadas = (3.14, 9.81)
# coordenadas[0] = 5.0 # Causará erro de execução!
print(coordenadas)
\`\`\`
`,
  },
  'sets': {
    title: 'Conjuntos Sets (Exclusivos)',
    summary: 'Coleções não ordenadas e com garantia de exclusão total de duplicatas.',
    contentMarkdown: `### Conjuntos Sets em Python

Os Sets representam conjuntos matemáticos colecionáveis que **não toleram elementos repetidos** e não possuem uma ordem fixa sequencial:

* Declarados usando a notação de chaves \`{}\`.
* Ideais para remover valores duplicados automaticamente de listas complexas de dados.

\`\`\`python
numeros = {1, 2, 2, 3}
print(numeros) # Imprimirá apenas: {1, 2, 3} (sem duplicado!)
\`\`\`
`,
  },
  'collections_len': {
    title: 'Tamanho de Coleções (len)',
    summary: 'Meça o número total de itens registrados usando a ferramenta len().',
    contentMarkdown: `### Meça o tamanho com a Função len()

Para descobrir o total de itens salvos dentro de qualquer estrutura de coleção (Seja ela Listas, Dicionários, Tuplas ou Sets), usamos a função nativa universal \`len()\`:

\`\`\`python
cidades = ["São Paulo", "Rio", "Curitiba"]
total = len(cidades)
print("Número de cidades cadastradas:", total) # Imprime 3
\`\`\`
`,
  },

  // Section 5 Lessons
  'defs': {
    title: 'Definição de Funções',
    summary: 'Escreva blocos de código reaproveitáveis usando a declaração def.',
    contentMarkdown: `### Escrevendo Funções em Python

Funções são blocos lógicos estruturados que só executam ações específicas quando acionados manualmente de forma explícita.

* Elas ajudam a modularizar programas evitando digitação de códigos repetidos.
* São declaradas no Python usando a palavra reservada \`def\` seguida pelo nome da função e dois-pontos:

\`\`\`python
def saudar_laboratorio():
    print("Olá, Desenvolvedores!")

# Chamando a função para rodar a lógica:
saudar_laboratorio()
\`\`\`
`,
  },
  'params': {
    title: 'Parâmetros e Argumentos',
    summary: 'Transmita informações e variáveis para dentro de blocos de funções.',
    contentMarkdown: `### Parâmetros em Funções

Parâmetros funcionam como variáveis locais de entrada definidas diretamente no cabeçalho de assinatura da função. Eles recebem os valores que passamos no exato momento do acionamento (argumentos):

\`\`\`python
def dar_boas_vindas(estudante):
    print("Olá estudando:", estudante)

dar_boas_vindas("Julia")
dar_boas_vindas("Miguel")
\`\`\`
`,
  },
  'returns': {
    title: 'Retorno de Funções',
    summary: 'Envie um resultado processado de volta para quem acionou a função.',
    contentMarkdown: `### A Instrução return

Para fazer com que uma função execute cálculos e envie as respostas e produtos finais de volta à lógica externa de execução do programa, utilizamos o comando especial \`return\`:

\`\`\`python
def calcular_dobro(numero):
    return numero * 2

resposta = calcular_dobro(25)
print(resposta) # Imprime 50
\`\`\`
`,
  },
  'default_args': {
    title: 'Valores de Parâmetro Padrão',
    summary: 'Configure valores reservas de argumentos para evitar falhas de chamada.',
    contentMarkdown: `### Parâmetros Opcionais Padronizados

Você pode configurar valores opcionais predeterminados para os argumentos da sua função. Isso faz com que a função execute normalmente mesmo que o parâmetro de entrada correspondente não seja fornecido na hora da chamada:

\`\`\`python
def elogiar(aluno="Estudante Nota 10"):
    print("Parabéns!", aluno)

elogiar("Alice") # Exibe: Parabéns! Alice
elogiar() # Exibe: Parabéns! Estudante Nota 10 (usa o padrão!)
\`\`\`
`,
  },
  'lambda_fns': {
    title: 'Expressões Funções Lambda',
    summary: 'Escreva funções anônimas ultrarrápidas de apenas uma única linha lógica.',
    contentMarkdown: `### Expressões Lambda

Funções Lambda (conhecidas como funções anônimas) representam mini-funções simplificadas declaradas de forma compacta em apenas uma linha do arquivo, sem uso de blocos \`def\`:

* Elas podem receber múltiplos argumentos, mas possuem direito a computar apenas **uma única expressão simples** que é retornada de imediato.

\`\`\`python
dobro = lambda x : x * 2
print(dobro(30)) # Imprime 60
\`\`\`
`,
  },
  'project': {
    title: '6. Projeto de Conclusão Prático',
    description: 'Resolva um problema do mundo real aplicando loops, variáveis, estruturas condicionais e operadores aritméticos.',
  },
  'grading_project_lesson': {
    title: 'Projeto do Sistema de Notas Escolares',
    summary: 'Construa um avaliador de notas reais de estudantes que calcula médias e classifica os resultados obtidos.',
    contentMarkdown: `### Desafio de Projeto Prático Real

Neste laboratório de encerramento prático, você irá consolidar o uso de variáveis, operadores aritméticos, conversão de tipos e testes condicionais para programar um **Sistema de Notas Escolares** automatizado!

#### Instruções do Projeto:
Escreva um script Python completo e funcional que execute as seguintes tarefas:
1. Defina três variáveis numéricas representando três notas de provas: \`score1\`, \`score2\` e \`score3\` (valores decimais ou inteiros como por exemplo \`8.5\`, \`9.0\`, \`9.5\`).
2. Calcule de forma matemática a **média aritmética** destas três notas individuais de provas.
3. Exiba o valor da média calculada no console de saída usando o comando de print.
4. Classifique o desempenho do aluno e exiba na saída exatamente a frase correspondente abaixo:
   * Média **exatamente igual a 10**: Imprima exatamente \`"Perfect"\`
   * Média **entre 8.0 e 9.9** (inclusive): Imprima exatamente \`"Very good"\`
   * Média **entre 5.0 e 7.9** (inclusive): Imprima exatamente \`"Good"\`
   * Média **entre 1.0 e 4.9** (inclusive): Imprima exatamente \`"Need to improve"\`

#### Estrutura Exemplo e Fluxo:
\`\`\`python
# 1. Defina as três notas iniciais de prova
score1 = 9.0
score2 = 8.0
score3 = 10.0

# 2. Calcule a média aritmética simples
average = (score1 + score2 + score3) / 3

# 3. Exiba a média consolidada no painel
print("Average calculado:", average)

# 4. Verifique as faixas de classificação e classifique o resultado
if average == 10:
    print("Perfect")
elif average >= 8:
    print("Very good")
elif average >= 5:
    print("Good")
else:
    print("Need to improve")
\`\`\`
`,
  }
};

export const ptQuizTranslations: Record<string, {
  question: string;
  hint: string;
  placeholderText?: string;
  options?: string[];
}> = {
  'q-intro-1': {
    question: 'Qual função nativa do Python é utilizada para exibir textos no console?',
    hint: 'Começa com a letra "p" e imprime termos gráficos na tela de execução.',
    options: ['echo()', 'console.log()', 'print()', 'output()']
  },
  'q-syntax-1': {
    question: 'Complete a linha de código abaixo para indentar corretamente o bloco impresso dentro do desvio condicional:',
    hint: 'Insera exatamente 4 espaços de caractere para representar a margem segura do bloco.',
    placeholderText: 'Insira 4 espaços para indentar'
  },
  'q-comments-1': {
    question: 'Qual caractere é usado para iniciar comentários lógicos de linha única em Python?',
    hint: 'Também conhecido popularmente como hashtag, cerquilha ou jogo da velha.',
    options: ['//', '/*', '#', '<!--']
  },
  'q-input-1': {
    question: 'Qual função interna aguarda sinais e captura inserções de teclado do console da aplicação?',
    hint: 'É intuitivamente o contrário de exportação (output).',
    placeholderText: '____("Digitar dados")'
  },
  'q-wrap-1': {
    question: 'Assinale a alternativa verdadeira a respeito do uso de indentação em blocos no Python:',
    hint: 'O Python lê espaços físicos de formatação para computar o escopo do programa no lugar das chaves de abertura.',
    options: [
      'É opcional e recomendável apenas para design visual',
      'É obrigatória e usada pelo interpretador para estruturar escopos',
      'É feita utilizando cifras e cifrões de dólar',
      'Requer por convenção escrever exatamente 10 espaços'
    ]
  },
  'q-vars-1': {
    question: 'Qual das seguintes declarações lógicas abaixo representa uma variável nomeada de forma ilegal pelas regras de nomenclatura?',
    hint: 'Identificadores e nomes lógicos de variáveis em Python não podem ser iniciados por números.',
    options: ['my_variable = 1', 'myVariable = 2', '2myvariable = 3', '_my_variable = 4']
  },
  'q-bool-1': {
    question: 'Qual é o exato retorno interpretado do comando print(4 != 5)?',
    hint: 'De fato 4 é diferente de 5. Lembre-se do rigor gramatical das iniciais maiúsculas em Booleanos.',
    options: ['True', 'true', 'False', 'false']
  },
  'q-num-1': {
    question: 'Qual operador aritmético no Python calcula especificamente o módulo / resto inteiro de repetição de uma divisão?',
    hint: 'É representado classicamente pelo caractere de sinal de porcentagem.',
    options: ['/', '//', '%', '^']
  },
  'q-str-1': {
    question: 'Dada a string "Pythonist", de que maneira correta acessamos apenas o primeiro caractere da variável letra por índice?',
    hint: 'Toda indexação de sequências em Python é iniciada rigidamente no índice zero.',
    options: ['letra[1]', 'letra[0]', 'letra.first()', 'letra{0}']
  },
  'q-cast-1': {
    question: 'Qual comando nativo força e converte qualquer registro para decimal do tipo ponto flutuante?',
    hint: 'Gera representações decimais contendo separadores estruturados em formato ponto.',
    options: ['int()', 'str()', 'float()', 'decimal()']
  },
  'q-ifelse-1': {
    question: 'Qual palavra reservada representa desvios condicionais intermediários múltiplos?',
    hint: 'Representa a fusão direta dos termos linguísticos "else" mais "if".',
    options: ['else if', 'elif', 'elseif', 'orif']
  },
  'q-loops-1': {
    question: 'Complete a lacuna do comando iterador para fazer a contagem rodar de forma decremental enquanto a variável x se mantiver maior do que zero:',
    hint: 'Usamos a palavra reservada equivalente a "enquanto" em inglês.',
    placeholderText: '___ x > 0:'
  },
  'q-nested-1': {
    question: 'Qual a saída renderizada na tela no caso da execução do programa aninhado acima?',
    hint: 'Rastreie o percurso lógico: o número 12 é par ou ímpar? Ele de fato excede o valor 10?',
    options: ['12 é par de tamanho grande', '12 é par mas de tamanho pequeno', '12 é ímpar de tamanho grande', 'Sem saída']
  },
  'q-logic-1': {
    question: 'Qual operador lógico exige obrigatoriamente que absolutamente todos os testes individuais sejam avaliados de forma concomitante como Verdadeiros?',
    hint: 'Funciona como a conjunção do termo "E" em lógica proposicional.',
    options: ['or', 'and', 'not', 'xor']
  },
  'q-range-1': {
    question: 'Quantas iterações / números serão gerados no loop no caso da execução de range(3, 7)?',
    hint: 'O Python inicia a contagem com o próprio número 3 de forma fechada, parando antes de atingir o teto de limite 7 de forma aberta.',
    options: ['7', '3', '4', '10']
  },
  'q-listloops-1': {
    question: 'Complete a lacuna do laço de repetição abaixo para iterar cada fruta item dentro da coleção de frutas declarada:',
    hint: 'A sintaxe tradicional de loops exige a expressão "X in Y" para percorrer sequências.',
    placeholderText: 'for fruta _______ frutas:'
  },
  'q-break-1': {
    question: 'Qual instrução aborta por definitivo e desliga de imediato o percurso do loop ativo?',
    hint: 'Refere-se ao termo em inglês equivalente a quebrar ou frear o script.',
    options: ['continue', 'exit', 'break', 'stop']
  },
  'q-continue-1': {
    question: 'Complete o bloco lógico abaixo para realizar o pulo imediato de iteração caso o número seja ímpar, partindo diretamente para a contagem seguinte:',
    hint: 'Instrução para "continuar" a repetição a partir do topo do loop.',
    placeholderText: '_____'
  },
  'q-loopelse-1': {
    question: 'A ramificação else anexada a um laço de repetição deixará de rodar no caso de qual ocorrência?',
    hint: 'O else de loops só deixa de rodar se o fluxo do laço sofrer uma quebra de abortamento forçado interno.',
    options: [
      'Se o loop for completado de forma natural até o fim',
      'Se o loop for forçado a parar internamente usando um comando break',
      'Se o loop executar mais de 10 rodadas de processo',
      'Sempre roda independente do que aconteça'
    ]
  },
  'q-infinite-1': {
    question: 'Preencha a lacuna com o ajuste de incremento correto para evitar que o loop rode de forma infinita na máquina:',
    hint: 'Precisamos somar mais 1 à variável "remedio" no escopo de cada passagem.',
    placeholderText: 'remedio = _____________'
  },
  'q-lists-1': {
    question: 'Qual função acessória nativa é empregada para incluir um novo dado ao término final de uma lista física?',
    hint: 'Significa anexar em inglês.',
    options: ['add()', 'push()', 'insert()', 'append()']
  },
  'q-dicts-1': {
    question: 'Complete a lacuna de instrução para acessar o valor mapeado na chave do dicionário sob o rótulo "idade":',
    hint: 'Como nos dicionários, passamos a chave em texto entre colchetes apropriados.',
    placeholderText: 'cadastro_______'
  },
  'q-tuples-1': {
    question: 'De que maneira as Tuplas se diferenciam de forma crucial das Listas normais declaradas no Python?',
    hint: 'Tuplas não podem sofrer qualquer tipo de alteração em seus dados pós-criação.',
    options: [
      'São coleções ilimitadas e infinitas',
      'Não toleram dados contendo strings de texto',
      'São objetos imutáveis',
      'São desprovidas de indexação por números'
    ]
  },
  'q-sets-1': {
    question: 'Qual elemento seria impresso na tela caso tentássemos rodar print({5, 5, 5})?',
    hint: 'Os Sets higienizam e eliminam automaticamente toda e qualquer repetição de elementos internos.',
    options: ['{5, 5, 5}', '{5}', '{15}', 'Erro de depuração']
  },
  'q-queries-1': {
    question: 'Que comando nativo é empregado universalmente para retornar contagem de dados ou tamanhos de coleções?',
    hint: 'Expressa abreviação direta da expressão em inglês equivalente a comprimento (length).',
    options: ['count()', 'size()', 'len()', 'length()']
  },
  'q-defs-1': {
    question: 'Qual termo do vocabulário do Python é reservado para registrar e introduzir uma nova Função?',
    hint: 'Inicia as três primeiras letras da palavra em inglês "define".',
    options: ['function', 'def', 'void', 'create']
  },
  'q-params-1': {
    question: 'Complete o espaço pendente para definir que a função calcular_area possa aceitar e processar os argumentos de base e de altura no seu interior:',
    hint: 'Passe os parâmetros separados por vírgula dentro dos parênteses da assinatura da função.',
    placeholderText: 'def calcular_area(_________________):'
  },
  'q-returns-1': {
    question: 'Qual palavra lógica de comando deve ser adotada para enviar valores processados de volta para fora de uma Função?',
    hint: 'Indica faturamento ou devolução de dados (retornar).',
    options: ['return', 'output', 'give', 'send']
  },
  'q-defaults-1': {
    question: 'Preencha o espaço vazio no cabeçalho de definição abaixo para estabelecer que o parâmetro país assuma por escopo nativo o valor reserva de "Brasil":',
    hint: 'Sintaxe padrão exige a declaração de igualdade direta no cabeçalho das variáveis.',
    placeholderText: 'def nacionalidade(pais_______):'
  },
  'q-lambda-1': {
    question: 'Qual caractere chave é utilizado para construir e instanciar funções enxutas de linha única?',
    hint: 'Digita-se exatamente a expressão que define a letra de álgebra grega "lambda".',
    options: ['def', '->', 'lambda', 'inline']
  },
  'q-project-1': {
    question: 'Qual operador de comparação é ideal para verificar se a média obtida pelo aluno é exatamente igual a 10?',
    hint: 'O duplo sinal de igual representa a verificação de igualdade lógica na linguagem Python.',
    options: ['=', '==', '===', 'eq']
  }
};

export function getTranslatedCourseData(courseData: CourseSection[], language: 'en' | 'pt'): CourseSection[] {
  if (language === 'en') return courseData;

  // Let's perform a highly precise deep mapping override
  return courseData.map((section) => {
    const sectionPt = ptSyllabusTranslations[section.id];
    
    return {
      ...section,
      title: sectionPt?.title || section.title,
      description: sectionPt?.description || section.description,
      lessons: section.lessons.map((lesson) => {
        const lessonPt = ptSyllabusTranslations[lesson.id];
        
        return {
          ...lesson,
          title: lessonPt?.title || lesson.title,
          summary: lessonPt?.summary || lesson.summary,
          contentMarkdown: lessonPt?.contentMarkdown || lesson.contentMarkdown,
          examples: lesson.examples.map((example) => {
            // Note: Keep code unaltered for compilation purposes, optionally translate comments if feasible
            return {
              ...example,
              // We keep custom examples as-is or we can map them if needed
            };
          }),
          quizQuestions: lesson.quizQuestions.map((quiz) => {
            const quizPt = ptQuizTranslations[quiz.id];
            
            return {
              ...quiz,
              question: quizPt?.question || quiz.question,
              hint: quizPt?.hint || quiz.hint,
              placeholderText: quizPt?.placeholderText !== undefined ? quizPt.placeholderText : quiz.placeholderText,
              options: quizPt?.options !== undefined ? quizPt.options : quiz.options
            };
          })
        };
      })
    };
  });
}
