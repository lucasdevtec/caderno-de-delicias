# AGENTS.md

## Objetivo

Manter o repositório simples, seguro e previsível, com o mínimo de mudanças necessárias para entregar cada tarefa.

Prioridades:

1. Correção.
2. Clareza.
3. Mudanças pequenas e isoladas.
4. Baixo risco.
5. Economia de tokens e tempo.

Quando houver dúvida relevante sobre intenção, arquitetura, escopo ou comportamento esperado, **pare e pergunte antes de decidir**. Não invente requisitos.

## Git: regras obrigatórias

### Commits

- **Todo commit deve ser atômico.**
- Um commit deve representar **uma única mudança lógica**.
- Não misture:
  - feature + refactor não relacionado;
  - bugfix + formatação geral;
  - dependência + alterações não relacionadas;
  - código + mudanças oportunistas em outros arquivos;
  - mudanças funcionais + renomeações/movimentações não necessárias.
- Se duas mudanças puderem ser revertidas independentemente, normalmente devem ser commits separados.
- O commit deve deixar o projeto em um estado coerente e, quando aplicável, compilável/testável.
- Não crie commits artificiais apenas para aumentar a quantidade de commits. Atomicidade significa **coerência lógica**, não tamanho mínimo.
- Antes de criar um commit, revise o diff completo:
  - `git status`
  - `git diff`
  - `git diff --cached`
- Nunca inclua arquivos, alterações ou artefatos que não pertençam à tarefa.
- Não faça `git add .` cegamente. Prefira adicionar arquivos/trechos explicitamente quando houver risco de incluir mudanças indevidas.

### Mensagens de commit

Use mensagens curtas, claras e orientadas à mudança.

Formato preferencial:

`<tipo>: <descrição objetiva>`

Tipos permitidos:

- `feat`: nova funcionalidade
- `fix`: correção
- `refactor`: refatoração sem mudança intencional de comportamento
- `perf`: melhoria de desempenho
- `test`: testes
- `docs`: documentação
- `build`: build/dependências/configuração de build
- `ci`: CI/CD
- `chore`: manutenção sem impacto funcional

Regras:

- Use verbo no imperativo ou descrição objetiva.
- Não explique a implementação na primeira linha.
- Não use mensagens vagas como `update`, `changes`, `fix stuff` ou `wip`.
- O corpo do commit só é necessário quando a razão da mudança não for óbvia.

Exemplos:

- `feat: add user invitation flow`
- `fix: prevent duplicate study cycles`
- `refactor: isolate tenant repository`
- `test: cover cycle creation`
- `docs: update local setup`

### Histórico

- Preserve um histórico fácil de ler e reverter.
- Não faça squash de commits atômicos automaticamente.
- Não reescreva histórico compartilhado sem instrução explícita.
- Evite `git reset --hard`, `git clean`, `git rebase`, `git commit --amend` ou operações destrutivas quando houver risco de perda de trabalho.
- Antes de alterar histórico, confirme a intenção quando ela não estiver explícita.
- Nunca apague ou descarte mudanças do usuário para "limpar" o working tree.

### Branches

- Não crie branches desnecessárias para tarefas triviais quando o fluxo existente do projeto não exigir isso.
- Respeite a estratégia de branches já adotada pelo repositório.
- Não altere a branch atual sem necessidade.
- Nunca faça merge/rebase/push para outra branch sem que isso faça parte da tarefa ou tenha sido explicitamente solicitado.

### Push e remoto

- **Não faça `git push` por iniciativa própria**, salvo se o usuário tiver solicitado explicitamente o push ou o fluxo do agente tiver autorização inequívoca para isso.
- Antes de push, confirme que o diff e os commits enviados são os esperados.
- Nunca use `git push --force` ou equivalente sem autorização explícita.
- Nunca use `--force` para contornar conflito ou proteção de branch.

## Fluxo padrão de trabalho

Para uma tarefa de código:

1. Entenda o pedido e o escopo.
2. Inspecione o estado do Git antes de alterar qualquer coisa.
3. Leia apenas os arquivos necessários.
4. Faça a menor mudança que resolva o problema.
5. Não refatore código não relacionado.
6. Execute validações relevantes e disponíveis.
7. Revise o diff.
8. Separe mudanças em commits atômicos quando solicitado ou quando o fluxo do projeto exigir commits.
9. Informe claramente o que foi alterado e quais validações foram executadas.

## Economia de tokens

- Prefira inspeção direcionada a varreduras completas do repositório.
- Leia apenas o contexto necessário para tomar uma decisão.
- Não reproduza arquivos inteiros quando um trecho for suficiente.
- Não explique código óbvio.
- Não faça buscas redundantes.
- Não altere arquivos apenas para "melhorá-los".
- Não introduza abstrações, dependências ou padrões sem necessidade.
- Ao encontrar uma decisão ambígua que possa alterar o resultado, **pergunte em vez de gastar tokens especulando**.

## Segurança e preservação do trabalho

- Nunca exponha, registre ou comite segredos, tokens, chaves privadas, `.env` ou credenciais.
- Respeite `.gitignore` e os arquivos de configuração existentes.
- Não reverta alterações pré-existentes do usuário sem autorização.
- Se o working tree já possuir mudanças, trate-as como pertencentes ao usuário até prova em contrário.
- Se uma mudança pré-existente interferir na tarefa, explique o conflito e peça orientação antes de descartá-la.
- Não gere arquivos temporários dentro do repositório sem necessidade; remova artefatos temporários criados durante o trabalho.

## Quando perguntar

Pergunte antes de agir quando houver ambiguidade material, especialmente sobre:

- comportamento esperado;
- alteração de API ou contrato;
- mudança de banco/migração;
- remoção de código ou dados;
- escolha entre arquiteturas com impactos relevantes;
- alteração de dependências;
- estratégia de branch/merge/rebase;
- necessidade de quebrar uma tarefa em commits diferentes;
- qualquer operação potencialmente destrutiva.

Se a decisão for pequena, reversível e claramente determinada pelo contexto do projeto, decida e siga em frente.

## Regra final

**Faça somente o necessário, em mudanças logicamente isoladas, com histórico Git limpo e reversível. Quando não houver informação suficiente para uma decisão importante, pergunte.**
