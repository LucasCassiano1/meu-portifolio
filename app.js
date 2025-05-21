const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'senhaSegura123', resave: false, saveUninitialized: true }));

const dataPath = path.join(__dirname, 'data', 'portfolio.json');

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

// Rota principal (home)
app.get('/', (req, res) => {
  const idade = calcularIdade('2005-06-09');
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  res.render('index', {
    nome: 'Lucas Cassiano Pontes',
    email: 'lucasuqb@gmail.com',
    github: 'https://github.com/LucasCassiano1',
    linkedin: 'https://www.linkedin.com/in/lucas-cassiano-pontes-02b4a6301/',
    idade: idade,
    ...dados
  });
});

// Página de projetos
app.get('/projetos', (req, res) => {
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const projetos = dados.projetos || [];
  res.render('projetos', { projetos });
});


// ---------------------------- ADMIN ------------------------------

function autenticar(req, res, next) {
  if (req.session.logado) return next();
  return res.redirect('/admin/login');
}

app.get('/admin/login', (req, res) => {
  res.render('login');
});

app.post('/admin/login', (req, res) => {
  const { senha } = req.body;
  if (senha === '1234') {
    req.session.logado = true;
    res.redirect('/admin');
  } else {
    res.send('Senha incorreta');
  }
});

app.get('/admin', autenticar, (req, res) => {
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.render('admin', dados);
});

app.post('/admin/excluir-projeto/:index', autenticar, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  if (dados.projetos && dados.projetos[index]) {
    dados.projetos.splice(index, 1); // remove 1 item no índice indicado
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  }

  res.redirect('/admin');
});


// ---------- ROTAS DE ADIÇÃO (Admin) ----------

app.post('/admin/adicionar-curso', autenticar, (req, res) => {
  const { nome, ano } = req.body;
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.cursos = dados.cursos || [];
  dados.cursos.push({ nome, ano });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/adicionar-formacao', autenticar, (req, res) => {
  const { nome, inicio, fim } = req.body;
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.formacoes = dados.formacoes || [];
  dados.formacoes.push({ nome, inicio, fim });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/adicionar-experiencia', autenticar, (req, res) => {
  const { cargo, empresa, periodo, atividades } = req.body;
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const listaAtividades = atividades
    .split('\n')
    .map(a => a.trim())
    .filter(a => a.length > 0);

  dados.experiencias = dados.experiencias || [];
  dados.experiencias.push({ cargo, empresa, periodo, atividades: listaAtividades });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/adicionar-tecnologia', autenticar, (req, res) => {
  const { tipo, conteudo } = req.body;
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.tecnologias = dados.tecnologias || [];
  dados.tecnologias.push({ tipo, conteudo });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/adicionar-idioma', autenticar, (req, res) => {
  const { idioma, nivel } = req.body;
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.idiomas = dados.idiomas || [];
  dados.idiomas.push({ idioma, nivel });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/adicionar-certificacao', autenticar, (req, res) => {
  const { titulo, emissor, ano } = req.body;
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.certificacoes = dados.certificacoes || [];
  dados.certificacoes.push({ titulo, emissor, ano });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/adicionar-projeto', autenticar, (req, res) => {
  const { nome, descricao, tecnologias, github } = req.body;
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const listaTecnologias = tecnologias
    .split(',')
    .map(t => t.trim())
    .filter(t => t !== '');

  dados.projetos = dados.projetos || [];
  dados.projetos.push({ nome, descricao, tecnologias: listaTecnologias, github });

  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/excluir-certificacao/:index', autenticar, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.certificacoes.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/excluir-tecnologia/:index', autenticar, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.tecnologias.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/excluir-experiencia/:index', autenticar, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.experiencias.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/excluir-curso/:index', autenticar, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.cursos.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/excluir-formacao/:index', autenticar, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.formacoes.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/excluir-idioma/:index', autenticar, (req, res) => {
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  dados.idiomas.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect('/admin');
});

app.post('/admin/editar-formacao/:index', autenticar, (req, res) => {
  const { nome, inicio, fim } = req.body;
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (dados.formacoes[index]) {
    dados.formacoes[index] = { nome, inicio, fim };
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  }
  res.redirect('/admin');
});

app.post('/admin/editar-experiencia/:index', autenticar, (req, res) => {
  const { cargo, empresa, periodo, atividades } = req.body;
  const listaAtividades = atividades.split('\n').map(a => a.trim()).filter(Boolean);
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (dados.experiencias[index]) {
    dados.experiencias[index] = { cargo, empresa, periodo, atividades: listaAtividades };
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  }
  res.redirect('/admin');
});

app.post('/admin/editar-tecnologia/:index', autenticar, (req, res) => {
  const { tipo, conteudo } = req.body;
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (dados.tecnologias[index]) {
    dados.tecnologias[index] = { tipo, conteudo };
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  }
  res.redirect('/admin');
});

app.post('/admin/editar-idioma/:index', autenticar, (req, res) => {
  const { idioma, nivel } = req.body;
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (dados.idiomas[index]) {
    dados.idiomas[index] = { idioma, nivel };
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  }
  res.redirect('/admin');
});

app.post('/admin/editar-certificacao/:index', autenticar, (req, res) => {
  const { titulo, emissor, ano } = req.body;
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (dados.certificacoes[index]) {
    dados.certificacoes[index] = { titulo, emissor, ano };
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  }
  res.redirect('/admin');
});

app.post('/admin/editar-projeto/:index', autenticar, (req, res) => {
  const { nome, descricao, tecnologias, github } = req.body;
  const listaTecnologias = tecnologias.split(',').map(t => t.trim()).filter(Boolean);
  const index = parseInt(req.params.index, 10);
  const dados = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (dados.projetos[index]) {
    dados.projetos[index] = { nome, descricao, tecnologias: listaTecnologias, github };
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  }
  res.redirect('/admin');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
