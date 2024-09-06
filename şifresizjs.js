const selectedVotes = {};

document.querySelectorAll('.answer-area').forEach(function(area) {
    const items = area.querySelectorAll('.item');
    const category = area.getAttribute('data-category'); // Kategori adı

    items.forEach(function(item) {
        item.addEventListener('click', function() {
            // Seçili olup olmadığını kontrol et
            const isSelected = item.getAttribute('data-selected') === 'true';

            // Eğer zaten seçiliyse, seçimi kaldır
            if (isSelected) {
                item.style.backgroundColor = ''; 
                item.style.transform = ''; 
                item.setAttribute('data-selected', 'false');
                delete selectedVotes[category]; // Seçimi sil
            } else {
                // Aynı alandaki tüm öğeleri sıfırla
                items.forEach(function(el) {
                    el.style.backgroundColor = ''; 
                    el.style.transform = ''; 
                    el.setAttribute('data-selected', 'false');
                });
                // Rengi ve scale'i değiştir
                item.style.backgroundColor = '#cfa756';
                item.style.transform = 'scale(1.05)';
                item.setAttribute('data-selected', 'true');

                // Seçimi kaydet
                const selectedValue = item.getAttribute('data-value');
                selectedVotes[category] = selectedValue;
            }
        });
    });
});

// "Oy Ver" butonuna tıklanınca tüm verileri sunucuya gönder
document.getElementById('submit-vote').addEventListener('click', function() {
    // Seçimler varsa gönder
    if (Object.keys(selectedVotes).length > 0) {
        sendVotes(selectedVotes);
    } else {
        alert('Lütfen en az bir seçim yapın.');
    }
});

// AJAX ile seçimi PHP'ye gönder
function sendVotes(votes) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "vote.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            if (response.updatedVotes) {
                updateVoteCounts(response.updatedVotes);
            }

            alert(response.message);
        }
    };

    // Seçim verisini string formatına çevirip gönder
    const voteData = "votes=" + JSON.stringify(votes);
    xhr.send(voteData);
}

// Oy sayısını güncelle
function updateVoteCounts(updatedVotes) {
    document.querySelectorAll('.answer-area').forEach(function(area) {
        const category = area.getAttribute('data-category');
        const items = area.querySelectorAll('.item');

        items.forEach(function(item) {
            const playerName = item.getAttribute('data-value');

            // Eğer bu oyuncunun güncellenmiş oyu varsa
            if (updatedVotes[category] && updatedVotes[category][playerName]) {
                const voteCount = updatedVotes[category][playerName];
                item.querySelector('.vote-count').textContent = `(${voteCount})`;
            }
        });
    });
}