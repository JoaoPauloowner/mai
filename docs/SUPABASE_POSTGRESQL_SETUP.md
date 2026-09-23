# 🚀 Guia de Ativação: Supabase PostgreSQL + pgvector (Padrão Ouro)

Este guia orienta a conexão do SaaS ao banco de dados em nuvem do **Supabase**, habilitando a extensão nativa de vetores `pgvector` para o RAG de alta velocidade.

---

## 1. Criar o Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto.
2. Defina uma senha forte para o banco de dados e selecione a região mais próxima (ex: `sa-east-1` São Paulo ou `us-east-1`).

---

## 2. Executar o Script de Inicialização e pgvector
1. No painel do Supabase, vá em **SQL Editor** (ícone de terminal à esquerda).
2. Clique em **New Query**.
3. Copie todo o conteúdo do arquivo [`prisma/migrations_supabase/init_supabase_pgvector.sql`](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/prisma/migrations_supabase/init_supabase_pgvector.sql).
4. Cole no editor e clique em **Run** (Executar).

> **O que esse script faz:**
> - Habilita a extensão `vector` (`pgvector`).
> - Cria todas as tabelas multi-tenant com índices otimizados.
> - Cria o índice HNSW de busca vetorial por similaridade de cossenos.
> - Cria a stored procedure `match_knowledge_chunks` para busca semântica em tempo real (< 15ms).

---

## 3. Configurar as Variáveis de Ambiente no `.env`
No Supabase, vá em **Project Settings** $\rightarrow$ **Database**:

1. **Connection Pooling (Transaction Mode - Porta 6543):**
   ```env
   DATABASE_URL="postgresql://postgres.[SEU-PROJECT-REF]:[SUA-SENHA]@aws-0-[REGIAO].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
2. **Direct Connection (Session Mode - Porta 5432):**
   ```env
   DIRECT_URL="postgresql://postgres.[SEU-PROJECT-REF]:[SUA-SENHA]@aws-0-[REGIAO].pooler.supabase.com:5432/postgres"
   ```

---

## 4. Alternar o Prisma para PostgreSQL
Quando for subir para produção ou rodar localmente apontando para o Supabase:

1. Substitua o `prisma/schema.prisma` pelo arquivo [`prisma/schema.postgresql.prisma`](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/prisma/schema.postgresql.prisma).
2. Execute:
   ```bash
   npx prisma generate
   ```

---

## 5. Arquitetura Híbrida Inteligente (RAG Resiliente)
O motor de busca RAG em [`src/lib/embeddings.ts`](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/src/lib/embeddings.ts) foi construído com arquitetura híbrida:
- **No Supabase/PostgreSQL:** Executa a busca vetorial via hardware e índice HNSW com a função SQL nativa.
- **Em Desenvolvimento Local/SQLite:** Executa a busca em memória via fallback de similaridade de cosseno, garantindo que o sistema nunca pare de funcionar.
