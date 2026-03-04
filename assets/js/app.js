/**
 * Estante Virtual - Motor de Conteúdo Dinâmico
 * Versão: 3.1.0 
 */

class EstanteMotor {
    constructor() {
        this.container = document.getElementById('shelf-motor');
        this.config = {
            sheetId: '',
            tabs: {
                disciplina: '',
                cronograma: '',
                avaliacao: ''
            }
        };
        this.data = {
            disciplinas: [],
            cronograma: [],
            avaliacoes: []
        };
    }

    async init() {
        try {
            await this.loadEnv();
            await this.loadAllData();
            this.render();
            if (window.lucide) {
                window.lucide.createIcons();
            }
        } catch (error) {
            console.error('Falha ao inicializar motor:', error);
            this.container.innerHTML = `<p class="error">Erro ao carregar dados. Verifique a conexão e o arquivo config.env.</p>`;
        }
    }

    async loadEnv() {
        // Busca o arquivo config.env na raiz do projeto
        // GitHub Pages não serve arquivos que começam com ponto (ex: .env)
        const response = await fetch('./config.env');
        const text = await response.text();

        const lines = text.split('\n');
        const env = {};
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });

        this.config.sheetId = env.SHEET_ID;
        this.config.tabs.disciplina = env.TAB_DISCIPLINA;
        this.config.tabs.cronograma = env.TAB_CRONOGRAMA;
        this.config.tabs.avaliacao = env.TAB_AVALIACAO;
    }

    async loadAllData() {
        const [disciplinas, cronograma, avaliacoes] = await Promise.all([
            this.fetchCSV(this.config.tabs.disciplina),
            this.fetchCSV(this.config.tabs.cronograma),
            this.fetchCSV(this.config.tabs.avaliacao)
        ]);

        this.data.disciplinas = disciplinas;
        this.data.cronograma = cronograma;
        this.data.avaliacoes = avaliacoes;
    }

    async fetchCSV(sheetName) {
        const url = `https://docs.google.com/spreadsheets/d/${this.config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
        const response = await fetch(url);
        const text = await response.text();
        return this.parseCSV(text);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 1) return [];

        const headers = this.parseLine(lines[0]);

        return lines.slice(1).map(line => {
            const values = this.parseLine(line);
            const obj = {};
            headers.forEach((header, i) => {
                if (header) obj[header.trim()] = values[i] ? values[i].trim() : '';
            });
            return obj;
        }).filter(item => Object.values(item).some(v => v !== ''));
    }

    parseLine(line) {
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

    render() {
        this.container.innerHTML = '';

        this.data.disciplinas.forEach(disc => {
            const discSection = this.createDisciplineSection(disc);
            this.container.appendChild(discSection);
        });
    }

    createDisciplineSection(disc) {
        const section = document.createElement('section');
        section.className = 'discipline-section';

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
            <div class="cards-grid" id="lesson-grid-${this.slugify(disc.Disciplina)}"></div>
            <div class="evaluation-footer" id="eval-footer-${this.slugify(disc.Disciplina)}">
                <div class="evaluation-footer-header">
                    <i data-lucide="award"></i>
                    <h3>Avaliações</h3>
                    <div class="divider"></div>
                </div>
                <div class="cards-grid"></div>
            </div>
        `;

        const lessonGrid = section.querySelector(`#lesson-grid-${this.slugify(disc.Disciplina)}`);
        const evalGrid = section.querySelector(`#eval-footer-${this.slugify(disc.Disciplina)} .cards-grid`);

        const lessons = this.data.cronograma.filter(c =>
            c.Disciplina.toLowerCase().trim() === disc.Disciplina.toLowerCase().trim()
        );

        lessons.forEach(item => {
            const lessonCardConfig = {
                type: 'lesson',
                tag: `Aula • ${item['Data aula']}`,
                title: item['Descrição Conteúdo'],
                discipline: disc.Disciplina,
                details: [
                    { label: 'Obs', value: item['Obsevação'] }
                ],
                link: item['Link do Conteúdo'],
                icon: 'book-open',
                showShare: true
            };

            if (item['Data aula']) {
                lessonCardConfig.calendarEvent = {
                    title: `Aula: ${item['Descrição Conteúdo']}`,
                    description: `Disciplina: ${disc.Disciplina}\nObservação: ${item['Obsevação']}`,
                    date: item['Data aula']
                };
            }
            lessonGrid.appendChild(this.createCard(lessonCardConfig));
        });

        const evals = this.data.avaliacoes.filter(a =>
            a.Disciplina.toLowerCase().trim() === disc.Disciplina.toLowerCase().trim()
        );

        if (evals.length === 0) {
            section.querySelector('.evaluation-footer').style.display = 'none';
        } else {
            evals.forEach(item => {
                const evalCardConfig = {
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
                    showShare: false
                };

                if (item['Data limite de entrega']) {
                    evalCardConfig.calendarEvent = {
                        title: `Avaliação: ${item['Descrição dos Critérios']}`,
                        description: `Disciplina: ${disc.Disciplina}\nPeso: ${item['Peso']}\nObservação: ${item['Observação']}`,
                        date: item['Data limite de entrega']
                    };
                }
                evalGrid.appendChild(this.createCard(evalCardConfig));
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
                <div class="detail-row">
                    <span>${d.label}</span>
                    <b>${d.value}</b>
                </div>
            `).join('');

        let actionHtml = '';
        if (config.link && config.link.startsWith('http')) {
            actionHtml = `
                <a href="${config.link}" target="_blank" class="card-icon" title="Acessar Conteúdo">
                    <i data-lucide="external-link"></i>
                </a>
            `;
        } else {
            actionHtml = `
                <div class="card-icon">
                    <i data-lucide="${config.icon}"></i>
                </div>
            `;
        }

        let calendarHtml = '';
        if (config.calendarEvent && config.calendarEvent.date) {
            calendarHtml = `
                <button class="card-icon calendar-icon" title="Adicionar ao Calendário">
                    <i data-lucide="calendar-plus"></i>
                </button>
            `;
        }

        let shareHtml = '';
        if (config.showShare) {
            shareHtml = `
                <button class="card-icon share-icon" title="Compartilhar">
                    <i data-lucide="share-2"></i>
                </button>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <span class="card-tag">${config.tag}</span>
                <div class="card-actions">
                    ${calendarHtml}
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

        const detailsContainer = card.querySelector('.card-details');
        const readMoreBtn = card.querySelector('.read-more-btn');

        const detailsTextContent = detailsContainer.textContent || detailsContainer.innerText;
        const TRUNCATION_THRESHOLD = 255;

        if (detailsTextContent.length > TRUNCATION_THRESHOLD) {
            detailsContainer.classList.add('truncated');
            readMoreBtn.style.display = 'block';
            readMoreBtn.addEventListener('click', () => {
                const isTruncated = detailsContainer.classList.toggle('truncated');
                readMoreBtn.textContent = isTruncated ? 'Ver mais' : 'Ver menos';
            });
        }

        if (config.calendarEvent && config.calendarEvent.date) {
            const calendarButton = card.querySelector('.calendar-icon');
            calendarButton.addEventListener('click', () => {
                this.generateICalendarEvent(config.calendarEvent);
            });
        }

        if (config.showShare) {
            const shareButton = card.querySelector('.share-icon');
            shareButton.addEventListener('click', () => {
                this.handleShare(config);
            });
        }

        return card;
    }

    async handleShare(config) {
        let detailsText = config.details
            .filter(d => d.value)
            .map(d => `${d.label}: ${d.value}`)
            .join('\n');

        const shareText = `📌 *${config.discipline}*\n\n🔹 *${config.tag}*\n📝 ${config.title}\n\n${detailsText ? `ℹ️ *Detalhes:*\n${detailsText}\n` : ''}\n🔗 Link: ${config.link || window.location.href}`;

        const shareData = {
            title: config.title,
            text: shareText,
            url: config.link || window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareText);
                alert('Informações do card copiadas para a área de transferência!');
            }
        } catch (err) {
            console.error('Erro ao compartilhar:', err);
        }
    }

    generateICalendarEvent(eventConfig) {
        const { title, description, date } = eventConfig;
        const [day, month, year] = date.split('/');
        const eventDate = new Date(`${year}-${month}-${day}T12:00:00`);
        const pad = (num) => String(num).padStart(2, '0');
        const formatDateTime = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
        const now = new Date();
        const uid = `${formatDateTime(now)}-${Math.random().toString(36).substring(2, 15)}`;

        const icalContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Estante Virtual//NONSGML v1.0//EN',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${formatDateTime(now)}`,
            `DTSTART:${formatDateTime(eventDate)}`,
            `DTEND:${formatDateTime(eventDate)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.slugify(title)}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const motor = new EstanteMotor();
    motor.init();
});
