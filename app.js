// app.js
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
}

app.get('/', (req, res) => {
  const idade = calcularIdade('2005-06-09');

  res.render('index', {
    nome: 'Lucas Cassiano Pontes',
    email: 'lucasuqb@gmail.com',
    github: 'https://github.com/LucasCassiano1',
    linkedin: 'https://www.linkedin.com/in/lucas-cassiano-pontes-02b4a6301/',
    idade: idade
  });
});


app.get('/projetos', (req, res) => {
  const projetos = [
    {
      nome: "Sistema de Gerenciamento de Alunos",
      descricao: "Este projeto é um sistema de gerenciamento de alunos e histórico de peso desenvolvido em Java com Swing. Permite cadastrar, consultar, atualizar e excluir alunos, além de calcular e registrar o IMC. Os dados são persistidos em arquivos de texto, organizados por diretórios.",
      tecnologias: ["Java", "Swing"],
      github: "https://github.com/LucasCassiano1/Projeto-CRUD-Aluno"
    },
    {
      nome: "IA para consultas em banco de dados",
      descricao: "Este projeto consiste em uma IA desenvolvida em Python integrada ao Telegram. Através de um bot, o usuário podia enviar perguntas utilizando linguagem natural, e a IA realizava buscas em sites específicos da internet para responder diretamente no chat. A proposta visava facilitar o acesso a informações de forma rápida, simulando uma conversa inteligente via Telegram."
    },
    {
      nome: "Plataforma para feedback organizacional",
      descricao: "Este sistema foi desenvolvido em grupo durante o projeto API (Aprendizado de Processos Integrados) pela equipe Byte-Benders, para a empresa Youtan. A aplicação, construída com React e TypeScript no frontend e Node.js/TypeORM no backend, tem como objetivo facilitar a coleta e análise de feedbacks entre líderes e liderados por meio de pesquisas internas. A plataforma conta com dashboards interativos, filtros inteligentes, diferentes níveis de acesso (admin, líder e liderado) e uma interface amigável que permite a visualização de resultados em tempo real. A ferramenta visa promover o bem-estar e a cultura organizacional da empresa.",
      tecnologias: ["typescript", "react", "mysql", "html-css"],
      github: "https://github.com/Byte-Benders-Fatec/sistema-youtan-front",
      github: "https://github.com/Byte-Benders-Fatec/sistema-youtan-front"
    },
    {
      nome:"Beauty Manager - Sistema de Gestão para Loja de Beleza",
      descricao: "Desenvolvido como parte da disciplina de Programação Orientada a Objetos, o Beauty Manager é um sistema web construído com React e TypeScript, com foco na gestão de clientes e produtos de uma loja do segmento de beleza. aplicação permite o cadastro e listagem de clientes e produtos, além de oferecer funcionalidades analíticas, como:Visualização dos clientes que mais consumiram produtos/serviços;Listagens filtradas por gênero (tanto de clientes quanto de produtos);Identificação dos produtos mais consumidos Interface intuitiva e responsiva, ideal para uso em ambientes comerciais.O sistema foi idealizado para proporcionar uma gestão eficiente e organizada, atendendo às demandas do setor de beleza e bem-estar.",
      tecnologias: ["typescript", "react","html-css"],
      github: "https://github.com/Byte-Benders-Fatec/sistema-youtan-front",
    }
  ];

  res.render('projetos', { projetos });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
    