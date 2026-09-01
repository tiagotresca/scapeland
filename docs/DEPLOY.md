# Scapeland — deploy e leads

## 1. Pôr o site live no Vercel (conta scapeland)

O site é estático — não há build. Dois caminhos:

**Pelo dashboard (recomendado, ~2 min):**
1. Entrar em [vercel.com](https://vercel.com) com a conta da Scapeland.
2. **Add New → Project → Import Git Repository**.
3. Se o GitHub ainda não estiver ligado a essa conta Vercel, autorizar o
   *Vercel GitHub App* e dar-lhe acesso ao repositório `tiagotresca/scapeland`.
4. Selecionar o repo. Framework preset: **Other**; Build command: *(vazio)*;
   Output directory: *(vazio — raiz)*. Deploy.
5. Em **Settings → Git → Production Branch**, escolher a branch a servir
   (hoje o site está em `claude/scapeland-institutional-site-v9cvn8`;
   quando fizermos merge para `main`, mudar aqui).
6. Domínio: **Settings → Domains** → adicionar `scapeland.com` e seguir as
   instruções de DNS.

**Pela CLI (alternativa):** `npm i -g vercel && vercel login` na pasta do
repo, depois `vercel --prod`.

## 2. Leads do formulário → Google Sheet

As leads caem na folha **[Scapeland Leads](https://docs.google.com/spreadsheets/d/1xljqH0cVv31maySnlTqf-j0ilOarsr7LMMTaBWsvVhs)**
(Date · Name · Email · Phone · Source), através de um Web App do Google
Apps Script — sem servidores nem chaves no Vercel.

Setup único (~2 min, na conta Google dona da folha):
1. Abrir a folha → **Extensões → Apps Script**.
2. Apagar o conteúdo e colar o ficheiro
   [`scripts/google-apps-script-leads.gs`](../scripts/google-apps-script-leads.gs). Guardar.
3. **Implementar → Nova implementação → Aplicação Web** →
   *Executar como:* *Eu* · *Quem tem acesso:* **Qualquer pessoa**. Autorizar.
4. Copiar o **URL da aplicação Web** (`https://script.google.com/macros/s/…/exec`).
5. Colar esse URL em `FORM_ENDPOINT`, no topo de
   [`assets/js/main.js`](../assets/js/main.js), commit e push — o Vercel
   redeploya sozinho.

Enquanto `FORM_ENDPOINT` estiver vazio, o formulário abre um email
pré-preenchido para `hello@scapeland.com` como fallback.
