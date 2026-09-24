# ⚖️ LEGAL.md — Termos de Uso e Política de Privacidade (Conformidade LGPD)

Este documento estabelece a estrutura jurídica e de privacidade de dados para a operação do **OmniSDR** em conformidade com a **Lei Geral de Proteção de Dados (Lei Federal nº 13.709/2018 - LGPD)**.

---

## 1. Definições de Papéis perante a LGPD

* **Controlador dos Dados:** A empresa cliente do SaaS (ex: Concessionária, Corretora, Clínica), responsável por definir as finalidades do atendimento aos seus próprios consumidores (leads).
* **Operador dos Dados:** O **OmniSDR**, que fornece a infraestrutura tecnológica, inteligência artificial e banco de dados para processamento estrito das instruções do Controlador.
* **Titular dos Dados:** O consumidor/lead final que interage via WhatsApp, Instagram ou formulário de Quiz.

---

## 2. Bases Legais e Finalidades do Tratamento

1. **Execução de Procedimentos Preliminares relacionados a Contrato (Art. 7º, V da LGPD):**
   * Coleta de nome, telefone, modelo de interesse e informações financeiras preliminares para elaboração de propostas comerciais e simulações.
2. **Consentimento e Legítimo Interesse (Art. 7º, I e IX da LGPD):**
   * Armazenamento do histórico de conversas para continuidade do atendimento e melhoria da precisão do assistente de IA.

---

## 3. Segurança no Armazenamento de Mensagens e Gravações de Voz

* **Criptografia em Trânsito e em Repouso:** Todas as comunicações utilizam TLS 1.3/HTTPS e os dados no Supabase PostgreSQL são criptografados em repouso.
* **Gravações de Áudio e Voz:** Os arquivos de áudio transitados no WhatsApp ou ligações telefônicas são convertidos em texto para busca semântica e os arquivos originais são descartados ou retidos por período máximo parametrizável pelo cliente (padrão: 90 dias).
* **Isolamento Lógico:** Os dados de uma organização são completamente segregados das demais através de chaves de identificação exclusivas (`organizationId`).

---

## 4. Direitos dos Titulares de Dados

O OmniSDR disponibiliza ferramentas no painel para que o Controlador atenda às solicitações dos Titulares:
1. **Acesso e Confirmação:** Visualização do histórico completo do lead no CRM.
2. **Anonimização ou Exclusão Definitiva:** Botão de exclusão rápida no painel de detalhes do lead, apagando mensagens, agendamentos e registros vinculados.
3. **Opt-Out de IA:** Comando automático que permite ao lead solicitar transferência imediata para um operador humano digitando palavras como *"Falar com atendente"* ou *"Humano"*.

---

## 5. Responsabilidade sobre o Conteúdo da Base de Conhecimento (RAG)
O Cliente B2B declara que possui todos os direitos e autorizações sobre os arquivos, manuais e tabelas inseridos na base de conhecimento da IA, abstendo-se de fazer upload de dados sensíveis ou segredos industriais de terceiros sem a devida base legal.
