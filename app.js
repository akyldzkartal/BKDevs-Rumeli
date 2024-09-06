document.querySelectorAll('.answer-area').forEach(function(area) {
    const items = area.querySelectorAll('.item');

    items.forEach(function(item) {
        item.addEventListener('click', function() {
            // Öğenin seçili olup olmadığını kontrol et
            const isSelected = item.getAttribute('data-selected') === 'true';

            // Eğer zaten seçiliyse, seçimi kaldır (renk ve scale)
            if (isSelected) {
                item.style.backgroundColor = ''; 
                item.style.transform = ''; // Ölçeklendirmeyi kaldır
                item.setAttribute('data-selected', 'false');
            } else {
                // Aynı alandaki tüm öğeleri sıfırla
                items.forEach(function(el) {
                    el.style.backgroundColor = ''; 
                    el.style.transform = ''; // Ölçeklendirmeyi sıfırla
                    el.setAttribute('data-selected', 'false');
                });
                // Rengi ve scale'i değiştir, öğeyi seçili yap
                item.style.backgroundColor = '#cfa756';
                item.style.transform = 'scale(1.05)'; // Ölçeklendir
                item.setAttribute('data-selected', 'true');
            }
        });
    });
});


const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');

hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');
});
