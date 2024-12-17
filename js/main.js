import ui from "./ui.js"
import api from "./api.js"

const pensamentosSet = new Set()

async function adicionarChaveAoPensamento() {
  try {
    const pensamentos = await api.buscarPensamentos()
    pensamentos.forEach(pensamento => {
      const chavePensamento = `${pensamento.conteudo.trim().toLoweCase()}-${pensamentoautoria.trim().toLowerCase()}`
      pensamentosSet.add(chavePensamento)
    })
  } catch (error) {
    alert('Erro ao adicionar chave ao pensamento')
  }
}

function removerEspaços(string) {
  return string.replaceAll(/\s+/g, "")
}

const regexConteudo = /^[\p{L}\s\p{P}]{10,}$/u
const regexAutoria = /^[a-zA-Z]{3,15}$/

function validarAutoria(autoria) {
  return regexAutoria.test(autoria)
}

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo)
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos()
  adicionarChaveAoPensamento()

  const formularioPensamento = document.getElementById("pensamento-form")
  const botaoCancelar = document.getElementById("botao-cancelar")
  const inputBusca = document.getElementById("campo-busca")

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario)
  botaoCancelar.addEventListener("click", manipularCancelamento)
  inputBusca.addEventListener("input", manipularBusca)
})

async function manipularSubmissaoFormulario(event) {
  event.preventDefault()
  const id = document.getElementById("pensamento-id").value
  const conteudo = document.getElementById("pensamento-conteudo").value
  const autoria = document.getElementById("pensamento-autoria").value
  const data = document.getElementById('pensamento-data').value

  const conteudoSemEspaços = removerEspaços(conteudo)
  const autoriaSemEspaços = removerEspaços(autoria)

  if(!validarConteudo(conteudoSemEspaços)) {
    alert("É permitida a inclusão apenas de letras e espaços com no mínimo 10 caracteres")
    return
  }

  if (!validarAutoria(autoriaSemEspaços)) {
    alert("É permitida a inclusão de letras e entre 3 e 15 caracteres sem espaços")
    return
  }

  if(!validarData(data)) {
    alert("Não é permitido o cadastro de datas futuras. Selecione outra data")
    return
  }

  const chaveNovoPensamento = `
    ${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}
  `

  if(pensamentosSet.has(chaveNovoPensamento)) {
    alert('Esse pensamento já existe')
    return
  }

  try {
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria, data })
    } else {
      await api.salvarPensamento({ conteudo, autoria, data })
    }
    ui.renderizarPensamentos()
  } catch {
    alert("Erro ao salvar pensamento")
  }
}

function manipularCancelamento() {
  ui.limparFormulario()
}

async function manipularBusca() {
  const termoBusca = document.getElementById("campo-busca").value
  try {
    const pensamentosFiltrados = await api.buscarPendamentosPorTermo(termoBusca)
    ui.renderizarPensamentos(pensamentosFiltrados)
  } catch (error) {
    alert("Erro ao realizar busca")
  }
}

function validarData(data) {
  const dataAtual = new Date()
  const dataInserida = new Date(data)
  return dataInserida <= dataAtual
}