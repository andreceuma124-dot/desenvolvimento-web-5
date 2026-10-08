// ==========================================
// PARTE 1 – Manipulação e Validação de Dados (Exercício Guiado)
// ==========================================

console.log("--- PARTE 1 ---");

const pedidos = [
  { cliente: "Bia", valor: 120.00, status: "pago" },
  { cliente: "Carlos", valor: 80.50, status: "pendente" },
  { cliente: "", valor: 50.00, status: "pago" }, // cliente vazio (inválido)
  { cliente: "Ana", valor: -10, status: "pago" }, // valor inválido
  { cliente: "Lucas", valor: 250.00, status: "pago" },
  { cliente: "Mariana", valor: 150.00, status: "cancelado" }
];

// 1. Validar cada pedido (cliente não vazio e valor > 0)
const pedidosValidos = pedidos.filter(p => p.cliente.trim() !== "" && typeof p.valor === "number" && p.valor > 0);

// 2. Filtrar apenas os com status "pago"
const pedidosPagos = pedidosValidos.filter(p => p.status === "pago");

// 3. Calcular total faturado com reduce
const totalFaturado = pedidosPagos.reduce((acc, p) => acc + p.valor, 0);

// 4. Gerar textos no formato "Bia – R$ 120.00" utilizando toFixed(2)
const relatorioTextos = pedidosPagos.map(p => `${p.cliente} – R$ ${p.valor.toFixed(2)}`);

console.log("Pedidos Pagos:", relatorioTextos);
console.log(`Total Faturado: R$ ${totalFaturado.toFixed(2)}`);


// ==========================================
// PARTE 2 – Mini Projeto: Buscador de CEP
// ==========================================

const formCep = document.querySelector("#form-cep");
const inputCep = document.querySelector("#input-cep");
const btnBuscarCep = document.querySelector("#btn-buscar-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCepElement = document.querySelector("#historico-cep");

const historicoCeps = [];

formCep.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Limpeza de espaços e remoção de hífen com expressão regular
  const cepLimpo = inputCep.value.trim().replace(/\D/g, "");

  // Validação: exatamente 8 dígitos numéricos
  if (!/^\d{8}$/.test(cepLimpo)) {
    statusCep.textContent = "Erro: CEP inválido! Digite exatamente 8 números.";
    statusCep.className = "status erro";
    resultadoCep.replaceChildren();
    return;
  }

  // Estado: Carregando
  statusCep.textContent = "Buscando...";
  statusCep.className = "status carregando";
  btnBuscarCep.disabled = true;
  resultadoCep.replaceChildren();

  try {
    // AbortSignal.timeout(5000) evita requisições pendentes indefinidamente
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error("Falha na conexão com o servidor.");
    }

    const data = await response.json();

    // Estado: Vazio / Não Encontrado (ViaCEP retorna { erro: true })
    if (data.erro) {
      statusCep.textContent = "CEP não encontrado.";
      statusCep.className = "status erro";
      return;
    }

    // Estado: Sucesso
    statusCep.textContent = "";
    statusCep.className = "status";

    const dl = document.createElement("dl");

    const campos = [
      { t: "Rua", v: data.logradouro || "N/A" },
      { t: "Bairro", v: data.bairro || "N/A" },
      { t: "Cidade", v: data.localidade || "N/A" },
      { t: "UF", v: data.uf || "N/A" }
    ];

    campos.forEach(campo => {
      const dt = document.createElement("dt");
      dt.textContent = campo.t;
      const dd = document.createElement("dd");
      dd.textContent = campo.v; // Proteção contra XSS usando textContent
      dl.append(dt, dd);
    });

    resultadoCep.append(dl);

    // Bônus: Histórico de buscas
    historicoCeps.push({ cep: cepLimpo, cidade: data.localidade, uf: data.uf });
    atualizarHistoricoCep();

  } catch (erro) {
    statusCep.textContent = `Erro: ${erro.message}`;
    statusCep.className = "status erro";
  } finally {
    btnBuscarCep.disabled = false;
  }
});

function atualizarHistoricoCep() {
  historicoCepElement.replaceChildren();
  historicoCeps.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.cep} - ${item.cidade}/${item.uf}`;
    historicoCepElement.append(li);
  });
}


// ==========================================
// PARTE 3 – Tarefa de Casa: Desafio Mini Pokédex
// ==========================================

const formPokemon = document.querySelector("#form-pokemon");
const inputPokemon = document.querySelector("#input-pokemon");
const btnBuscarPokemon = document.querySelector("#btn-buscar-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

formPokemon.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomePokemon = inputPokemon.value.trim().toLowerCase();

  if (nomePokemon === "") {
    statusPokemon.textContent = "Por favor, informe o nome de um Pokémon.";
    statusPokemon.className = "status erro";
    resultadoPokemon.replaceChildren();
    return;
  }

  // Estado: Carregando
  statusPokemon.textContent = "Buscando Pokémon...";
  statusPokemon.className = "status carregando";
  btnBuscarPokemon.disabled = true;
  resultadoPokemon.replaceChildren();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`, {
      signal: AbortSignal.timeout(5000)
    });

    // Verificação explícita de erro HTTP (ex: 404)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Pokémon não encontrado!");
      }
      throw new Error("Erro ao buscar dados do Pokémon.");
    }

    const data = await response.json();

    // Estado: Sucesso
    statusPokemon.textContent = "";
    statusPokemon.className = "status";

    const container = document.createElement("div");

    const titulo = document.createElement("h3");
    titulo.textContent = data.name.toUpperCase();

    const img = document.createElement("img");
    img.src = data.sprites.front_default;
    img.alt = data.name;

    const pTipos = document.createElement("p");
    const tipos = data.types.map(t => t.type.name).join(", ");
    pTipos.textContent = `Tipo(s): ${tipos}`;

    container.append(titulo, img, pTipos);
    resultadoPokemon.append(container);

  } catch (erro) {
    statusPokemon.textContent = erro.message;
    statusPokemon.className = "status erro";
  } finally {
    btnBuscarPokemon.disabled = false;
  }
});