const hamMenu = document.querySelector(".ham-menu");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});


// Tüm "hide-section-btn" butonlarını seç
const hideButtons = document.querySelectorAll('.hide-section-btn');

// Her "TAMAM" butonu için bir event listener ekle
hideButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Butonun ait olduğu parent answer-area div'ini bul
        const answerArea = this.closest('.answer-area');
        
        // Sadece vote-section içindeki item div'lerini seç ve gizle
        answerArea.querySelectorAll('.vote-section .item').forEach(item => {
            item.classList.add('hidden');
        });
        
        // Butonun kendisini gizle
        this.style.display = 'none';

        // Geri-al butonunu görünür hale getir
        answerArea.querySelector('.geri-al button').style.display = 'inline-block';
    });
});

// Tüm "geri-al" butonlarını seç
const geriAlButtons = document.querySelectorAll('.geri-al button');

// Her "geri-al" butonu için bir event listener ekle
geriAlButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Butonun ait olduğu parent answer-area div'ini bul
        const answerArea = this.closest('.answer-area');

        // Gizlenmiş olan item div'lerini geri getir
        answerArea.querySelectorAll('.vote-section .item').forEach(item => {
            item.classList.remove('hidden');
        });

        // "TAMAM" butonunu yeniden göster
        answerArea.querySelector('.hide-section-btn').style.display = 'inline-block';

        // Geri-al butonunu tekrar gizle
        this.style.display = 'none';
    });
});
