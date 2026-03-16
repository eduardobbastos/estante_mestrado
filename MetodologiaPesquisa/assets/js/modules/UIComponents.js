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
        data.acervo.forEach(item => {
            const section = this.createAcervoSection(item, data.conteudo);
            this.container.appendChild(section);
        });
    }

    createAcervoSection(acervoItem, conteudo) {
        const section = document.createElement('section');
        section.className = 'discipline-section';
        const typeSlug = this.utils.slugify(acervoItem['Tipo de Literatura'] || 'acervo');

        section.innerHTML = `
            <div class="discipline-header">
                <h2>${acervoItem['Tipo de Literatura'] || 'Sem Tipo'}</h2>
                <div class="discipline-info">
                    <div class="prof-info" style="width: 100%">
                        <span class="info-item"><b>Objetivo:</b> ${acervoItem['Objetivo'] || ''}</span>
                    </div>
                </div>
            </div>
            <div class="cards-grid" id="lesson-grid-${typeSlug}"></div>
        `;

        const lessonGrid = section.querySelector(`#lesson-grid-${typeSlug}`);

        // Render Contents
        const items = conteudo.filter(c =>
            (c['Tipo de Literatura'] || '').toLowerCase().trim() === (acervoItem['Tipo de Literatura'] || '').toLowerCase().trim()
        );

        items.forEach(item => {
            const isRead = item['Lido']?.toLowerCase() === 'sim' || item['Lido']?.toLowerCase() === 'x';
            const icon = isRead ? 'check-square' : 'book-open';

            const card = this.createCard({
                type: 'lesson',
                tag: item['Categoria'] || 'Conteúdo',
                title: item['Título'] || 'Sem Título',
                discipline: acervoItem['Tipo de Literatura'],
                details: [
                    { label: 'Autor', value: item['Autor'] },
                    { label: 'Ano', value: item['Ano'] },
                    { label: 'Lido', value: item['Lido'] }
                ],
                link: item['Link'],
                audioLink: item['Link AudioBook'],
                icon: icon,
                showShare: true
            });
            lessonGrid.appendChild(card);
        });

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
            ? `<a href="${config.link}" target="_blank" class="card-icon" title="Acessar Conteúdo"><i data-lucide="external-link"></i></a>`
            : `<div class="card-icon"><i data-lucide="${config.icon}"></i></div>`;

        const calendarHtml = config.calendarEvent
            ? `<button class="card-icon calendar-icon" title="Adicionar ao Calendário"><i data-lucide="calendar-plus"></i></button>`
            : '';

        const shareHtml = config.showShare
            ? `<button class="card-icon share-icon" title="Compartilhar"><i data-lucide="share-2"></i></button>`
            : '';

        const audioHtml = config.audioLink
            ? `<a href="${config.audioLink}" target="_blank" class="card-icon audio-icon" title="Ouvir AudioBook"><i data-lucide="headphones"></i></a>`
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
        `;

        this._setupInteractions(card, config);
        return card;
    }

    _setupInteractions(card, config) {

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
