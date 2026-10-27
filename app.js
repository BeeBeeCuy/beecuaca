// BeeCuaca — cuaca dari Open-Meteo (gratis, tanpa API key)
// 1) Geocoding: nama kota -> koordinat. 2) Forecast: koordinat -> cuaca.
const kodeCuaca = {0:'Cerah',1:'Sebagian cerah',2:'Berawan sebagian',3:'Berawan',45:'Berkabut',48:'Berkabut',51:'Gerimis ringan',53:'Gerimis',55:'Gerimis lebat',61:'Hujan ringan',63:'Hujan sedang',65:'Hujan lebat',71:'Salju ringan',73:'Salju',75:'Salju lebat',80:'Hujan lokal ringan',81:'Hujan lokal',82:'Hujan lokal lebat',95:'Badai petir'};
const status = document.getElementById('status');
const saatIni = document.getElementById('saatIni');
const prakiraan = document.getElementById('prakiraan');

async function cariCuaca(kota){
  status.textContent = 'Mencari "' + kota + '"…';
  saatIni.hidden = true; prakiraan.innerHTML = '';
  try {
    const geo = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id`)).json();
    if (!geo.results || !geo.results.length) { status.textContent = 'Kota tidak ditemukan. Coba nama lain.'; return; }
    const { latitude, longitude, name, country } = geo.results[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const data = await (await fetch(url)).json();
    const c = data.current;
    status.textContent = '';
    saatIni.hidden = false;
    saatIni.innerHTML = `<h2>${name}, ${country}</h2><div class="suhu">${c.temperature_2m}°C</div>
      <p>${kodeCuaca[c.weather_code] || '—'} · Kelembapan ${c.relative_humidity_2m}% · Angin ${c.wind_speed_10m} km/jam</p>`;
    prakiraan.innerHTML = data.daily.time.map((tgl, i) =>
      `<div class="hari"><b>${new Date(tgl).toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short'})}</b>${kodeCuaca[data.daily.weather_code[i]] || '—'}<br>${data.daily.temperature_2m_min[i]}° – ${data.daily.temperature_2m_max[i]}°C</div>`).join('');
  } catch (err) {
    status.textContent = 'Gagal memuat data cuaca. Periksa koneksi internet.';
  }
}
document.getElementById('formCari').addEventListener('submit', e => {
  e.preventDefault();
  cariCuaca(document.getElementById('kota').value.trim());
});
cariCuaca('Yogyakarta');
