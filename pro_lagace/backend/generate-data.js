const fs = require('fs');
const path = require('path');

console.log('Iniciando a geração de dados estáticos...');

const sourceDataPath = path.join(__dirname, 'data', 'data.json');
const destinationDir = path.join(__dirname, '..', 'frontend', 'data');
const destinationDataPath = path.join(destinationDir, 'disciplina.json');

// Garante que o diretório de destino exista
if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
}

// Lê o arquivo de dados original
const data = fs.readFileSync(sourceDataPath, 'utf-8');
const parsedData = JSON.parse(data);

// Escreve o JSON completo para o novo arquivo no frontend
fs.writeFileSync(destinationDataPath, JSON.stringify(parsedData, null, 2));

console.log(`Dados estáticos gerados com sucesso em: ${destinationDataPath}`);