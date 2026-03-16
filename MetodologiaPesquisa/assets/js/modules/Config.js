/**
 * Config.js
 * Gerenciamento de Configurações e Ambiente
 */

export class Config {
    constructor() {
        this.sheetId = '';
        this.tabs = {
            disciplina: '',
            cronograma: '',
            avaliacao: ''
        };
    }

    async load() {
        try {
            // Em deploy no GitHub Pages, usamos config.env
            const response = await fetch('./config.env');
            if (!response.ok) throw new Error('Arquivo config.env não encontrado');
            
            const text = await response.text();
            const env = this._parseEnv(text);

            this.sheetId = env.SHEET_ID;
            this.tabs.disciplina = env.TAB_DISCIPLINA;
            this.tabs.cronograma = env.TAB_CRONOGRAMA;
            this.tabs.avaliacao = env.TAB_AVALIACAO;

            return this;
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            throw error;
        }
    }

    _parseEnv(text) {
        const lines = text.split('\n');
        const env = {};
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });
        return env;
    }
}
