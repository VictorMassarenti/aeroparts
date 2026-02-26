✈️ SISTEMA DE VENDAS AERONÁUTICO – ESTRUTURA IDEAL

🔹 1️⃣ MÓDULO: CADASTRO DE PEÇAS (MASTER PART DATABASE)

Cada PN precisa ter:

Campos obrigatórios:
	•	PN
	•	Description
	•	ATA Chapter
	•	Manufacturer
	•	Condition (NEW / OH / SV / AR / NS / PMA)
	•	Unit of Measure (EA, SET, KIT)
	•	Traceability Required? (Sim/Não)
	•	Shelf Life (se aplicável)
	•	Hazardous? (Sim/Não)

📌 Extra inteligente:
	•	Campo “Alternate PN”
	•	Campo “Superseded PN”
	•	Foto da peça
	•	Certificado anexado

⸻

🔹 2️⃣ MÓDULO: CONTROLE DE ESTOQUE

Cada entrada precisa gerar um lote rastreável.

Campos:
	•	PN
	•	Serial Number (se aplicável)
	•	Batch/Lot
	•	Quantity
	•	Cost unitário
	•	Supplier
	•	Invoice number
	•	Data de entrada
	•	Certificado anexado (PDF upload)
	•	Localização (Shelf A1, Warehouse Orlando etc)

📌 Regras importantes:
	•	Não permitir venda se estoque = 0
	•	Aviso automático quando estoque < mínimo
	•	Histórico de movimentação por PN

⸻

🔹 3️⃣ MÓDULO: COTAÇÃO (RFQ → QUOTE)

Fluxo:

Cliente envia RFQ →
Você cria cotação no sistema →
Sistema gera PDF automático com:
	•	Logo AeroShow
	•	Quote number
	•	Data
	•	Validade
	•	PN
	•	Condição
	•	Quantidade
	•	Unit price
	•	Total
	•	Lead time
	•	Shipping not included / included

Status:
	•	Open
	•	Sent
	•	Won
	•	Lost

📌 Se “Won” → botão Convert to Invoice

⸻

🔹 4️⃣ MÓDULO: INVOICE

Quando converte:
	•	Puxa dados da cotação
	•	Gera número sequencial automático
	•	Permite inserir:
	•	Shipping
	•	Tax
	•	Wire / Credit Card fee

Quando marcar como Paid:
→ Sistema dá baixa automática no estoque

⸻

🔹 5️⃣ MÓDULO: ARQUIVAMENTO DE CERTIFICADOS

Cada lote vendido deve:
	•	Gerar pasta automática:

⸻

1) Módulo Cadastro

✅ Clientes (Customers)

Campos essenciais:
	•	Customer ID (auto)
	•	Company / Name
	•	Contact person
	•	Email(s)
	•	Phone / WhatsApp
	•	Billing Address
	•	Shipping Address
	•	Tax ID (EIN/CNPJ, opcional)
	•	Payment terms (CC, Wire, NET 15/30)
	•	Credit limit (opcional)
	•	Status (Active/Inactive)
	•	Notes

Regras úteis:
	•	Cliente pode ter múltiplos contatos
	•	“Default shipping address” para puxar automático na invoice

✅ Fornecedores (Vendors)

Campos essenciais:
	•	Vendor ID (auto)
	•	Company name
	•	Contact person
	•	Email(s)
	•	Phone
	•	Address
	•	Payment method (Wire/CC)
	•	Lead time padrão
	•	Currency (USD/BRL)
	•	Rating interno (A/B/C)
	•	Notes

Regras úteis:
	•	Vincular cada compra/entrada de estoque a 1 fornecedor
	•	Guardar dados bancários (com permissão restrita)

⸻

2) Módulo Compras (para alimentar estoque + financeiro)

✅ Purchase Request / RFQ to Vendor (opcional)
	•	Itens (PN, QTY, condição)
	•	Vendor selecionado
	•	Status (Draft / Sent / Quoted / Ordered)

✅ Purchase Order (PO)
	•	PO Number
	•	Vendor
	•	Ship-to
	•	Items (PN, QTY, unit cost)
	•	Shipping cost (inbound)
	•	Taxes/fees
	•	Total landed cost
	•	Status (Open / Shipped / Received / Closed)

✅ Receiving (Entrada de Estoque)

Quando marcar “Received”:
	•	Cria lote no estoque
	•	Anexa docs (8130-3 / C of C)
	•	Gera automaticamente Conta a Pagar (A/P) do fornecedor

📌 Aqui nasce seu custo real (landed cost), que é chave pra margem.

⸻

3) Módulo Vendas (Quote → Invoice → Baixa estoque)

✅ Quote (Cotação)
	•	Quote #
	•	Customer
	•	Items (PN, QTY, unit sale price, condition)
	•	Lead time
	•	Shipping outbound (opcional)
	•	Valid until
	•	Status (Open/Sent/Won/Lost)

✅ Invoice (Faturamento)
	•	Invoice #
	•	Customer
	•	Itens (puxa da quote)
	•	Shipping outbound
	•	Tax
	•	Total
	•	Due date
	•	Status (Issued / Paid / Overdue / Cancelled)

Ao emitir invoice:
	•	Reserva estoque (opcional)
Ao marcar “Paid” ou “Shipped”:
	•	Dá baixa no estoque (conforme sua regra)

📌 Minha sugestão aeronáutica:
	•	Baixa no “Shipped” (mais real)
	•	Financeiro fecha no “Paid”

⸻

4) Financeiro: Contas a Pagar e Receber

✅ Contas a Pagar (A/P)

Origem:
	•	Automaticamente do PO/Receiving
Campos:
	•	Vendor
	•	Invoice Vendor #
	•	Due date
	•	Amount
	•	Currency
	•	Status (Open/Paid/Partial)

✅ Contas a Receber (A/R)

Origem:
	•	Automaticamente da Invoice
Campos:
	•	Customer
	•	Invoice #
	•	Due date
	•	Amount
	•	Status (Open/Paid/Partial)

⸻

5) Conciliação do Faturamento + Margem de Lucro

Aqui é o “coração” do que você pediu.

✅ Como calcular margem corretamente (modelo)

Você precisa armazenar:

COGS (Cost of Goods Sold) por item vendido

COGS =
(custo unitário do lote do estoque)
	•	frete inbound rateado
	•	taxas/fees inbound (se tiver)

Receita por item

Receita =
preço de venda unitário
(+) shipping outbound (opcional — eu recomendo separar como receita de frete, se repassado)

⸻

✅ Regras para conciliação (recomendado)

A) Conciliação por Invoice

Quando a invoice for “Paid”, o sistema:
	•	Confirma “Receita realizada”
	•	Soma itens vendidos
	•	Calcula COGS automaticamente (pelos lotes baixados)
	•	Mostra:
	•	Receita total
	•	COGS total
	•	Lucro bruto
	•	Margem %

B) Dashboard Financeiro
	•	Faturamento mês (paid vs issued)
	•	A receber (aging 0–30 / 31–60 / 61+)
	•	A pagar (aging)
	•	Margem por:
	•	PN
	•	Cliente
	•	Fornecedor
	•	Vendedor (se tiver)
	•	Período