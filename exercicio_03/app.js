"use strict";

// EC01 - Alunos, EXERCÍCIO 3: Eventos e funções anônimas
// Este arquivo funciona sozinho, com o index.html desta pasta.

class Aluno {
  constructor(id, nome, idade, curso, notaFinal) {
    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.curso = curso;
    this.notaFinal = notaFinal;
  }

  isAprovado() { return this.notaFinal >= 7; }
  toString() { return `${this.nome} - ${this.curso} - nota ${this.notaFinal.toFixed(1)} - ${this.isAprovado() ? 'Aprovado' : 'Reprovado'}`; }
}

let alunos = [];
let proximoId = 1;
let idEmEdicao = null;
const formulario = document.getElementById('form-registro');
const tabela = document.getElementById('tabela-registros');
const mensagem = document.getElementById('mensagem');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoCancelar = document.getElementById('btn-cancelar');
const campoNome = document.getElementById('nome');
const campoIdade = document.getElementById('idade');
const campoCurso = document.getElementById('curso');
const campoNotaFinal = document.getElementById('notaFinal');

function avisar(texto) {
  mensagem.textContent = texto;
  console.log(texto);
}

function lerFormulario() {
  return {
    nome: campoNome.value.trim(),
    idade: Number(campoIdade.value),
    curso: campoCurso.value,
    notaFinal: Number(campoNotaFinal.value)
  };
}

function dadosValidos(dados) {
  return dados.nome.length > 0 &&
    Number.isInteger(dados.idade) && dados.idade >= 1 && dados.idade <= 120 &&
    ['JavaScript', 'Python', 'Java'].includes(dados.curso) &&
    Number.isFinite(dados.notaFinal) && dados.notaFinal >= 0 && dados.notaFinal <= 10;
}

function criarCelula(linha, conteudo) {
  const td = document.createElement('td');
  td.textContent = String(conteudo); // Protege contra HTML digitado no formulário.
  linha.appendChild(td);
  return td;
}

// Arrow functions: buscar, excluir e atualizar usando o ID de cada registro.
const buscarRegistro = (id) => alunos.find((registro) => registro.id === id);
const excluirRegistro = (id) => {
  alunos = alunos.filter((registro) => registro.id !== id);
};
const atualizarRegistro = (id, dados) => {
  const registro = buscarRegistro(id);
  if (!registro) return false;
  registro.nome = dados.nome;
  registro.idade = dados.idade;
  registro.curso = dados.curso;
  registro.notaFinal = dados.notaFinal;
  return true;
};

function encerrarEdicao() {
  idEmEdicao = null;
  formulario.reset();
  botaoSalvar.textContent = 'Cadastrar';
  botaoCancelar.hidden = true;
}

function renderizarTabela() {
  tabela.replaceChildren();
  if (alunos.length === 0) {
    const linha = document.createElement('tr');
    criarCelula(linha, 'Nenhum aluno cadastrado.').colSpan = 7;
    tabela.appendChild(linha);
    return;
  }

  alunos.forEach((aluno) => {
    const linha = document.createElement('tr');
    criarCelula(linha, aluno.id);
    criarCelula(linha, aluno.nome);
    criarCelula(linha, aluno.idade);
    criarCelula(linha, aluno.curso);
    criarCelula(linha, aluno.notaFinal.toFixed(1));
    criarCelula(linha, aluno.isAprovado() ? 'Aprovado' : 'Reprovado');
    const acoes = document.createElement('td');
    const editar = document.createElement('button');
    editar.type = 'button';
    editar.textContent = 'Editar';
    editar.addEventListener('click', function () {
      idEmEdicao = aluno.id;
      campoNome.value = aluno.nome;
      campoIdade.value = aluno.idade;
      campoCurso.value = aluno.curso;
      campoNotaFinal.value = aluno.notaFinal;
      botaoSalvar.textContent = 'Salvar alterações';
      botaoCancelar.hidden = false;
      avisar(`Editando: ${aluno.nome}.`);
      campoNome.focus();
    });
    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.textContent = 'Excluir';
    excluir.addEventListener('click', function () {
      excluirRegistro(aluno.id);
      if (idEmEdicao === aluno.id) encerrarEdicao();
      avisar(`Excluído: ${aluno.nome}.`);
      atualizarTela();
    });
    acoes.append(editar, document.createTextNode(' '), excluir);
    linha.appendChild(acoes);
    tabela.appendChild(linha);
  });
}

function atualizarTela() {
  renderizarTabela();
}

// Evento do formulário: usa função anônima.
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const dados = lerFormulario();
  if (!dadosValidos(dados)) {
    avisar('Dados inválidos. Confira todos os campos.');
    return;
  }

  if (idEmEdicao === null) {
    const aluno = new Aluno(proximoId++, dados.nome, dados.idade, dados.curso, dados.notaFinal);
    alunos.push(aluno);
    avisar('Aluno cadastrado com sucesso.');
  } else {
    if (!atualizarRegistro(idEmEdicao, dados)) {
      avisar('Registro não encontrado.');
      encerrarEdicao();
      atualizarTela();
      return;
    }
    avisar('Aluno atualizado com sucesso.');
  }
  encerrarEdicao();
  atualizarTela();
});

botaoCancelar.addEventListener('click', function () {
  encerrarEdicao();
  avisar('Edição cancelada.');
});

// Exemplo: troca de função anônima tradicional por arrow function.
// ANTES: const dobro = function (valor) { return valor * 2; };
// DEPOIS: const dobro = (valor) => valor * 2;

atualizarTela();
