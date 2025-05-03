const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  // Se nenhum parâmetro foi passado, mostra instruções
  if (!idade && !sexo && !salario_base && !anoContratacao && !matricula) {
    return res.send(`
      <h2>Bem-vindo ao sistema de reajuste salarial!</h2>
      <p>Para calcular o reajuste, informe os dados na URL no seguinte formato:</p>
      <code>http://localhost:3000/?idade=35&sexo=M&salario_base=2000&anoContratacao=2010&matricula=1234</code>
    `);
  }

  // Validações básicas
  if (
    !idade || isNaN(idade) || idade < 17 ||
    !salario_base || isNaN(salario_base) ||
    !anoContratacao || isNaN(anoContratacao) || anoContratacao <= 1960 ||
    !matricula || isNaN(matricula) || matricula <= 0 ||
    !sexo || !["M", "F"].includes(sexo.toUpperCase())
  ) {
    return res.send("Dados inválidos! Verifique os parâmetros informados.");
  }

  const idadeInt = parseInt(idade);
  const salario = parseFloat(salario_base);
  const ano = parseInt(anoContratacao);
  const tempoEmpresa = new Date().getFullYear() - ano;

  const sexoUp = sexo.toUpperCase();
  let reajuste = 0;
  let adicional = 0;

  // Determina percentual e valores com base na tabela da imagem
  if (idadeInt >= 18 && idadeInt <= 39) {
    reajuste = sexoUp === "M" ? 0.10 : 0.08;
    adicional = tempoEmpresa > 10 ? (sexoUp === "M" ? 17 : 16) : (sexoUp === "M" ? -10 : -11);
  } else if (idadeInt >= 40 && idadeInt <= 69) {
    reajuste = sexoUp === "M" ? 0.08 : 0.10;
    adicional = tempoEmpresa > 10 ? (sexoUp === "M" ? 15 : 14) : (sexoUp === "M" ? -5 : -7);
  } else if (idadeInt >= 70 && idadeInt <= 99) {
    reajuste = sexoUp === "M" ? 0.15 : 0.17;
    adicional = tempoEmpresa > 10 ? (sexoUp === "M" ? 13 : 12) : (sexoUp === "M" ? -15 : -17);
  }

  const novoSalario = (salario + (salario * reajuste)) + adicional;

  res.send(`
    <h2>Reajuste Salarial</h2>
    <p><strong>Matrícula:</strong> ${matricula}</p>
    <p><strong>Idade:</strong> ${idade}</p>
    <p><strong>Sexo:</strong> ${sexo}</p>
    <p><strong>Salário base:</strong> R$${salario.toFixed(2)}</p>
    <p><strong>Ano de contratação:</strong> ${ano}</p>
    <p><strong>Tempo na empresa:</strong> ${tempoEmpresa} anos</p>
    <h3>➡️ Novo salário reajustado: <span style="color: green">R$${novoSalario.toFixed(2)}</span></h3>
  `);
});

app.listen(3000, () => {
  console.log("Servidor rodando em: http://localhost:3000");
});
