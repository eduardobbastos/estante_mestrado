document.addEventListener('DOMContentLoaded', () => {
    // Agora carregamos os dados do arquivo estático local
    carregarDisciplina();
});

async function carregarDisciplina() {
    // O caminho para o nosso novo arquivo de dados estático
    const dataUrl = './data/disciplina.json';
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderPagina(data);
    } catch (error) {
        console.error('Erro ao buscar dados da disciplina:', error);
        const container = document.getElementById('cronograma-container');
        if (container) {
            container.innerHTML = '<p class="text-danger text-center">Não foi possível carregar o conteúdo da disciplina.</p>';
        }
    }
}

function renderPagina(data) {
    if (!data) return;
    // Como o arquivo agora contém a estrutura completa, acessamos a disciplina por sua chave
    const disciplinaId = "pensamento-social-brasileiro";
    const disciplinaData = data[disciplinaId];
    renderCursoInfo(disciplinaData.cursoInfo);
    renderCronograma(disciplinaData.cronograma);
    renderAvaliacao(disciplinaData.avaliacao);
}

function renderCursoInfo(info) {
    document.getElementById('programa-titulo').textContent = info.programa;
    const infoContainer = document.getElementById('curso-info-container');
    
    infoContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>${info.disciplina}</h3>
            </div>
            <div class="card-body">
                <p><strong>Instituição:</strong> ${info.instituicao}</p>
                <p><strong>Professoras:</strong> ${info.professoras.join(' | ')}</p>
                <p><strong>Contato:</strong> ${info.contato.join(' | ')}</p>
                <p><strong>Horário:</strong> ${info.horario.dia} - ${info.horario.hora}</p>
            </div>
        </div>
    `;
}

function renderCronograma(cronograma) {
    const cronogramaContainer = document.getElementById('cronograma-container');
    cronogramaContainer.innerHTML = '';

    // Cria uma prateleira para cada mês
    cronograma.forEach(itemMes => {
        const prateleiraDiv = document.createElement('div');
        prateleiraDiv.className = 'prateleira';

        const tituloPrateleira = document.createElement('h3');
        tituloPrateleira.className = 'prateleira-titulo';
        tituloPrateleira.textContent = itemMes.mes;
        prateleiraDiv.appendChild(tituloPrateleira);

        const aulasContainer = document.createElement('div');
        aulasContainer.className = 'aulas-container';

        itemMes.aulas.forEach(aula => {
            const aulaCard = document.createElement('div');
            aulaCard.className = 'aula-card';
            
            let conteudoHtml = '';
            // Verifica se o conteúdo é um array de objetos ou uma string simples
            if (Array.isArray(aula.conteudo)) {
                conteudoHtml = '<ul class="list-unstyled mb-0">';
                aula.conteudo.forEach(material => conteudoHtml += renderMaterialItem(material));
                conteudoHtml += '</ul>';
            } else {
                // Se for apenas uma string
                conteudoHtml = `<p class="text-secondary text-center m-0">${aula.conteudo}</p>`;
            }

            const mainIcon = getIllustrativeIcon(aula);

            aulaCard.innerHTML = `
                <div class="card-header">
                    <i class="bi ${mainIcon} me-2"></i>
                    ${aula.data}
                </div>
                <div class="card-body">
                    ${conteudoHtml}
                </div>
            `;
            aulasContainer.appendChild(aulaCard);
        });

        prateleiraDiv.appendChild(aulasContainer);
        cronogramaContainer.appendChild(prateleiraDiv);
    });

    // Aplica o novo efeito 3D após a renderização
    apply3DTiltEffect();
}

/**
 * Determina um ícone ilustrativo com base no conteúdo da aula.
 * @param {object} aula - O objeto da aula.
 * @returns {string} A classe do ícone Bootstrap.
 */
function getMaterialInfo(material) {
    const info = { icon: 'bi-link-45deg', type: 'link' };
    const title = (material.titulo || material.tipo || '').toLowerCase();

    if (title.includes('video') || title.includes('filme')) {
        info.icon = 'bi-film';
        info.type = 'video';
    } else if (title.includes('texto') || material.link?.includes('.pdf') || title.includes('artigo')) {
        info.icon = 'bi-file-earmark-text';
        info.type = 'text';
    }
    return info;
}

/**
 * Determina um ícone ilustrativo com base no conteúdo da aula.
 * @param {object} aula - O objeto da aula.
 * @returns {string} A classe do ícone Bootstrap.
 */
function getIllustrativeIcon(aula) {
    if (aula.seminario) {
        return 'bi-easel2-fill';
    }
    if (typeof aula.conteudo === 'string') {
        const lowerContent = aula.conteudo.toLowerCase();
        if (lowerContent.includes('congresso') || lowerContent.includes('acolhimento')) {
            return 'bi-calendar2-event-fill';
        }
        if (lowerContent.includes('encerramento') || lowerContent.includes('apresentação')) {
            return 'bi-award-fill';
        }
        return 'bi-info-circle-fill';
    }
    if (Array.isArray(aula.conteudo)) {
        // Use the helper function to check for video content
        if (aula.conteudo.some(m => getMaterialInfo(m).type === 'video')) {
            return 'bi-film';
        }
    }
    return 'bi-book-half'; // Ícone padrão para aulas com leituras
}

/**
 * Renderiza um único item de material (texto, vídeo, link) como um item de lista HTML.
 * @param {object} material - O objeto do material a ser renderizado.
 * @returns {string} O HTML do item da lista.
 */
function renderMaterialItem(material) {
    let html = '<li class="conteudo-item py-1">';
    const titulo = material.titulo || material.tipo || 'Material';
    // Get icon from the centralized helper function
    const { icon } = getMaterialInfo(material);

    if (material.link) {
        // Usando o ícone dinâmico
        html += `<a href="${material.link}" target="_blank" rel="noopener noreferrer" class="d-flex align-items-center"><i class="bi ${icon} me-2"></i>${titulo}</a>`;
    } else {
        html += `<span class="d-flex align-items-center"><i class="bi ${icon} me-2"></i><strong>${titulo}</strong></span>`;
    }

    if (material.observacao) {
        html += `<br><small class="text-secondary">${material.observacao}</small>`;
    }
    html += '</li>';
    return html;
}

/**
 * Renderiza a seção de avaliação no rodapé da página.
 * @param {object} avaliacao - O objeto de avaliação do JSON.
 */
function renderAvaliacao(avaliacao) {
    const footerContainer = document.getElementById('footer-container');
    if (!avaliacao || !footerContainer) return;

    footerContainer.innerHTML = `
        <h3 class="mb-3">Critérios de Avaliação</h3>
        <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">Participação e Engajamento <span class="badge badge-custom rounded-pill">${avaliacao.participacao}</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center">Apresentação de Seminário <span class="badge badge-custom rounded-pill">${avaliacao.seminario}</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center">Artigo Final <span class="badge badge-custom rounded-pill">${avaliacao.artigo}</span></li>
        </ul>
    `;
}

// --- Lógica para o botão "Voltar ao Topo" ---
const backToTopButton = document.getElementById('back-to-top-btn');

if (backToTopButton) {
    window.onscroll = function() {
        // Mostra o botão após rolar 200px para baixo
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Aplica um efeito de inclinação 3D moderno a todos os .aula-card.
 */
function apply3DTiltEffect() {
    const cards = document.querySelectorAll('.aula-card');

    cards.forEach(card => {
        const height = card.clientHeight;
        const width = card.clientWidth;

        card.addEventListener('mousemove', (e) => {
            // Usa pageX/pageY e getBoundingClientRect para uma posição mais precisa
            const rect = card.getBoundingClientRect();
            const x = e.pageX - rect.left - window.scrollX;
            const y = e.pageY - rect.top - window.scrollY;

            const yRotation = ((x - width / 2) / width) * 15; // Rotação máxima de 15 graus
            const xRotation = ((y - height / 2) / height) * -15;

            card.style.transform = `perspective(1000px) scale(1.05) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
        });
    });
}
