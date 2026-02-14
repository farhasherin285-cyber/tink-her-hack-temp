/* Centralized script for TinkCare pages */

let chart = null;
let autoTimer = null;
let readings = [];
let autoNotified = false; // prevent repeated automatic notifications
let settings = null;
let _weatherIntervalId = null;

// Settings helpers (persisted in localStorage)
function loadSettings(){
	const raw = localStorage.getItem('hc_settings');
	const def = { notifyThreshold:45, recoveryThreshold:40, weatherIntervalSecs:3600, autoNotify:true, autoWeather:true };
	try{ const s = raw ? JSON.parse(raw) : def; settings = Object.assign(def, s); }catch(e){ settings = def; }
}
function saveSettings(){ localStorage.setItem('hc_settings', JSON.stringify(settings)); applySettings(); }
function applySettings(){
	// ensure numeric types
	settings.notifyThreshold = Number(settings.notifyThreshold);
	settings.recoveryThreshold = Number(settings.recoveryThreshold);
	settings.weatherIntervalSecs = Number(settings.weatherIntervalSecs);
	// restart weather interval if needed
	if(_weatherIntervalId){ clearInterval(_weatherIntervalId); _weatherIntervalId = null; }
	if(settings.autoWeather && document.getElementById('healthChart')){
		// initial check
		try{ detectWeather(); }catch(e){}
		_weatherIntervalId = setInterval(detectWeather, Math.max(60, settings.weatherIntervalSecs)*1000);
	}
}

// inject settings modal once
function injectSettingsModal(){ if(document.getElementById('settingsPanel')) return;
	const modal = document.createElement('div'); modal.className = 'settings-modal hidden'; modal.id = 'settingsPanel';
	modal.innerHTML = `
		<div class="settings-panel">
			<h3>Settings</h3>
			<div class="settings-row"><label>Auto-notify enabled</label><input type="checkbox" id="s_autoNotify" /></div>
			<div class="settings-row"><label>Notify threshold (%)</label><input id="s_notifyThreshold" type="number" min="1" max="100" /></div>
			<div class="settings-row"><label>Recovery threshold (%)</label><input id="s_recoveryThreshold" type="number" min="0" max="100" /></div>
			<div class="settings-row"><label>Auto-weather enabled</label><input type="checkbox" id="s_autoWeather" /></div>
			<div class="settings-row"><label>Weather poll (secs)</label><input id="s_weatherInterval" type="number" min="30" /></div>
			<div class="settings-actions"><button id="s_save" class="btn">Save</button><button id="s_cancel" class="btn btn-outline">Cancel</button></div>
		</div>`;
	document.body.appendChild(modal);
	// wire buttons
	document.getElementById('s_cancel').addEventListener('click', ()=>{ modal.classList.add('hidden'); });
	document.getElementById('s_save').addEventListener('click', ()=>{
		settings.autoNotify = document.getElementById('s_autoNotify').checked;
		settings.notifyThreshold = Number(document.getElementById('s_notifyThreshold').value);
		settings.recoveryThreshold = Number(document.getElementById('s_recoveryThreshold').value);
		settings.autoWeather = document.getElementById('s_autoWeather').checked;
		settings.weatherIntervalSecs = Number(document.getElementById('s_weatherInterval').value);
		saveSettings(); modal.classList.add('hidden');
	});
}

function openSettings(){ injectSettingsModal(); loadSettings(); // populate
	document.getElementById('s_autoNotify').checked = !!settings.autoNotify;
	document.getElementById('s_notifyThreshold').value = settings.notifyThreshold;
	document.getElementById('s_recoveryThreshold').value = settings.recoveryThreshold;
	document.getElementById('s_autoWeather').checked = !!settings.autoWeather;
	document.getElementById('s_weatherInterval').value = settings.weatherIntervalSecs;
	document.getElementById('settingsPanel').classList.remove('hidden');
}

/* ---------- STORAGE HELPERS ---------- */
function readProfile(){
	// prefer localStorage, fallback to sessionStorage
	const name = localStorage.getItem('hc_name') || sessionStorage.getItem('hc_name') || null;
	const role = localStorage.getItem('hc_role') || sessionStorage.getItem('hc_role') || null;
	const site = localStorage.getItem('hc_site') || sessionStorage.getItem('hc_site') || null;
	return {name, role, site};
}

function clearProfile(){
	localStorage.removeItem('hc_name'); localStorage.removeItem('hc_role'); localStorage.removeItem('hc_site');
	sessionStorage.removeItem('hc_name'); sessionStorage.removeItem('hc_role'); sessionStorage.removeItem('hc_site');
}

/* ---------- AUTH & PROFILE UI ---------- */
function applyProfileUI(){
	const p = readProfile();
	const profileName = document.getElementById('profileName');
	const profileRole = document.getElementById('profileRole');
	const loginLink = document.getElementById('loginLink');
	const logoutLink = document.getElementById('logoutLink');
	if(profileName) profileName.innerText = p.name || 'Guest';
	if(profileRole) profileRole.innerText = 'Role: ' + (p.role || 'Visitor');
	if(loginLink) loginLink.classList.toggle('hidden', !!p.name);
	if(logoutLink) logoutLink.classList.toggle('hidden', !p.name);
}

function logout(){
	clearProfile(); applyProfileUI(); window.location.href = 'index.html';
}

/* Login handling: write to localStorage if remember checked, otherwise sessionStorage */
document.addEventListener('submit', function(e){
	try{
		if(!e.target || e.target.id !== 'loginForm') return;
		e.preventDefault();
		const nameEl = document.getElementById('loginName');
		const roleEl = document.getElementById('loginRole');
		const siteEl = document.getElementById('loginSite');
		const passEl = document.getElementById('loginPass');
		const rememberEl = document.getElementById('loginRemember');
		const err = document.getElementById('loginError');
		// clear previous error state
		if(nameEl) nameEl.classList.remove('input-error');
		if(passEl) passEl.classList.remove('input-error');
		if(err) err.innerText = '';

		const name = nameEl ? nameEl.value.trim() : '';
		const role = roleEl ? roleEl.value : 'user';
		const site = siteEl ? siteEl.value.trim() : '';
		const pass = passEl ? passEl.value : '';
		const remember = rememberEl ? rememberEl.checked : true;
		// validate
		if(!name || !pass){
			if(err) err.innerText = 'Please fill all fields';
			if(!name && nameEl) nameEl.classList.add('input-error');
			if(!pass && passEl) passEl.classList.add('input-error');
			// focus first empty field
			if(!name && nameEl) nameEl.focus(); else if(!pass && passEl) passEl.focus();
			return;
		}
		if(pass !== 'password'){
			if(err) err.innerText = 'Invalid password';
			if(passEl) passEl.classList.add('input-error');
			const card = document.querySelector('.login-card');
			if(card){ card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
			if(passEl) passEl.focus();
			return;
		}
		if(remember){ localStorage.setItem('hc_name', name); localStorage.setItem('hc_role', role); localStorage.setItem('hc_site', site); }
		else { sessionStorage.setItem('hc_name', name); sessionStorage.setItem('hc_role', role); sessionStorage.setItem('hc_site', site); }
		applyProfileUI();
		window.location.href = 'dashboard.html';
	}catch(err){ console.warn('login handler error', err); }
});

// Persist user into a simple users list (for admin demo)
function saveUserRecord(){
	const p = readProfile();
	if(!p.name) return;
	try{
		const raw = localStorage.getItem('hc_users') || '[]';
		const users = JSON.parse(raw);
		// avoid duplicate — update existing
		const idx = users.findIndex(u=>u.name === p.name && u.site === p.site);
		const entry = { name: p.name, role: p.role || 'user', site: p.site || '', lastLogin: new Date().toISOString() };
		if(idx >= 0) users[idx] = entry; else users.push(entry);
		localStorage.setItem('hc_users', JSON.stringify(users));
	}catch(e){ console.warn('saveUserRecord',e); }
}


document.addEventListener('click', function(e){
	if(e.target && e.target.id === 'logoutLink'){ e.preventDefault(); logout(); }
	if(e.target && e.target.id === 'profileBtn'){ const dd = document.getElementById('profileDropdown'); if(dd) dd.classList.toggle('hidden'); }
});

/* Pre-fill login fields if remember used */
window.addEventListener('load', ()=>{
	try{ const p = readProfile(); if(document.getElementById('loginName') && p.name){ document.getElementById('loginName').value = p.name; document.getElementById('loginRole').value = p.role || 'user'; document.getElementById('loginSite').value = p.site || ''; document.getElementById('loginRemember').checked = !!localStorage.getItem('hc_name'); } }catch(e){}
});

/* ---------- DASHBOARD ---------- */
function initDashboard(){
	applyProfileUI();
	const ctx = document.getElementById('healthChart');
	if(ctx){ chart = new Chart(ctx.getContext('2d'), { type:'line', data:{ labels:[], datasets:[{label:'Dehydration %', data:[], borderColor:'#ef4444', fill:false},{label:'Temp °C', data:[], borderColor:'#f59e0b', fill:false}] }, options:{responsive:true, tension:0.35} }); }

	// wire buttons
	const startBtn = document.getElementById('startBtn');
	const stopBtn = document.getElementById('stopBtn');
	const notifyBtn = document.getElementById('notifyAuthorities');
	const locBtn = document.getElementById('locBtn');
	if(startBtn) startBtn.addEventListener('click', ()=>{ startAutoRefresh(); startBtn.disabled=true; });
	if(stopBtn) stopBtn.addEventListener('click', ()=>{ stopAutoRefresh(); if(startBtn) startBtn.disabled=false; });
	if(notifyBtn) notifyBtn.addEventListener('click', notifyAuthorities);
	if(locBtn) locBtn.addEventListener('click', detectLocation);

	// seed readings
	for(let i=0;i<6;i++) readings.push(simulateReading()); renderChart();
}

function simulateReading(){ return {dehydration: Math.round(20 + Math.random()*70), temp: +(36 + Math.random()*4).toFixed(1), timestamp: Date.now()}; }

async function fetchSensor(){ try{ const res = await fetch('/sensor'); if(!res.ok) throw new Error('no sensor'); const d = await res.json(); return {dehydration: d.dehydration ?? 0, temp: d.temp ?? 36, timestamp: Date.now()}; }catch(e){ return simulateReading(); } }

function pushReading(r){ readings.push(r); if(readings.length>20) readings.shift(); }

// Predict health condition from recent readings
function predictCondition(){
	if(!readings || readings.length < 3) return { label: 'Insufficient data', severity: 'safe', note: 'Need more readings' };
	const lastN = readings.slice(-6); // use last up to 6 readings
	const vals = lastN.map(x=>x.dehydration);
	const avg = vals.reduce((a,b)=>a+b,0)/vals.length;
	const first = vals[0]; const last = vals[vals.length-1];
	const slope = (last - first) / (vals.length - 1); // per-sample change

	// Simple rules: use average and trend
	if(avg >= (settings && settings.notifyThreshold ? settings.notifyThreshold : 45)){
		return { label: 'High risk — likely dehydration', severity:'risk', note: `Avg ${Math.round(avg)}% — immediate precautions recommended` };
	}
	if(slope >= 4){
		return { label: 'Worsening trend', severity:'risk', note: `Rising by ${slope.toFixed(1)}% per reading` };
	}
	if(slope <= -3 && avg < 50){
		return { label: 'Improving', severity:'safe', note: `Falling by ${Math.abs(slope).toFixed(1)}% per reading` };
	}
	return { label: 'Stable', severity: 'safe', note: `Avg ${Math.round(avg)}%, recent change ${slope.toFixed(1)}%/read` };
}

function renderChart(){ if(!chart) return; chart.data.labels = readings.map(r=>new Date(r.timestamp).toLocaleTimeString()); chart.data.datasets[0].data = readings.map(r=>r.dehydration); chart.data.datasets[1].data = readings.map(r=>r.temp); chart.update(); }

function updateDashboardUI(r){
	const bar = document.getElementById('hydrationBar'); const percent = document.getElementById('dehydPercent'); const riskLabel = document.getElementById('riskLabel'); const tempEl = document.getElementById('temp');
	if(bar) bar.style.width = r.dehydration + '%'; if(percent) percent.innerText = r.dehydration + '%'; if(tempEl) tempEl.innerText = r.temp + ' °C';
	const statusBox = document.getElementById('status');
	if(r.dehydration >= 80){ if(statusBox) statusBox.className='status risk'; if(riskLabel) riskLabel.innerText='Status: Severe'; showNotification('⚠ Severe dehydration detected',true); }
	else if(r.dehydration >= (settings && settings.notifyThreshold ? settings.notifyThreshold : 45)){ if(statusBox) statusBox.className='status risk'; if(riskLabel) riskLabel.innerText='Status: At Risk'; showNotification('⚠ Dehydration level high',false);
		// automatic authority notification (only once until levels recover)
		if(settings && settings.autoNotify && !autoNotified){ try{ notifyAuthorities(); }catch(e){ console.warn('auto notify failed', e); } autoNotified = true; }
	}
	else{ if(statusBox) statusBox.className='status safe'; if(riskLabel) riskLabel.innerText='Status: Safe'; }

	// reset auto-notify when dehydration falls below recovery threshold
	const recovery = (settings && settings.recoveryThreshold ? settings.recoveryThreshold : 40);
	if(r.dehydration <= recovery && autoNotified){ autoNotified = false; }
	pushReading(r); renderChart();

	// update predicted condition
	try{
		const pred = predictCondition();
		const el = document.getElementById('predictedCondition');
		if(el){ el.innerText = pred.label + ' — ' + pred.note; el.className = pred.severity === 'risk' ? 'muted' : 'muted'; }
	}catch(e){ console.warn('predict update failed', e); }
}

async function refreshOnce(){ const d = await fetchSensor(); updateDashboardUI(d); }
function startAutoRefresh(){ if(autoTimer) return; refreshOnce(); autoTimer = setInterval(refreshOnce,5000); }
function stopAutoRefresh(){ if(!autoTimer) return; clearInterval(autoTimer); autoTimer = null; }

function showNotification(msg,urgent=false){ const n=document.getElementById('notif'); if(!n) return; n.innerText = msg; n.classList.remove('hidden'); n.style.background = urgent? 'var(--danger)' : 'linear-gradient(90deg,var(--accent1),var(--accent2))'; setTimeout(()=>{ if(n) n.classList.add('hidden'); }, urgent?10000:5000); }

function notifyAuthorities(){ showNotification('Authorities notified — simulated',true); console.log('Notify: authorities called for site', readProfile().site); }

// Try to send a POST to /notify (simulator) and fall back to local message
async function notifyAuthorities(){
	const payload = { site: readProfile().site || 'unknown', time: new Date().toISOString(), note: 'Dehydration/health alert from HydraCare UI' };
	try{
		const res = await fetch('/notify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
		if(res.ok){ showNotification('Authorities notified (server)', true); return; }
	}catch(e){ /* ignore */ }
	// fallback
	showNotification('Authorities notified — simulated', true);
	console.log('Notify fallback:', payload);
}

function detectLocation(){ const el = document.getElementById('location'); if(!navigator.geolocation){ if(el) el.innerText='Geolocation not supported'; return; } navigator.geolocation.getCurrentPosition(pos=>{ if(el) el.innerText = `Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)}` }, err=>{ if(el) el.innerText='Permission denied'; }); }

// Fetch weather for current location using Open-Meteo (no API key required)
async function detectWeather(){
	const showErr = msg => { showNotification(msg, true); console.warn('weather:', msg); };
	if(!navigator.geolocation){ showErr('Geolocation not supported'); return; }
	try{
		const pos = await new Promise((res, rej)=> navigator.geolocation.getCurrentPosition(res, rej, {timeout:10000}));
		const lat = pos.coords.latitude; const lon = pos.coords.longitude;
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
		const r = await fetch(url); if(!r.ok) throw new Error('weather fetch failed');
		const data = await r.json(); const cw = data.current_weather || {};
		const temp = cw.temperature ?? null; const wind = cw.windspeed ?? null; const code = cw.weathercode ?? null;
		const place = `Lat ${lat.toFixed(3)}, Lon ${lon.toFixed(3)}`;
		const summary = `Weather at ${place}: ${temp!==null?temp+'°C':''}${wind?', wind ' + wind + ' km/h':''}`;
		// show short notice
		showNotification(summary, false);

		// determine precautions
		const precautions = [];
		if(temp !== null){
			if(temp >= 35) precautions.push('High heat: hydrate, schedule rest, provide shade and electrolytes.');
			else if(temp >= 30) precautions.push('Hot: encourage frequent water breaks and avoid strenuous tasks at midday.');
			else if(temp <= 5) precautions.push('Cold: provide warm clothing, limit exposure, watch for hypothermia.');
		}
		// weathercode: 0 clear, 1-3 mainly clear/partly cloudy, 61 rain, 80 showers, 95 thunderstorm
		if(code !== null){
			if([61,63,65,80,81,82].includes(code)) precautions.push('Rain expected: ensure shelter, avoid electrical hazards and slippery surfaces.');
			if([95,96,99].includes(code)) precautions.push('Thunderstorms: seek shelter, suspend outdoor work and avoid tall structures.');
		}
		if(wind && wind >= 50) precautions.push('High winds: secure loose items and avoid working at heights.');

		const longMsg = precautions.length? ('Precautions:\n' + precautions.join('\n')) : 'No special precautions detected for current weather.';
		// append to notif area as well for persistence
		const n = document.getElementById('notif'); if(n){ n.innerText = summary + ' — ' + (precautions[0] || 'All clear'); n.classList.remove('hidden'); }
		// set header weather badge if present
		const wb = document.getElementById('weatherSummary'); if(wb){
			const emoji = (code===0 || (code>=1 && code<=3)) ? '☀️' : ([61,63,65,80,81,82].includes(code) ? '🌧️' : ([95,96,99].includes(code) ? '⛈️' : '☁️'));
			wb.innerText = `${emoji} ${temp!==null?temp+'°C':''}`;
			wb.title = summary + ' — ' + (precautions[0] || 'All clear');
			wb.classList.remove('hidden');
		}
		// and open a modal-like alert in chatbox if available
		const chatbox = document.getElementById('chatbox'); if(chatbox){ const bwrap = document.createElement('div'); bwrap.className='message bot appear'; const b = document.createElement('div'); b.className='bot-text'; b.innerText = `🌤️ ${summary}\n\n${longMsg}\n\n(Weather data from Open-Meteo)`; bwrap.appendChild(b); chatbox.appendChild(bwrap); chatbox.scrollTop = chatbox.scrollHeight; }
	}catch(e){ showNotification('Unable to fetch weather', true); console.warn(e); }
}

// wire weather buttons if present
document.addEventListener('click', function(e){ if(e.target && e.target.id === 'weatherBtn'){ e.preventDefault(); detectWeather(); } });

/* ---------- CHATBOT (richer answers + optional images) ---------- */
function initChatbotUI(){ applyProfileUI(); const chatbox = document.getElementById('chatbox'); const sendBtn = document.getElementById('sendBtn'); const input = document.getElementById('question'); if(!chatbox || !sendBtn || !input) return; document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click', e=>{ input.value = e.target.innerText; sendMessage(); })); sendBtn.addEventListener('click', sendMessage); input.addEventListener('keydown', e=>{ if(e.key==='Enter') sendMessage(); }); }

function typeEffect(el, text, cb){ el.innerText = ''; let i = 0; const base = 28; const variance = 40; const caret = document.createElement('span'); caret.className = 'bot-caret'; caret.innerText = '|'; caret.style.marginLeft = '4px'; caret.style.opacity = '0.9'; el.parentElement.appendChild(caret);
	const t = setInterval(()=>{
		if(i < text.length){ el.innerText += text.charAt(i); el.parentElement.scrollTop = el.parentElement.scrollHeight; i++; // variable speed for realism
		} else { clearInterval(t); if(caret && caret.parentElement) caret.parentElement.removeChild(caret); if(cb) cb(); } }, base + Math.random()*variance);
}

const KB = [
	{ q:['dehydration','thirst'], a: { text: '💧 Dehydration\nCauses: inadequate fluid intake, heavy sweating, vomiting or diarrhea.\nSigns: dry mouth, dark urine, dizziness, low energy.\nImmediate: sip water or ORS, rest in shade, loosen clothing.\nWhen to seek help: if unable to drink, fainting, persistent vomiting, or confusion.\nPrevention: regular water breaks, electrolyte drinks during long work.', img: null } },
	{ q:['heat stroke','heat exhaustion','heat'], a: { text: '🔥 Heat-related illness\nSigns: heavy sweating, weakness, nausea, headache, high temp, confusion.\nImmediate: move to cool place, cool body with water/ice packs, sip water.\nEmergency: if confusion, fainting, or temp very high call emergency services.\nPrevention: shade, hydration, rest breaks.', img: null } },
	{ q:['fever','temperature'], a: { text: '🤒 Fever\nKeep hydrated, rest and monitor temperature.\nIf >=38°C (100.4°F) and not improving, or accompanied by severe symptoms (breathing difficulty, rash, persistent vomiting), seek medical advice.', img: null } },
	{ q:['cough','cold','flu','sore throat'], a: { text: '🤧 Coughs, colds and flu\nMost are viral: rest, fluids, paracetamol for fever/pain, honey for cough in adults.\nSeek care if breathing difficulty, high fever, chest pain, or symptoms worsening rapidly.', img: null } },
	{ q:['allergy','allergic reaction','anaphylaxis','hives'], a: { text: '⚠ Allergic reaction\nMild: antihistamine, remove trigger.\nSevere (anaphylaxis): swelling of face/throat, difficulty breathing, faintness — call emergency services and use adrenaline auto-injector if available.', img: null } },
	{ q:['asthma','wheeze','breathless','shortness of breath'], a: { text: '🌬️ Asthma / breathlessness\nUse reliever inhaler (salbutamol) if available, sit upright and give multiple puffs via spacer. Call emergency services if not improving or breathing is very difficult.', img: null } },
	{ q:['chest pain','heart attack','angina'], a: { text: '❤️ Chest pain / suspected heart attack\nIf sudden severe chest pain, sweating, nausea or arm/jaw pain: call emergency services immediately. Keep person calm and seated; if trained, follow local guidance for CPR if they collapse.', img: null } },
	{ q:['stroke','face','arm','speech','slurred'], a: { text: '🧠 Stroke warning signs (FAST)\nFace drooping, Arm weakness, Speech difficulty, Time to call emergency services immediately. Rapid treatment saves brain tissue.', img: null } },
	{ q:['seizure','fit','convulsion'], a: { text: '⚡ Seizure\nKeep the person safe: clear nearby objects, protect head, do not restrain. Time the seizure; call emergency services if it lasts >5 minutes, repeated, or the person does not recover.', img: null } },
	{ q:['bleed','bleeding','hemorrhage'], a: { text: '🩹 Severe bleeding\nApply firm pressure with clean cloth, elevate limb if possible and call emergency services for heavy bleeding that does not stop.', img: null } },
	{ q:['burn','scald'], a: { text: '🔥 Burns\nCool with running water for 20 minutes, remove tight clothing/jewellery, cover with cling film or clean dressing. For large/third-degree burns or electrical/chemical burns, seek emergency care.', img: null } },
	{ q:['poison','overdose','ingestion'], a: { text: '☠️ Poisoning\nIf ingestion suspected, call local poison centre or emergency services immediately. Do not induce vomiting unless instructed by professionals.', img: null } },
	{ q:['diabetes','hypoglycemia','low blood sugar','hyperglycemia'], a: { text: '🩺 Diabetes emergencies\nLow sugar: give 15–20g fast-acting carbohydrate (glucose gel, sugary drink), recheck in 10–15 mins.\nVery high sugar with dehydration/confusion needs urgent medical care.', img: null } },
	{ q:['pregnancy','labour','pregnant'], a: { text: '🤰 Pregnancy concerns\nFor heavy bleeding, severe pain, reduced fetal movements in late pregnancy, or signs of labour seek obstetric care or emergency services.', img: null } },
	{ q:['mental','suicidal','self harm','panic attack'], a: { text: '🧡 Mental health crisis\nIf someone is at immediate risk of harming themselves, call emergency services. For panic attacks: encourage slow breathing, reassurance, and grounding techniques; seek professional support.', img: null } },
	{ q:['infection','wound','pus','redness'], a: { text: '🦠 Infection signs\nRedness, warmth, increasing pain, pus or fever suggest infection. Clean wounds, apply dressing and seek medical advice if worsening or systemic symptoms present.', img: null } },
	{ q:['eye','eye injury','foreign body in eye'], a: { text: '👁️ Eye injury\nDo not rub. Rinse with clean water if foreign material present. For chemical splash or vision changes seek emergency care.', img: null } },
	{ q:['rash','skin rash','hives'], a: { text: '🌡️ Rash\nMinor rashes: antihistamines and topical care. If rash is widespread, blistering, painful, or with fever, seek medical attention.', img: null } },
	{ q:['vomit','vomiting'], a: { text: '🤢 Vomiting and fluid loss\nReplace fluids with small sips of ORS or electrolyte drinks. If unable to keep fluids down, seek medical help to avoid severe dehydration.', img: null } },
	{ q:['headache'], a: { text: '🤕 Headache\nOften caused by dehydration, tension or infection. Rest, hydrate, analgesics as appropriate. Seek urgent care for sudden severe headache, neck stiffness, or neurological symptoms.', img: null } },
	{ q:['faint','dizzy','dizziness'], a: { text: '😵 Dizziness / Fainting\nHelp sit or lie down, elevate legs, loosen clothing and give water if alert. Seek help if not recovering quickly or recurrent episodes.', img: null } },
	{ q:['cramp','muscle cramp'], a: { text: '🦵 Muscle cramps\nStop activity, stretch affected muscle, rehydrate with electrolyte solution. Seek care if severe or persistent.', img: null } },
	{ q:['sunburn'], a: { text: '🌞 Sunburn\nCool the area with water, apply soothing lotion (aloe vera), avoid sun exposure. Seek care for severe blistering or signs of infection.', img: null } },
	{ q:['notify','authority','emergency'], a: { text: '📣 Notification\nIf someone is at immediate risk, contact emergency services. The Notify Authorities button will simulate informing supervisors.', img:null } }
];

function findAnswer(text){
	const t = text.toLowerCase();
	for(const item of KB){ for(const k of item.q){ if(t.includes(k)) return item.a; } }
	// fallback: act as an open AI health assistant
	let generic = [
		"I'm not sure about that specific question, but I can help with symptoms, prevention, first aid, mental health, nutrition, and more. Try rephrasing or asking about a symptom, condition, or health topic.",
		"That topic isn't in my knowledge base yet. For reliable health info, check trusted sources like the World Health Organization (WHO) or your local health authority. You can also ask me about symptoms, first aid, or general wellness!",
		"Sorry, I don't have a direct answer for that. If it's urgent, please contact a healthcare professional. Otherwise, try asking about symptoms, prevention, or first aid steps."
	];
	const pick = generic[Math.floor(Math.random()*generic.length)];
	return {
		text: `🤖 ${pick}`,
		img: null
	};
}

function sendMessage(){
	const input = document.getElementById('question'); const chatbox = document.getElementById('chatbox'); if(!input||!chatbox) return; const txt = input.value.trim(); if(!txt) return;
	const u = document.createElement('div'); u.className = 'message user'; u.innerText = txt; chatbox.appendChild(u);
	const bwrap = document.createElement('div'); bwrap.className = 'message bot'; const b = document.createElement('div'); b.className = 'bot-text'; bwrap.appendChild(b); chatbox.appendChild(bwrap); chatbox.scrollTop = chatbox.scrollHeight;
	// subtle appear animations
	setTimeout(()=>{ u.classList.add('appear'); bwrap.classList.add('appear'); }, 8);

	// Gemini API direct call from frontend
	const GEMINI_API_KEY = (typeof importMeta !== 'undefined' && importMeta.env && importMeta.env.GEMINI_API_KEY) ? importMeta.env.GEMINI_API_KEY : (window.GEMINI_API_KEY || '');
	const GEMINI_MODEL = 'gemini-3-flash-preview';
	const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

	if (!GEMINI_API_KEY) {
		typeEffect(b, 'AI not available: API key missing.', () => { chatbox.scrollTop = chatbox.scrollHeight; });
		input.value = '';
		return;
	}

	fetch(GEMINI_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [
				{ parts: [ { text: txt } ] }
			]
		})
	})
		.then(res => res.json())
		.then(data => {
			let reply = 'Sorry, no response.';
			if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
				reply = data.candidates[0].content.parts[0].text;
			}
			typeEffect(b, reply, () => { chatbox.scrollTop = chatbox.scrollHeight; });
		})
		.catch(() => {
			// fallback to local KB
			const resp = findAnswer(txt);
			typeEffect(b, resp.text, () => {
				chatbox.scrollTop = chatbox.scrollHeight;
				if(resp.img){
					const img = document.createElement('img');
					img.src = resp.img;
					img.style.maxWidth='200px';
					img.style.borderRadius='8px';
					img.style.marginTop='8px';
					bwrap.appendChild(img);
				}
			});
		});
	input.value = '';
}

/* ---------- BOOTSTRAP ON LOAD ---------- */
window.addEventListener('load', ()=>{
	applyProfileUI();
	const logoutEl = document.getElementById('logoutLink'); if(logoutEl) logoutEl.addEventListener('click', e=>{ e.preventDefault(); logout(); });
	if(document.getElementById('healthChart')) initDashboard();
	if(document.getElementById('chatbox')) initChatbotUI();
	// settings: load and apply, wire settings button
	try{ loadSettings(); applySettings(); }catch(e){}
	const sb = document.getElementById('settingsBtn'); if(sb) sb.addEventListener('click', (e)=>{ e.preventDefault(); openSettings(); });
});

// Auto-check weather on dashboard load every hour
function _autoWeatherSetup(){ try{ if(document.getElementById('healthChart')){ detectWeather(); setInterval(detectWeather, 60*60*1000); } }catch(e){} }
_autoWeatherSetup();

