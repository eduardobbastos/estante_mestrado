/**
 * main.js
 * Entry Point e Orquestrador da Aplicação
 */

import { Config } from './modules/Config.js';
import { DataService } from './modules/DataService.js';
import { UIComponents } from './modules/UIComponents.js';

class App {
    constructor() {
        this.config = new Config();
        this.ui = new UIComponents(document.getElementById('shelf-motor'));
    }

    async start() {
        try {
            // 1. Carrega Configurações
            await this.config.load();
            
            // 2. Inicializa Serviço de Dados
            const dataService = new DataService(this.config);
            
            // 3. Busca Dados do Google Sheets
            const data = await dataService.fetchAll();
            
            // 4. Renderiza UI
            this.ui.render(data);
            
            // 5. Ativa Ícones (Lucide)
            if (window.lucide) {
                window.lucide.createIcons();
            }
            
            console.log('Estante Virtual v3.1 Modularizada e Pronta! 🚀');
        } catch (error) {
            console.error('Falha ao iniciar app:', error);
            document.getElementById('shelf-motor').innerHTML = `
                <div class="error-container">
                    <p>Ocorreu um erro ao carregar a estante.</p>
                    <small>Verifique o arquivo <b>config.env</b> e a conexão com o Google Sheets.</small>
                </div>
            `;
        }
    }
}

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.start();
});
