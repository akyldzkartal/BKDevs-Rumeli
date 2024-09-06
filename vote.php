<?php
// Oy sayılarının ve IP adreslerinin saklanacağı dosyalar
$votesFilePath = 'oylar.txt';
$ipsFilePath = 'ips.txt';

// Oy verilerini dosyadan yükle
function loadVotes($filePath) {
    $votes = [];
    $currentCategory = '';

    if (file_exists($filePath)) {
        $fileContents = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($fileContents as $line) {
            // Satırı kategorilere ayır
            if (strpos($line, ':') === false) {
                // Kategori satırı
                $currentCategory = $line;
                $votes[$currentCategory] = [];
            } else {
                // Oyuncu ve oy sayısını ayır
                list($player, $voteCount) = explode(':', $line);
                $votes[$currentCategory][$player] = (int)$voteCount;
            }
        }
    }

    return $votes;
}

// Oy verilerini dosyaya kaydet
function saveVotes($filePath, $votesData) {
    $fileContents = '';

    foreach ($votesData as $category => $players) {
        $fileContents .= "\n$category\n";
        foreach ($players as $player => $voteCount) {
            $fileContents .= "$player:$voteCount\n";
        }
    }

    file_put_contents($filePath, $fileContents);
}

// IP adreslerini dosyaya kaydet
function logIpAddress($filePath, $ipAddress) {
    $fileContents = file_exists($filePath) ? file_get_contents($filePath) : '';
    $fileContents .= $ipAddress . "\n";
    file_put_contents($filePath, $fileContents);
}

// IP adresinin daha önce kullanılıp kullanılmadığını kontrol et
function isIpAddressUsed($filePath, $ipAddress) {
    if (file_exists($filePath)) {
        $fileContents = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        return in_array($ipAddress, $fileContents);
    }
    return false;
}

// AJAX isteğinden gelen seçim verilerini al
if (isset($_POST['votes'])) {
    $votes = json_decode($_POST['votes'], true);

    if (!empty($votes)) {
        // IP adresini al
        $ipAddress = $_SERVER['REMOTE_ADDR'];

        // IP adresinin daha önce kullanılıp kullanılmadığını kontrol et
        if (isIpAddressUsed($ipsFilePath, $ipAddress)) {
            echo json_encode(['message' => 'Bu IP adresi ile daha önce oy kullanıldı! Tekrar Kullanamazsınız']);
            exit;
        }

        // Mevcut oy sayıları dosyadan yüklenir
        $existingVotes = loadVotes($votesFilePath);

        // Gelen oyları işlemeye başla
        foreach ($votes as $category => $player) {
            // Oyuncuya oy ver ve oylama sayısını artır
            if (isset($existingVotes[$category][$player])) {
                $existingVotes[$category][$player] += 1; // Oy sayısını artır
            } else {
                $existingVotes[$category][$player] = 1; // İlk oy
            }
        }

        // Güncellenmiş oy verilerini dosyaya kaydet
        saveVotes($votesFilePath, $existingVotes);

        // IP adresini kaydet
        logIpAddress($ipsFilePath, $ipAddress);

        // Başarılı mesajı ve güncellenmiş oy sayılarını döndür
        echo json_encode([
            'message' => 'Oylar başarıyla kaydedildi!',
            'redirect' => 'newpage.html' // Yönlendirme URL'si
        ]);
    } else {
        echo json_encode(['message' => 'Oy verisi bulunamadı!']);
    }
} else {
    echo json_encode(['message' => 'Geçersiz istek!']);
}
?>
