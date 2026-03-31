// ===== NAVEGAÇÃO =====
function navTo(pagina) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  document.getElementById('page-' + pagina).classList.add('active');

  if (pagina === 'sessoes') carregarSelectsSessao();
  if (pagina === 'ingressos') carregarSelectsIngresso();
  if (pagina === 'listagem') renderListagem();
}

// ===== LOCALSTORAGE =====
function getData(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch (e) {
    return [];
  }
}

function setData(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Limite de armazenamento atingido!');
    }
  }
}

function gerarId() {
  return Date.now().toString();
}

// ===== MENSAGEM =====
function mostrarMsg(texto, erro) {
  var el = document.getElementById('msg');
  el.textContent = texto;
  el.className = 'msg' + (erro ? ' erro' : '');
  el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, 3000);
}

// ===== FILMES =====
function salvarFilme(event) {
  event.preventDefault();
  var filmes = getData('filmes');
  filmes.push({
    id: gerarId(),
    titulo: document.getElementById('filme-titulo').value.trim(),
    genero: document.getElementById('filme-genero').value,
    descricao: document.getElementById('filme-descricao').value.trim(),
    classificacao: document.getElementById('filme-classificacao').value,
    duracao: document.getElementById('filme-duracao').value,
    estreia: document.getElementById('filme-estreia').value
  });
  setData('filmes', filmes);
  event.target.reset();
  mostrarMsg('Filme salvo com sucesso!');
  renderFilmes();
}

function renderFilmes() {
  var filmes = getData('filmes');
  var tbody = document.getElementById('tbody-filmes');
  tbody.innerHTML = '';
  if (filmes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Nenhum filme cadastrado.</td></tr>';
    return;
  }
  filmes.forEach(function(f) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + f.titulo + '</td>' +
      '<td>' + f.genero + '</td>' +
      '<td>' + f.classificacao + '</td>' +
      '<td>' + f.duracao + ' min</td>' +
      '<td>' + formatarData(f.estreia) + '</td>' +
      '<td><button class="btn-excluir" onclick="excluir(\'filmes\',\'' + f.id + '\',renderFilmes)">Excluir</button></td>';
    tbody.appendChild(tr);
  });
}

// ===== SALAS =====
function salvarSala(event) {
  event.preventDefault();
  var salas = getData('salas');
  salas.push({
    id: gerarId(),
    nome: document.getElementById('sala-nome').value.trim(),
    capacidade: document.getElementById('sala-capacidade').value,
    tipo: document.getElementById('sala-tipo').value
  });
  setData('salas', salas);
  event.target.reset();
  mostrarMsg('Sala salva com sucesso!');
  renderSalas();
}

function renderSalas() {
  var salas = getData('salas');
  var tbody = document.getElementById('tbody-salas');
  tbody.innerHTML = '';
  if (salas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Nenhuma sala cadastrada.</td></tr>';
    return;
  }
  salas.forEach(function(s) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + s.nome + '</td>' +
      '<td>' + s.capacidade + ' lugares</td>' +
      '<td>' + s.tipo + '</td>' +
      '<td><button class="btn-excluir" onclick="excluir(\'salas\',\'' + s.id + '\',renderSalas)">Excluir</button></td>';
    tbody.appendChild(tr);
  });
}

// ===== SESSÕES =====
function carregarSelectsSessao() {
  var filmes = getData('filmes');
  var salas = getData('salas');

  var selFilme = document.getElementById('sessao-filme');
  var selSala = document.getElementById('sessao-sala');

  selFilme.innerHTML = '<option value="">Selecione um filme...</option>';
  filmes.forEach(function(f) {
    selFilme.innerHTML += '<option value="' + f.id + '">' + f.titulo + '</option>';
  });

  selSala.innerHTML = '<option value="">Selecione uma sala...</option>';
  salas.forEach(function(s) {
    selSala.innerHTML += '<option value="' + s.id + '">' + s.nome + ' (' + s.tipo + ')</option>';
  });

  renderSessoes();
}

function salvarSessao(event) {
  event.preventDefault();
  var filmeId = document.getElementById('sessao-filme').value;
  var salaId = document.getElementById('sessao-sala').value;
  var filmes = getData('filmes');
  var salas = getData('salas');
  var filme = filmes.find(function(f) { return f.id === filmeId; });
  var sala = salas.find(function(s) { return s.id === salaId; });

  var sessoes = getData('sessoes');
  sessoes.push({
    id: gerarId(),
    filmeId: filmeId,
    salaId: salaId,
    filmeNome: filme.titulo,
    salaNome: sala.nome,
    datahora: document.getElementById('sessao-datahora').value,
    preco: document.getElementById('sessao-preco').value,
    idioma: document.getElementById('sessao-idioma').value,
    formato: document.getElementById('sessao-formato').value
  });
  setData('sessoes', sessoes);
  event.target.reset();
  mostrarMsg('Sessão salva com sucesso!');
  renderSessoes();
}

function renderSessoes() {
  var sessoes = getData('sessoes');
  var tbody = document.getElementById('tbody-sessoes');
  tbody.innerHTML = '';
  if (sessoes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">Nenhuma sessão cadastrada.</td></tr>';
    return;
  }
  sessoes.forEach(function(s) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + s.filmeNome + '</td>' +
      '<td>' + s.salaNome + '</td>' +
      '<td>' + formatarDataHora(s.datahora) + '</td>' +
      '<td>R$ ' + parseFloat(s.preco).toFixed(2) + '</td>' +
      '<td>' + s.idioma + '</td>' +
      '<td>' + s.formato + '</td>' +
      '<td><button class="btn-excluir" onclick="excluir(\'sessoes\',\'' + s.id + '\',renderSessoes)">Excluir</button></td>';
    tbody.appendChild(tr);
  });
}

// ===== INGRESSOS =====
function carregarSelectsIngresso(selecionarId) {
  var sessoes = getData('sessoes');
  var sel = document.getElementById('ingresso-sessao');
  sel.innerHTML = '<option value="">Selecione uma sessão...</option>';
  sessoes.forEach(function(s) {
    var selected = s.id === selecionarId ? ' selected' : '';
    sel.innerHTML += '<option value="' + s.id + '"' + selected + '>' +
      s.filmeNome + ' - ' + s.salaNome + ' - ' + formatarDataHora(s.datahora) +
      '</option>';
  });
  renderIngressos();
}

function confirmarVenda(event) {
  event.preventDefault();
  var sessaoId = document.getElementById('ingresso-sessao').value;
  var assento = document.getElementById('ingresso-assento').value.trim().toUpperCase();

  var ingressos = getData('ingressos');
  var assentoOcupado = ingressos.find(function(i) {
    return i.sessaoId === sessaoId && i.assento === assento;
  });

  if (assentoOcupado) {
    mostrarMsg('Assento ' + assento + ' já está ocupado nessa sessão!', true);
    return;
  }

  var sessoes = getData('sessoes');
  var sessao = sessoes.find(function(s) { return s.id === sessaoId; });

  ingressos.push({
    id: gerarId(),
    sessaoId: sessaoId,
    filmeNome: sessao.filmeNome,
    salaNome: sessao.salaNome,
    datahora: sessao.datahora,
    nome: document.getElementById('ingresso-nome').value.trim(),
    cpf: document.getElementById('ingresso-cpf').value.trim(),
    assento: assento,
    pagamento: document.getElementById('ingresso-pagamento').value,
    preco: sessao.preco
  });
  setData('ingressos', ingressos);
  event.target.reset();
  mostrarMsg('Ingresso vendido com sucesso!');
  renderIngressos();
}

function renderIngressos() {
  var ingressos = getData('ingressos');
  var tbody = document.getElementById('tbody-ingressos');
  tbody.innerHTML = '';
  if (ingressos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">Nenhum ingresso vendido.</td></tr>';
    return;
  }
  ingressos.forEach(function(i) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + i.filmeNome + '</td>' +
      '<td>' + i.nome + '</td>' +
      '<td>' + i.cpf + '</td>' +
      '<td>' + i.assento + '</td>' +
      '<td>' + i.pagamento + '</td>' +
      '<td>R$ ' + parseFloat(i.preco).toFixed(2) + '</td>' +
      '<td><button class="btn-excluir" onclick="excluir(\'ingressos\',\'' + i.id + '\',renderIngressos)">Excluir</button></td>';
    tbody.appendChild(tr);
  });
}

// ===== LISTAGEM =====
function renderListagem() {
  var sessoes = getData('sessoes');
  var tbody = document.getElementById('tbody-listagem');
  tbody.innerHTML = '';
  if (sessoes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">Nenhuma sessão disponível.</td></tr>';
    return;
  }
  sessoes.forEach(function(s) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + s.filmeNome + '</td>' +
      '<td>' + s.salaNome + '</td>' +
      '<td>' + formatarDataHora(s.datahora) + '</td>' +
      '<td>' + s.idioma + '</td>' +
      '<td>' + s.formato + '</td>' +
      '<td>R$ ' + parseFloat(s.preco).toFixed(2) + '</td>' +
      '<td><button class="btn-comprar" onclick="comprarIngresso(\'' + s.id + '\')">Comprar Ingresso</button></td>';
    tbody.appendChild(tr);
  });
}

function comprarIngresso(sessaoId) {
  navTo('ingressos');
  carregarSelectsIngresso(sessaoId);
}

// ===== EXCLUIR =====
function excluir(chave, id, renderFn) {
  if (!confirm('Deseja excluir este item?')) return;
  var dados = getData(chave).filter(function(d) { return d.id !== id; });
  setData(chave, dados);
  renderFn();
}

// ===== UTILITÁRIOS =====
function formatarData(str) {
  if (!str) return '';
  var p = str.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function formatarDataHora(str) {
  if (!str) return '';
  return new Date(str).toLocaleString('pt-BR');
}

// ===== INICIALIZAÇÃO =====
window.onload = function() {
  renderFilmes();
  renderSalas();

  document.getElementById('ingresso-cpf').addEventListener('input', function() {
    var v = this.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.value = v;
  });
};
