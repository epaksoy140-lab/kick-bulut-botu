const axios = require('axios');

// Render'ın hata vermemesi için sahte bir web sunucusu açıyoruz
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Kick Botu Aktif ve Calisiyor!\n');
});
server.listen(process.env.PORT || 3000, () => {
    console.log("Web sunucusu baslatildi.");
});

// Render'a gireceğimiz gizli ayarları kodun içine çekiyoruz
const CHANNELS = process.env.CHANNELS;
const KICK_SESSION = process.env.KICK_SESSION;
const CF_BM = process.env.CF_BM;

if (!CHANNELS || !KICK_SESSION || !CF_BM) {
    console.error("HATA: Lutfen Render'daki Environment Variables (Gelismiş Ayarlar) kısmını doldurun!");
    process.exit(1);
}

console.log(`Bot baslatildi. Izlenecek kanal: ${CHANNELS}`);

// Kick sunucularına "Ben şu an bu yayını izliyorum" sinyali gönderen fonksiyon
async function sendLurkSignal() {
    try {
        const url = `https://kick.com/api/v1/channels/${CHANNELS.toLowerCase()}`;
        
        const response = await axios.get(url, {
            headers: {
                'Cookie': `kick_session=${KICK_SESSION}; __cf_bm=${CF_BM};`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (response.status === 200) {
            console.log(`[${new Date().toLocaleTimeString()}] Sinyal basariyla gonderildi. ${CHANNELS} kanali izleniyor...`);
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] Sinyal gonderilirken hata olustu (Cerezleriniz esgimis olabilir):`, error.message);
    }
}

// Botun her 3 dakikada bir (180000 milisaniye) Kick'e sinyal göndermesini sağlıyoruz
// Kick, seni yayında saymaya devam eder ve rozetin artar.
setInterval(sendLurkSignal, 180000);
sendLurkSignal(); // İlk sinyali hemen gönder
