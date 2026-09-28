# Performance Analytics

Sistema web para gerenciamento de usuários, registro de sessões e análise de desempenho.

## Tecnologias

### Backend

* Python
* FastAPI
* SQLAlchemy
* MySQL
* PyMySQL

### Frontend

* React
* Vite
* Axios
* React Router
* Recharts

### Infraestrutura

* GitHub
* Render
* Vercel
* Aiven MySQL

## Arquitetura

Frontend (Vercel)
↓
Backend API (Render)
↓
Banco de dados (Aiven MySQL)

## Funcionalidades

### Usuários

* Cadastrar usuário
* Listar usuários
* Buscar usuário por ID
* Atualizar usuário
* Excluir usuário

### Sessões

* Criar sessão
* Listar sessões
* Buscar sessão
* Excluir sessão

### Estatísticas

* Estatísticas por sessão
* Estatísticas por usuário
* Taxa de acertos
* Taxa de erros
* Pontuação média
* Evolução do desempenho

## Como executar localmente

### Backend

Entre na pasta do backend:

```bash
cd backend
```

Crie o ambiente virtual:

```bash
python -m venv .venv
```

No Windows, ative o ambiente virtual:

```powershell
.venv\Scripts\activate
```

Instale as dependências:

```powershell
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro da pasta `backend`:

```env
DB_USER=root
DB_PASSWORD=SUA_SENHA
DB_HOST=localhost
DB_PORT=3306
DB_NAME=performance_analytics
```

Execute a API:

```powershell
uvicorn app.main:app --reload
```

A API estará disponível em:

```text
http://127.0.0.1:8000
```

A documentação da API estará disponível em:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Em outro terminal, entre na pasta do frontend:

```powershell
cd frontend
```

Instale as dependências:

```powershell
npm install
```

Crie o arquivo `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Execute o frontend:

```powershell
npm run dev
```

O frontend será disponibilizado pela URL apresentada pelo Vite, normalmente:

```text
http://localhost:5173
```

## Variáveis de ambiente

As variáveis de ambiente não devem ser armazenadas no repositório.

### Backend

O backend utiliza:

```env
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=...
DB_NAME=...
```

### Frontend

O frontend utiliza:

```env
VITE_API_URL=...
```

O arquivo `.env` deve permanecer fora do Git.

## Deploy

### Backend

O backend está hospedado no Render.

URL da API:

```text
https://performance-analytics-vs7x.onrender.com
```

Documentação:

```text
https://performance-analytics-vs7x.onrender.com/docs
```

### Frontend

O frontend está hospedado no Vercel.

A URL de produção deve ser obtida no projeto do Vercel.

### Banco de dados

O banco de dados MySQL utilizado em produção está hospedado no Aiven.

## Controle de versão

O código-fonte do projeto é versionado com Git e hospedado no GitHub.

## Segurança

Informações sensíveis, como senhas do banco de dados e outras credenciais, não devem ser adicionadas ao repositório.

Arquivos de ambiente, como `.env`, devem permanecer no `.gitignore`.

## Licença

Projeto acadêmico e de portfólio.
