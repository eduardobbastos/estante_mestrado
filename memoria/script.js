document.addEventListener("DOMContentLoaded", function() {
    
    // Deixar as seções 'Informações Gerais' e 'Cronograma' abertas por padrão
    // Você pode alterar isso ou remover se quiser que tudo comece fechado.
    const openSections = ['.info-basica', '.cronograma']; 
    openSections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            const content = section.querySelector('.collapsible-content');
            const toggle = section.querySelector('.collapsible-toggle');
            if(content) content.classList.add('open');
            if(toggle) toggle.classList.add('active');
        }
    });

    // Adiciona o evento de clique a TODOS os toggles
    const toggles = document.querySelectorAll('.collapsible-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Pega o próximo elemento irmão, que é o 'collapsible-content'
            const content = this.nextElementSibling;

            if (content.classList.contains('collapsible-content')) {
                // Fecha/Abre o conteúdo
                content.classList.toggle('open');
                // Gira a seta
                this.classList.toggle('active');
            }
        });
    });
});