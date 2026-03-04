const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

// Carrega os dados do nosso "banco de dados" JSON
const dataPath = path.join(__dirname, 'data', 'data.json');
const materiasData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Endpoint da API para listar as disciplinas disponíveis (retorna as chaves/IDs)
app.get('/api/disciplinas', (req, res) => {
    res.json(Object.keys(materiasData));
});

// Endpoint da API para buscar os dados de uma disciplina específica pelo seu ID
app.get('/api/disciplina/:id', (req, res) => {
    const disciplinaId = req.params.id;
    const materia = materiasData[disciplinaId];
    materia ? res.json(materia) : res.status(404).send('Matéria não encontrada');
});

app.listen(port, () => {
    console.log(`Backend rodando em http://localhost:${port}`);
});