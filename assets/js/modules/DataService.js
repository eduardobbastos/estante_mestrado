/**
 * DataService.js
 * Comunicação com Google Sheets e Parse de Dados
 */

export class DataService {
    constructor(config) {
        this.config = config;
    }

    async fetchAll() {
        const [disciplinas, cronograma, avaliacoes] = await Promise.all([
            this._fetchCSV(this.config.tabs.disciplina),
            this._fetchCSV(this.config.tabs.cronograma),
            this._fetchCSV(this.config.tabs.avaliacao)
        ]);

        return {
            disciplinas,
            cronograma,
            avaliacoes
        };
    }

    async _fetchCSV(sheetName) {
        const url = `https://docs.google.com/spreadsheets/d/${this.config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar aba: ${sheetName}`);
        
        const text = await response.text();
        return this._parseCSV(text);
    }

    _parseCSV(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 1) return [];
        
        const headers = this._parseLine(lines[0]);
        
        return lines.slice(1).map(line => {
            const values = this._parseLine(line);
            const obj = {};
            headers.forEach((header, i) => {
                if (header) {
                    obj[header.trim()] = values[i] ? values[i].trim() : '';
                }
            });
            return obj;
        }).filter(item => Object.values(item).some(v => v !== ''));
    }

    _parseLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result.map(v => v.replace(/^"|"$/g, ''));
    }
}
