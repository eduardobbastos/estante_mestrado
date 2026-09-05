/**
 * UIComponents.js
 * Fábrica de Elementos de Interface
 */

import { Utils } from './Utils.js';

export class UIComponents {
    constructor(container) {
        this.container = container;
        this.utils = new Utils();
    }

    render(data) {
        this.container.innerHTML = '';
        data.disciplinas.forEach(disc => {
            const section = this.createDisciplineSection(disc, data.cronograma, data.avaliacoes);
            this.container.appendChild(section);
        });
    }

    createDisciplineSection(disc, cronograma, avaliacoes) {
        const section = document.createElement('section');
        section.className = 'discipline-section';
        const discSlug = this.utils.slugify(disc.Disciplina);
        
        section.innerHTML = `
            <div class="discipline-header">
                <h2>${disc.Disciplina}</h2>
                <div class="discipline-info">
                    <div class="prof-info">
                        <span class="info-item"><b>Profª:</b> ${disc['Professora 1']}</span>
                        <span class="info-item"><a href="mailto:${disc['Contato Professora 1']}">${disc['Contato Professora 1']}</a></span>
                    </div>
                    ${disc['Professora 2'] ? `
                    <div class="prof-info">
                        <span class="info-item"><b>Profª:</b> ${disc['Professora 2']}</span>
                        <span class="info-item"><a href="mailto:${disc['Contato Professora 2']}">${disc['Contato Professora 2']}</a></span>
                    </div>
                    ` : ''}
                    <div class="prof-info">
                        <span class="info-item"><b>Horário:</b> ${disc['Horário']}</span>
                        <span class="info-item"><b>Dia:</b> ${disc['Dia da Semana']}</span>
                    </div>
                </div>
            </div>
            <div class="cards-grid" id="lesson-grid-${discSlug}"></div>
            <div class="evaluation-footer" id="eval-footer-${discSlug}">
                <div class="evaluation-footer-header">
                    <i data-lucide="award"></i>
                    <h3>Avaliações</h3>
                    <div class="divider"></div>
                </div>
                <div class="cards-grid"></div>
            </div>
        `;

        const lessonGrid = section.querySelector(`#lesson-grid-${discSlug}`);
        const evalGrid = section.querySelector(`#eval-footer-${discSlug} .cards-grid`);

        // Render Lessons — agrupa por data para juntar aulas multi-linha
        const lessonsByDate = new Map();
        cronograma
            .filter(c => c.Disciplina.toLowerCase().trim() === disc.Disciplina.toLowerCase().trim())
            .forEach(item => {
                const date = item['Data aula'] || 'Sem data';
                if (!lessonsByDate.has(date)) {
                    lessonsByDate.set(date, []);
                }
                lessonsByDate.get(date).push(item);
            });

        lessonsByDate.forEach(group => {
            const first = group[0];
            const date = first['Data aula'];
            const title = group.map(item => item['Descrição Conteúdo']).filter(Boolean).join('<br><br>');
            const obs = group.map(item => item['Obsevação']).filter(Boolean).join(' / ');
            const links = group.map(item => item['Link do Conteúdo']).filter(l => l && l.startsWith('http'));
            const audioLinks = group.map(item => item['Link do AudioBook']).filter(l => l && l.startsWith('http'));

            const card = this.createCard({
                type: 'lesson',
                tag: `Aula • ${date}`,
                title,
                discipline: disc.Disciplina,
                details: obs ? [{ label: 'Obs', value: obs }] : [],
                link: links.length > 0 ? links[0] : '',
                allLinks: links,
                audioLink: audioLinks.length > 0 ? audioLinks[0] : '',
                allAudioLinks: audioLinks,
                icon: 'book-open',
                showShare: true,
                calendarEvent: date ? {
                    title: `Aula: ${first['Descrição Conteúdo']}`,
                    description: `Disciplina: ${disc.Disciplina}\nObservação: ${obs}`,
                    date
                } : null
            });
            lessonGrid.appendChild(card);
        });

        // Render Evaluations
        const evals = avaliacoes.filter(a => 
            a.Disciplina.toLowerCase().trim() === disc.Disciplina.toLowerCase().trim()
        );
        if (evals.length === 0) {
            section.querySelector('.evaluation-footer').style.display = 'none';
        } else {
            evals.forEach(item => {
                const card = this.createCard({
                    type: 'evaluation',
                    tag: 'Critério de Avaliação',
                    title: item['Descrição dos Critérios'],
                    discipline: disc.Disciplina,
                    details: [
                        { label: 'Peso', value: item['Peso'] },
                        { label: 'Prazo', value: item['Data limite de entrega'] },
                        { label: 'Obs', value: item['Observação'] }
                    ],
                    icon: 'file-text',
                    showShare: false,
                    calendarEvent: item['Data limite de entrega'] ? {
                        title: `Avaliação: ${item['Descrição dos Critérios']}`,
                        description: `Disciplina: ${disc.Disciplina}\nPeso: ${item['Peso']}\nObservação: ${item['Observação']}`,
                        date: item['Data limite de entrega']
                    } : null
                });
                evalGrid.appendChild(card);
            });
        }

        return section;
    }

    createCard(config) {
        const card = document.createElement('div');
        card.className = `card ${config.type}-card`;
        
        const detailsHtml = config.details
            .filter(d => d.value)
            .map(d => `
                <div class="detail-row ${d.label === 'Obs' ? 'obs-row' : ''}">
                    <span>${d.label}</span>
                    <b>${d.value}</b>
                </div>
            `).join('');

        const actionHtml = (config.link && config.link.startsWith('http')) 
            ? `<div class="card-actions-links">${(config.allLinks || [config.link]).map((l, i) => `<a href="${l}" target="_blank" class="card-icon" title="Acessar Conteúdo ${i + 1}"><i data-lucide="external-link"></i></a>`).join('')}</div>`
            : `<div class="card-icon"><i data-lucide="${config.icon}"></i></div>`;

        const calendarHtml = config.calendarEvent 
            ? `<button class="card-icon calendar-icon" title="Adicionar ao Calendário"><i data-lucide="calendar-plus"></i></button>`
            : '';

        const shareHtml = config.showShare 
            ? `<button class="card-icon share-icon" title="Compartilhar"><i data-lucide="share-2"></i></button>`
            : '';

        const audioHtml = config.audioLink
            ? `<div class="card-actions-links">${(config.allAudioLinks || [config.audioLink]).map((l, i) => `<a href="${l}" target="_blank" class="card-icon audio-icon" title="Ouvir AudioBook ${i + 1}"><i data-lucide="headphones"></i></a>`).join('')}</div>`
            : '';

        card.innerHTML = `
            <div class="card-header">
                <span class="card-tag">${config.tag}</span>
                <div class="card-actions">
                    ${calendarHtml}
                    ${audioHtml}
                    ${shareHtml}
                    ${actionHtml}
                </div>
            </div>
            <div class="card-title">${config.title}</div>
            <div class="card-details">
                ${detailsHtml}
            </div>
            <button class="read-more-btn" style="display: none;">Ver mais</button>
        `;

        this._setupInteractions(card, config);
        return card;
    }

    _setupInteractions(card, config) {
        const detailsContainer = card.querySelector('.card-details');
        const readMoreBtn = card.querySelector('.read-more-btn');
        const textContent = detailsContainer.textContent || detailsContainer.innerText;

        if (textContent.length > 255) {
            detailsContainer.classList.add('truncated');
            readMoreBtn.style.display = 'block';
            readMoreBtn.addEventListener('click', () => {
                const isTruncated = detailsContainer.classList.toggle('truncated');
                readMoreBtn.textContent = isTruncated ? 'Ver mais' : 'Ver menos';
            });
        }

        if (config.calendarEvent) {
            card.querySelector('.calendar-icon').addEventListener('click', () => {
                this.utils.generateICalendar(config.calendarEvent);
            });
        }

        if (config.showShare) {
            card.querySelector('.share-icon').addEventListener('click', () => {
                this.utils.share(config);
            });
        }
    }
}
