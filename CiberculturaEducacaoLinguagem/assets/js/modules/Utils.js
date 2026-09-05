/**
 * Utils.js
 * Utilitários, Helpers e APIs Externas (Share/Calendar)
 */

export class Utils {
    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    async share(config) {
        const detailsText = config.details
            .filter(d => d.value)
            .map(d => `${d.label}: ${d.value}`)
            .join('\n');

        const shareText = `📌 *${config.discipline}*\n\n🔹 *${config.tag}*\n📝 ${config.title}\n\n${detailsText ? `ℹ️ *Detalhes:*\n${detailsText}\n` : ''}${config.audioLink ? `🎧 *AudioBook:* ${config.audioLink}\n` : ''}\n🔗 Conteúdo: ${config.link || window.location.href}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: config.title,
                    text: shareText,
                    url: config.link || window.location.href
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                alert('Copiado para a área de transferência!');
            }
        } catch (err) {
            console.error('Erro ao compartilhar:', err);
        }
    }

    generateICalendar(eventConfig) {
        const { title, description, date } = eventConfig;
        const [day, month, year] = date.split('/');
        const eventDate = new Date(`${year}-${month}-${day}T12:00:00`);
        
        const pad = (num) => String(num).padStart(2, '0');
        const formatDT = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
        
        const now = new Date();
        const uid = `${formatDT(now)}-${Math.random().toString(36).substring(2, 11)}`;

        const ical = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Estante Virtual//NONSGML v1.0//EN',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${formatDT(now)}`,
            `DTSTART:${formatDT(eventDate)}`,
            `DTEND:${formatDT(eventDate)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([ical], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.slugify(title)}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
