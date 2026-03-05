document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leadForm');
    const message = document.getElementById('formMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Эмуляция отправки данных
        const email = form.querySelector('input').value;
        console.log('Заявка отправлена с email:', email);

        // Показываем сообщение об успехе
        form.classList.add('hidden');
        message.classList.remove('hidden');
        message.style.color = '#059669';
        message.style.fontWeight = 'bold';
    });

    // Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
