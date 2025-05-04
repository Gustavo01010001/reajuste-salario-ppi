const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  // Se nenhum parâmetro foi passado, mostra instruções com exemplos práticos
  if (!idade && !sexo && !salario_base && !anoContratacao && !matricula) {
    return res.send(`
      <h2>💼 Bem-vindo ao sistema de reajuste salarial!</h2>
      <p>Para calcular o reajuste, copie e cole um dos links abaixo diretamente na barra de endereços do navegador:</p>
      
      <h3>📊 Exemplos com base na tabela:</h3>
      <ul>
        <li>🧑‍💼 Homem de 25 anos (até 10 anos na empresa): reajuste 10%, desconto R$10,00</li>
        <code>http://localhost:3000/?idade=25&sexo=M&salario_base=2000&anoContratacao=2018&matricula=1234</code>

        <li>👩 Mulher de 30 anos (mais de 10 anos na empresa): reajuste 8%, acréscimo R$16,00</li>
        <code>http://localhost:3000/?idade=30&sexo=F&salario_base=3000&anoContratacao=2010&matricula=5678</code>

        <li>🧓 Homem de 60 anos (até 10 anos na empresa): reajuste 8%, desconto R$5,00</li>
        <code>http://localhost:3000/?idade=60&sexo=M&salario_base=2500&anoContratacao=2018&matricula=2468</code>

        <li>👵 Mulher de 75 anos (mais de 10 anos na empresa): reajuste 17%, acréscimo R$12,00</li>
        <code>http://localhost:3000/?idade=75&sexo=F&salario_base=4000&anoContratacao=2000&matricula=1357</code>
      </ul>

      <p>👉 Basta copiar e colar o link acima na barra de endereços ou clique em um exemplo para testar!</p>
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
    return res.send("⚠️ Dados inválidos! Verifique se todos os parâmetros estão corretos na URL.");
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

// Exporta o app para a Vercel
module.exports = app;

// Executa o servidor localmente se for chamado diretamente
if (require.main === module) {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}
