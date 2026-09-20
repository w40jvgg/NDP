(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const STORAGE = {
    user: 'ndp_demo_user', session: 'ndp_demo_session', tracks: 'ndp_demo_tracks', events: 'ndp_demo_events', samples: 'ndp_demo_samples', conversations: 'ndp_demo_conversations', theme: 'nd-theme', notifications: 'ndp_demo_notifications'
  };

  const seedTracks = [
    {
      id:'ND-84F2-19A7', isrc:'RU-NDP-26-91752', title:'Полуночный маршрут', artist:'ÆNDYΞ', type:'Оригинал', genre:'Neurofunk', bpm:175, key:'D minor', duration:'03:42', label:'DNB1ST', parent:null, status:'Подтверждено', aiLicense:'С условиями', created:'07.09.2026',
      fingerprint:'ADNA-V1 · 8f4c:91aa:02de:771c',
      splits:[{role:'Автор / продюсер',name:'ÆNDYΞ',share:70},{role:'Соавтор',name:'Coauthor-01',share:30}]
    },
    {
      id:'ND-1AA3-8C71', isrc:'RU-NDP-26-91753', title:'Полуночный / Сдвиг', artist:'ÆNDYΞ & KERA', type:'Ремикс', genre:'Drum & Bass', bpm:174, key:'D minor', duration:'04:08', label:'DNB1ST', parent:'ND-84F2-19A7', status:'Подтверждено', aiLicense:'Разрешено', created:'09.09.2026',
      fingerprint:'ADNA-V1 · 0a1d:9c74:5e31:2bf8',
      splits:[{role:'Ремиксер',name:'KERA',share:40},{role:'Автор источника',name:'ÆNDYΞ',share:40},{role:'Продюсер',name:'Producer B',share:20}]
    },
    {
      id:'ND-43BC-0201', isrc:'RU-NDP-26-91754', title:'Стеклянные барабаны', artist:'Sample Lab', type:'Сэмпл', genre:'Breaks', bpm:172, key:'—', duration:'00:12', label:'Независимый', parent:'ND-84F2-19A7', status:'Подтверждено', aiLicense:'Запрещено', created:'10.09.2026',
      fingerprint:'ADNA-V1 · 43bc:0201:78ca:119e',
      splits:[{role:'Автор',name:'Sample Lab',share:100}]
    },
    {
      id:'ND-991C-72D0', isrc:'RU-NDP-26-91755', title:'Послеполуночный сигнал', artist:'Signal Unit', type:'Производное', genre:'Electronic', bpm:170, key:'F minor', duration:'03:16', label:'DNB1ST', parent:'ND-1AA3-8C71', status:'С условиями', aiLicense:'С условиями', created:'12.09.2026',
      fingerprint:'ADNA-V1 · 991c:72d0:19e2:5a33',
      splits:[{role:'Автор',name:'Signal Unit',share:58},{role:'Источник',name:'ÆNDYΞ & KERA',share:42}]
    }
  ];

  const seedEvents = [
    {date:'20.09 · 19:42',kind:'Идентификация',text:'«Полуночный / Сдвиг» найден в медиапотоке',amount:'84 ₽',status:'Рассчитано'},
    {date:'20.09 · 17:08',kind:'Использование ИИ',text:'Разрешённое событие использования «Полуночный маршрут»',amount:'126 ₽',status:'Рассчитано'},
    {date:'19.09 · 23:14',kind:'Производное',text:'Обнаружена связь с «Послеполуночный сигнал»',amount:'48 ₽',status:'Ожидает'},
    {date:'19.09 · 14:31',kind:'Воспроизведение',text:'Каталог DNB1ST · пакет событий №74291',amount:'312 ₽',status:'Рассчитано'},
    {date:'18.09 · 09:05',kind:'Проверка прав',text:'Лицензия на сэмпл «Стеклянные барабаны» подтверждена',amount:'36 ₽',status:'Рассчитано'}
  ];

  const seedSamples = [
    {id:'ND-SMP-43BC-0201',title:'Стеклянные барабаны',kind:'Сэмпл',duration:'00:12',bpm:172,key:'—',tags:['breaks','drums','glass'],status:'В продаже',price:'4 500 ₽',license:'Неисключительная коммерческая',downstream:'10%',uses:7,color:'violet'},
    {id:'ND-SMP-A71E-1904',title:'Neon Dust Vox',kind:'Vocal chop',duration:'00:08',bpm:140,key:'F minor',tags:['vox','neon','future'],status:'В продаже',price:'6 500 ₽',license:'Коммерческая + производные',downstream:'5%',uses:3,color:'cyan'},
    {id:'ND-PACK-33D2-8F10',title:'Metro Perc Pack',kind:'Пак · 24 файла',duration:'01:46',bpm:128,key:'Mixed',tags:['perc','metro','foley'],status:'Обмен',price:'Обмен',license:'По согласованию',downstream:'—',uses:2,color:'amber'},
    {id:'ND-SMP-5D91-A203',title:'Northern Sub Bass',kind:'One-shot',duration:'00:05',bpm:null,key:'C',tags:['bass','sub','clean'],status:'Не продаётся',price:'—',license:'Только собственные проекты',downstream:'—',uses:11,color:'violet'},
    {id:'ND-SMP-118A-07DE',title:'Ice Hats 174',kind:'Loop',duration:'00:16',bpm:174,key:'—',tags:['hats','dnb','ice'],status:'В продаже',price:'2 900 ₽',license:'Неисключительная коммерческая',downstream:'8%',uses:5,color:'cyan'},
    {id:'ND-PACK-C290-72BB',title:'Industrial Air Pack',kind:'Пак · 16 файлов',duration:'02:14',bpm:null,key:'Mixed',tags:['texture','industrial','air'],status:'Обмен',price:'Обмен',license:'По согласованию',downstream:'—',uses:1,color:'amber'}
  ];

  const seedConversations = [
    {id:'conv-kera',user:{name:'KERA',role:'Продюсер / ремиксер',avatar:'KR',online:true,profileId:'kera'},sampleId:'ND-SMP-43BC-0201',deal:'Покупка',offer:'4 500 ₽ · неисключительная лицензия',unread:2,messages:[
      {from:'them',time:'20:14',text:'Привет. Слышал «Стеклянные барабаны» в твоём паке. Хочу использовать этот брейк в коммерческом релизе.'},
      {from:'me',time:'20:18',text:'Привет. Для него доступна неисключительная коммерческая лицензия. В паспорте стоит 10% downstream с производных.'},
      {from:'them',time:'20:21',text:'Подходит. Готов купить лицензию за 4 500 ₽ и оставить 10% с треков, где сэмпл реально используется.'},
      {from:'them',time:'20:22',text:'Если согласен, пришли предложение через NDP — хочу, чтобы условия сразу попали в манифест.'}
    ]},
    {id:'conv-samplelab',user:{name:'Sample Lab',role:'Сэмпл-мейкер',avatar:'SL',online:false,profileId:'samplelab'},sampleId:'ND-SMP-A71E-1904',deal:'Продажа',offer:'6 500 ₽ · 5% downstream',unread:1,messages:[
      {from:'me',time:'Вчера · 18:02',text:'Привет. У меня есть Neon Dust Vox — 8 секунд, F minor. Ищу покупателя на коммерческую лицензию.'},
      {from:'them',time:'Вчера · 18:27',text:'Послушал демо. Сколько хочешь и допускаешь ли производные работы?'},
      {from:'me',time:'Вчера · 18:31',text:'6 500 ₽ за лицензию. Производные разрешены, но 5% downstream остаётся за мной по NDP-ID.'},
      {from:'them',time:'Вчера · 18:40',text:'Условия нормальные. Пришли финальный манифест, я проверю сплит и готов закрыть сделку.'}
    ]},
    {id:'conv-mira',user:{name:'MIRA',role:'Битмейкер',avatar:'MR',online:true,profileId:'mira'},sampleId:'ND-PACK-33D2-8F10',deal:'Обмен',offer:'Metro Perc Pack ↔ Ice Hats Vol. 2',unread:0,messages:[
      {from:'them',time:'Пн · 12:11',text:'Вижу, ты выставил Metro Perc Pack на обмен. Интересует обмен на мой Ice Hats Vol. 2?'},
      {from:'me',time:'Пн · 12:24',text:'Да, если в паке можно использовать хэты в коммерческих релизах без разовой оплаты.'},
      {from:'them',time:'Пн · 12:29',text:'Можно. Я оставляю 6% downstream только если звук попадает в производный трек.'},
      {from:'me',time:'Пн · 12:34',text:'Тогда подходит. Давай обменяем манифесты и зафиксируем взаимные лицензии.'}
    ]}
  ];

  const seedPublicProfiles = {
    kera:{
      id:'kera',name:'KERA',role:'Продюсер / ремиксер',avatar:'assets/avatar-kera.svg',online:true,verified:true,
      ndpId:'NDP-U-2025-KERA-0142',location:'Москва, РФ',joined:'в NDP с марта 2025',response:'обычно отвечает до 1 часа',
      bio:'Продюсер и ремиксер электронной музыки. Работает с drum & bass, neurofunk и breaks. Использует NDP для фиксации лицензий на исходные сэмплы и прозрачного учёта downstream-долей в производных релизах.',
      genres:['Drum & Bass','Neurofunk','Breaks'],specialties:['ремиксы','аранжировка','саунд-дизайн','лицензирование сэмплов'],
      policy:'Покупает неисключительные лицензии; downstream 5–12% фиксируется в манифесте до релиза.',
      stats:{works:18,samples:7,deals:24,derivatives:11},rating:4.9,ratingNote:'24 завершённые сделки · 96% ответов без просрочки',
      catalog:[
        {id:'ND-KR-904A-7710',title:'Night Transit Rework',type:'Ремикс',status:'Подтверждено',license:'Коммерческая лицензия',price:'По запросу'},
        {id:'ND-SMP-KR22-118D',title:'Razor Bass Toolkit',type:'Сэмпл-пак · 18 файлов',status:'В продаже',license:'Неисключительная',price:'5 900 ₽'},
        {id:'ND-SMP-KR81-02AC',title:'Crystal Snare Chain',type:'Loop · 174 BPM',status:'Обмен',license:'По согласованию',price:'Обмен'}
      ]
    },
    samplelab:{
      id:'samplelab',name:'Sample Lab',role:'Сэмпл-мейкер',avatar:'assets/avatar-samplelab.svg',online:false,verified:true,
      ndpId:'NDP-U-2024-SLAB-0088',location:'Санкт-Петербург, РФ',joined:'в NDP с ноября 2024',response:'обычно отвечает в течение дня',
      bio:'Независимый сэмпл-мейкер и дизайнер звука. Выпускает короткие вокальные фрагменты, брейки и текстуры. В публичных предложениях заранее указывает разрешение на производные работы и долю автора исходника.',
      genres:['Future Garage','Breaks','Ambient'],specialties:['vocal chops','брейки','foley','текстуры'],
      policy:'Коммерческие лицензии с разрешёнными производными; типичный downstream 3–8%.',
      stats:{works:31,samples:46,deals:67,derivatives:28},rating:4.8,ratingNote:'67 завершённых сделок · 98% манифестов подтверждены',
      catalog:[
        {id:'ND-SMP-A71E-1904',title:'Neon Dust Vox',type:'Vocal chop · F minor',status:'В продаже',license:'Коммерческая + производные',price:'6 500 ₽'},
        {id:'ND-SMP-SL43-0201',title:'Glass Breaks 172',type:'Break loop · 172 BPM',status:'В продаже',license:'Неисключительная',price:'4 500 ₽'},
        {id:'ND-PACK-SL10-44EF',title:'Texture Room 01',type:'Пак · 32 файла',status:'Подтверждено',license:'Редакционная / коммерческая',price:'7 900 ₽'}
      ]
    },
    mira:{
      id:'mira',name:'MIRA',role:'Битмейкер',avatar:'assets/avatar-mira.svg',online:true,verified:true,
      ndpId:'NDP-U-2026-MIRA-0317',location:'Казань, РФ',joined:'в NDP с июня 2026',response:'обычно отвечает до 3 часов',
      bio:'Битмейкер и автор перкуссионных библиотек. Предпочитает обмен пакетами и взаимные лицензии без разовой оплаты, когда обе стороны сохраняют оговорённую downstream-долю.',
      genres:['Hip-Hop','UK Garage','Electronic'],specialties:['hi-hats','перкуссия','groove loops','обмен сэмпл-паками'],
      policy:'Открыта к обмену паками; взаимные лицензии фиксируются отдельными NDP-манифестами.',
      stats:{works:12,samples:21,deals:15,derivatives:9},rating:5.0,ratingNote:'15 завершённых сделок · спорных лицензий нет',
      catalog:[
        {id:'ND-PACK-MR82-5A11',title:'Ice Hats Vol. 2',type:'Пак · 26 файлов',status:'Обмен',license:'Взаимная лицензия',price:'Обмен'},
        {id:'ND-SMP-MR14-8CA0',title:'Violet Perc Loops',type:'Loop pack · 132 BPM',status:'В продаже',license:'Неисключительная',price:'3 200 ₽'},
        {id:'ND-TRK-MR77-221F',title:'Cold Platform',type:'Оригинальный трек',status:'Подтверждено',license:'Синхронизация по запросу',price:'По запросу'}
      ]
    }
  };

  const activitySeed = [
    ['✓','Паспорт подтверждён','«Полуночный маршрут» · 18 минут назад'],
    ['⌁','Найдено использование','«Полуночный / Сдвиг» · сегодня, 19:42'],
    ['⇄','Рассчитаны роялти','Событие №74291 · 84 ₽'],
    ['＋','Добавлена связь','Производное → ремикс · вчера']
  ];

  const views = {
    dashboard:['NORMALDANCE / ОБЗОР','Главная'], verify:['ADNA / ИДЕНТИФИКАЦИЯ','Проверка'], registry:['NDT / РЕЕСТР ПРАВ','Реестр'],
    'register-track':['NDT / РЕГИСТРАЦИЯ','Регистрация произведения'], royalties:['РАСЧЁТ РОЯЛТИ / ДЕМО','Роялти'], 'how-it-works':['NORMALDANCE / СКВОЗНОЙ СЦЕНАРИЙ','Как работает'], messages:['NORMALDANCE / P2P','Сообщения'], developers:['МАШИННЫЙ ИНТЕРФЕЙС','API / MCP'],
    account:['ПРОФИЛЬ / NORMALDANCE','Личный кабинет'], 'user-profile':['NDP / ПУБЛИЧНЫЙ ПРОФИЛЬ','Профиль пользователя'], settings:['ПРОФИЛЬ / НАСТРОЙКИ','Настройки']
  };

  const endpointExamples = {
    identify:{title:'POST /oracle/identify',code:`POST /oracle/identify\nContent-Type: application/json\n\n{\n  "adna": "<base64 fingerprint>"\n}\n\n// Ответ\n{\n  "registry_size": 4,\n  "match": {\n    "verdict": "same",\n    "similarity": 0.971,\n    "artist": "ÆNDYΞ",\n    "title": "Полуночный маршрут",\n    "isrc": "RU-NDP-26-91752",\n    "version": "v1"\n  }\n}`},
    track:{title:'GET /registry/tracks/{isrc}',code:`GET /registry/tracks/RU-NDP-26-91752\n\n// Ответ\n{\n  "isrc": "RU-NDP-26-91752",\n  "ndp_id": "ND-84F2-19A7",\n  "title": "Полуночный маршрут",\n  "artist": "ÆNDYΞ",\n  "rights": {\n    "splits": [\n      { "role": "producer", "share": 70 },\n      { "role": "coauthor", "share": 30 }\n    ]\n  },\n  "verification": "verified"\n}`},
    usage:{title:'POST /usage/events',code:`POST /usage/events\nContent-Type: application/json\n\n{\n  "isrc": "RU-NDP-26-91752",\n  "source": "media-platform",\n  "event_type": "playback",\n  "units": 1\n}\n\n// Ответ\n{\n  "event_id": "EV-2026-74291",\n  "rights_graph": "resolved",\n  "royalty_status": "calculated"\n}`},
    mcp:{title:'MCP · register_track',code:`tool: register_track\n\ninput:\n{\n  "title": "New Work",\n  "artist": "Artist Name",\n  "isrc": "RU-NDP-26-00001",\n  "splits": [\n    { "role": "author", "share": 60 },\n    { "role": "producer", "share": 40 }\n  ]\n}\n\nresult:\n{\n  "ndp_id": "ND-....",\n  "status": "registered"\n}`}
  };

  function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function ensureSeed() {
    if (!localStorage.getItem(STORAGE.tracks)) save(STORAGE.tracks, seedTracks);
    if (!localStorage.getItem(STORAGE.events)) save(STORAGE.events, seedEvents);
    if (!localStorage.getItem(STORAGE.samples)) save(STORAGE.samples, seedSamples);
    if (!localStorage.getItem(STORAGE.conversations)) save(STORAGE.conversations, seedConversations);
    if (!localStorage.getItem(STORAGE.notifications)) localStorage.setItem(STORAGE.notifications,'1');
  }
  ensureSeed();

  let currentUser = load(STORAGE.user, null);
  let currentView = 'dashboard';
  let selectedRegistryId = null;
  let wizardStep = 1;
  let selectedFile = null;
  let selectedConversationId = 'conv-kera';
  let selectedPublicProfileId = 'kera';
  let selectedSampleId = null;
  let howDemoStep = 1;
  let samplePlayTimer = null;
  let splitRows = [{role:'Автор',name:'',share:70},{role:'Продюсер',name:'',share:30}];

  const notify = (title, message='', type='success') => {
    if (localStorage.getItem(STORAGE.notifications) === '0' && type !== 'error') return;
    const toast = document.createElement('div'); toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'error' ? '!' : '✓'}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;
    $('#toast-root').append(toast); setTimeout(() => toast.remove(), 3600);
  };
  const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
  const initials = (name='ND') => name.split(/\s+/).filter(Boolean).slice(0,2).map(v=>v[0]).join('').toUpperCase() || 'ND';
  const formatBytes = bytes => bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} КБ` : `${(bytes/1024/1024).toFixed(2)} МБ`;
  const randomId = () => `ND-${Math.random().toString(16).slice(2,6).toUpperCase()}-${Math.random().toString(16).slice(2,6).toUpperCase()}`;
  const today = () => new Intl.DateTimeFormat('ru-RU').format(new Date());

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme; localStorage.setItem(STORAGE.theme, theme);
  }
  applyTheme(localStorage.getItem(STORAGE.theme) || 'dark');
  $('#theme-toggle').addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light':'dark'));
  $('#settings-theme').addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light':'dark'));

  function showAuth() { $('#auth-shell').classList.remove('hidden'); $('#app-shell').classList.add('hidden'); }
  function showApp() {
    $('#auth-shell').classList.add('hidden'); $('#app-shell').classList.remove('hidden');
    hydrateUser(); renderAll(); navigate(location.hash.replace('#','') || 'dashboard', false);
  }

  function hydrateUser() {
    currentUser = load(STORAGE.user, currentUser) || {name:'Демо-пользователь',email:'demo@normaldance.ru',role:'Автор / артист',id:'NDP-U-2026-0001',created:'20.09.2026'};
    const avatar = initials(currentUser.name);
    $('#top-avatar').textContent = avatar; $('#top-name').textContent = currentUser.name; $('#top-role').textContent = currentUser.role;
    $('#dashboard-name').textContent = currentUser.name.split(' ')[0]; $('#account-avatar').textContent = avatar; $('#account-name').textContent = currentUser.name;
    $('#account-role').textContent = currentUser.role; $('#account-email').textContent = currentUser.email; $('#account-id').textContent = currentUser.id || 'NDP-U-LOCAL'; $('#account-created').textContent = currentUser.created || today();
    $('#profile-name').value = currentUser.name; $('#profile-role').value = currentUser.role;
  }

  function createDemoUser() {
    const user = {name:'ÆNDYΞ',email:'demo@normaldance.ru',role:'Автор / артист',id:'NDP-U-2026-0001',created:'20.09.2026'};
    save(STORAGE.user,user); localStorage.setItem(STORAGE.session,'1'); currentUser = user; showApp(); notify('Демо-профиль открыт','Все действия выполняются локально.');
  }

  $$('.auth-tab').forEach(btn => btn.addEventListener('click', () => {
    $$('.auth-tab').forEach(x => { x.classList.toggle('active', x===btn); x.setAttribute('aria-selected',x===btn?'true':'false'); });
    $('#login-form').classList.toggle('hidden',btn.dataset.authTab!=='login'); $('#register-form').classList.toggle('hidden',btn.dataset.authTab!=='register');
  }));
  $('#demo-login').addEventListener('click', createDemoUser);
  $('#login-form').addEventListener('submit', e => {
    e.preventDefault(); const email=$('#login-email').value.trim().toLowerCase(), pass=$('#login-password').value; const err=$('#login-error'); err.textContent='';
    const user=load(STORAGE.user,null);
    if(email==='demo@normaldance.ru' && pass==='demo2026'){createDemoUser();return;}
    if(!user || email!==user.email.toLowerCase() || pass!==user.password){err.textContent='Неверная электронная почта или пароль. Для демо используйте данные ниже.';return;}
    localStorage.setItem(STORAGE.session,'1'); currentUser=user; showApp();
  });
  $('#register-form').addEventListener('submit', e => {
    e.preventDefault(); const name=$('#register-name').value.trim(),email=$('#register-email').value.trim(),role=$('#register-role').value,pass=$('#register-password').value,consent=$('#register-consent').checked,err=$('#register-error');err.textContent='';
    if(!name||!email.includes('@')||pass.length<6||!consent){err.textContent='Заполните все поля, используйте пароль не короче 6 символов и подтвердите условия.';return;}
    const user={name,email,role,password:pass,id:`NDP-U-${new Date().getFullYear()}-${Math.floor(1000+Math.random()*8999)}`,created:today()}; save(STORAGE.user,user);localStorage.setItem(STORAGE.session,'1');currentUser=user;showApp();notify('Профиль создан','Аккаунт сохранён локально в этом браузере.');
  });

  function navigate(view, push=true) {
    if(!views[view]) view='dashboard'; currentView=view;
    $$('[data-view-section]').forEach(el=>el.classList.toggle('active',el.dataset.viewSection===view));
    $$('.side-link').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
    const topMessagesButton=$('#top-messages-button');
    if(topMessagesButton){
      const isMessages=view==='messages';
      topMessagesButton.classList.toggle('active',isMessages);
      if(isMessages) topMessagesButton.setAttribute('aria-current','page'); else topMessagesButton.removeAttribute('aria-current');
    }
    $('#view-kicker').textContent=views[view][0];$('#view-title').textContent=views[view][1];
    $('#sidebar').classList.remove('open'); $('#profile-menu').classList.add('hidden');
    if(push) history.replaceState(null,'',`#${view}`);
    if(view==='registry') renderRegistry(); if(view==='register-track') updateTrackForm(); if(view==='account'){ hydrateUser(); renderSamples(); } if(view==='messages') renderMessages(); if(view==='user-profile') renderPublicProfile(); if(view==='how-it-works') showHowStep(howDemoStep);
    window.scrollTo({top:0,behavior:'instant'});
  }
  $$('.side-link').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.view)));
  $$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.go)));
  $$('[data-view-menu]').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.viewMenu)));
  $('#sidebar-open').addEventListener('click',()=>$('#sidebar').classList.add('open')); $('#sidebar-close').addEventListener('click',()=>$('#sidebar').classList.remove('open'));
  $('#profile-menu-button').addEventListener('click',()=>{const menu=$('#profile-menu');menu.classList.toggle('hidden');$('#profile-menu-button').setAttribute('aria-expanded',String(!menu.classList.contains('hidden')))});
  document.addEventListener('click',e=>{if(!e.target.closest('.topbar-actions'))$('#profile-menu').classList.add('hidden')});
  $('#logout-button').addEventListener('click',()=>{localStorage.removeItem(STORAGE.session);showAuth();});

  function getTracks(){return load(STORAGE.tracks,seedTracks)}
  function getEvents(){return load(STORAGE.events,seedEvents)}
  function getSamples(){return load(STORAGE.samples,seedSamples)}
  function getConversations(){return load(STORAGE.conversations,seedConversations)}
  function profileIdForConversation(c){
    if(c?.user?.profileId && seedPublicProfiles[c.user.profileId]) return c.user.profileId;
    const byName={KERA:'kera','Sample Lab':'samplelab',MIRA:'mira'};
    return byName[c?.user?.name] || null;
  }
  function getPublicProfile(id){return seedPublicProfiles[id] || null}
  function avatarMarkup(profile,extra=''){
    if(profile?.avatar) return `<img class="avatar avatar-photo ${extra}" src="${escapeHtml(profile.avatar)}" alt="Аватар ${escapeHtml(profile.name)}">`;
    return `<span class="avatar ${extra}">${escapeHtml(initials(profile?.name||'ND'))}</span>`;
  }
  function renderAll(){renderDashboard();renderRegistry();renderRoyalties();renderActivity();renderDeveloper();renderSamples();renderMessages();updateMessageBadge();resetHowDemo(false);updateTrackForm();}
  function renderDashboard(){
    const tracks=getTracks(); $('#metric-tracks').textContent=tracks.length;$('#metric-verified').textContent=tracks.filter(t=>t.status==='Подтверждено').length;$('#metric-derivatives').textContent=tracks.filter(t=>t.parent).length;
    $('#dashboard-track-table').innerHTML=tracks.slice(0,5).map(t=>`<tr><td><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.artist)}</small></td><td><code>${escapeHtml(t.id)}</code></td><td>${escapeHtml(t.type)}</td><td>${statusBadge(t.status)}</td><td><button class="row-action" data-open-track="${escapeHtml(t.id)}">Открыть</button></td></tr>`).join('');
    $$('[data-open-track]').forEach(btn=>btn.addEventListener('click',()=>{selectedRegistryId=btn.dataset.openTrack;navigate('registry');renderRegistry();}));
  }
  function renderActivity(){ $('#activity-list').innerHTML=activitySeed.map(([i,t,p])=>`<div class="activity-item"><span class="activity-dot">${i}</span><div><strong>${escapeHtml(t)}</strong><p>${escapeHtml(p)}</p></div></div>`).join(''); }
  function statusBadge(status){ const c=status==='Подтверждено'?'success':status==='С условиями'?'warning':'neutral';return `<span class="badge ${c}">${escapeHtml(status)}</span>`; }

  function renderRegistry(){
    const tracks=getTracks(),query=($('#registry-search')?.value||'').trim().toLowerCase(),filter=$('#registry-filter')?.value||'all';
    const filtered=tracks.filter(t=>(filter==='all'||t.type===filter)&&(!query||[t.title,t.artist,t.id,t.isrc].join(' ').toLowerCase().includes(query)));
    $('#registry-count').textContent=filtered.length;
    $('#registry-list').innerHTML=filtered.length?filtered.map(t=>`<button class="registry-item ${selectedRegistryId===t.id?'active':''}" data-registry-id="${escapeHtml(t.id)}"><div><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.artist)} · ${escapeHtml(t.type)}</p><code>${escapeHtml(t.id)} · ${escapeHtml(t.isrc||'ISRC не указан')}</code></div>${statusBadge(t.status)}</button>`).join(''):`<div class="empty-state"><h3>Ничего не найдено</h3><p>Измените запрос или фильтр.</p></div>`;
    $$('[data-registry-id]').forEach(btn=>btn.addEventListener('click',()=>{selectedRegistryId=btn.dataset.registryId;renderRegistry();}));
    const selected=tracks.find(t=>t.id===selectedRegistryId)||filtered[0]; if(selected){selectedRegistryId=selected.id;renderPassport(selected);} else $('#passport-panel').innerHTML='<div class="passport-empty"><div><strong>Выберите произведение</strong><p>Карточка цифрового паспорта появится здесь.</p></div></div>';
    populateParentSelect();
  }
  $('#registry-search').addEventListener('input',renderRegistry); $('#registry-filter').addEventListener('change',renderRegistry);

  function renderPassport(t){
    const parent=getTracks().find(x=>x.id===t.parent);
    $('#passport-panel').innerHTML=`<div class="passport-header"><div class="passport-mark"><div><span class="panel-kicker">ЦИФРОВОЙ ПАСПОРТ ПРАВ NORMALDANCE</span><h2>${escapeHtml(t.title)}</h2><p>${escapeHtml(t.artist)}</p></div><span class="verify-mark">✓</span></div><div class="passport-chips"><span class="chip">${escapeHtml(t.type)}</span><span class="chip">${escapeHtml(t.genre||'Жанр не указан')}</span><span class="chip">${escapeHtml(String(t.bpm||'—'))} BPM</span><span class="chip">AI: ${escapeHtml(t.aiLicense||'не задано')}</span></div></div>
      <div class="passport-section"><h3>Идентичность</h3><div class="passport-data"><div><span>NDP-ID</span><strong>${escapeHtml(t.id)}</strong></div><div><span>ISRC</span><strong>${escapeHtml(t.isrc||'—')}</strong></div><div><span>Статус</span><strong>${escapeHtml(t.status)}</strong></div><div><span>Дата регистрации</span><strong>${escapeHtml(t.created||'—')}</strong></div><div><span>Тональность</span><strong>${escapeHtml(t.key||'—')}</strong></div><div><span>Хронометраж</span><strong>${escapeHtml(t.duration||'—')}</strong></div></div></div>
      <div class="passport-section"><h3>Происхождение</h3><div class="passport-data"><div><span>Тип объекта</span><strong>${escapeHtml(t.type)}</strong></div><div><span>Родитель</span><strong>${parent?escapeHtml(parent.title):'Исходное произведение'}</strong></div></div></div>
      <div class="passport-section"><h3>Распределение прав</h3><div class="splitbar">${t.splits.map(s=>`<i style="width:${Number(s.share)||0}%"></i>`).join('')}</div><div class="split-list">${t.splits.map(s=>`<div class="split-line"><span>${escapeHtml(s.role)} · ${escapeHtml(s.name)}</span><strong>${Number(s.share)||0}%</strong></div>`).join('')}</div></div>
      <div class="passport-section"><h3>Перцептивная идентичность</h3><div class="mono-value">${escapeHtml(t.fingerprint||'ADNA · будет вычислен после подключения ядра')}</div></div>
      <div class="passport-section"><h3>Лицензирование ИИ</h3><div class="passport-data"><div><span>Политика</span><strong>${escapeHtml(t.aiLicense||'Не задана')}</strong></div><div><span>NDT</span><strong>v1 / демонстрация</strong></div></div></div>`;
  }

  // Verify
  $$('.verify-tab').forEach(btn=>btn.addEventListener('click',()=>{ $$('.verify-tab').forEach(x=>x.classList.toggle('active',x===btn));$$('[data-verify-pane]').forEach(p=>p.classList.toggle('active',p.dataset.verifyPane===btn.dataset.verifyTab));resetVerifyResult(); }));
  const uploadZone=$('#upload-zone'), fileInput=$('#verify-file');
  uploadZone.addEventListener('dragover',e=>{e.preventDefault();uploadZone.classList.add('drag')});uploadZone.addEventListener('dragleave',()=>uploadZone.classList.remove('drag'));uploadZone.addEventListener('drop',e=>{e.preventDefault();uploadZone.classList.remove('drag');if(e.dataTransfer.files[0])selectFile(e.dataTransfer.files[0])});
  fileInput.addEventListener('change',()=>fileInput.files[0]&&selectFile(fileInput.files[0]));
  function selectFile(file){if(file.size>32*1024*1024){notify('Файл слишком большой','Максимальный размер — 32 МБ.','error');return;}selectedFile=file;$('#selected-file').classList.remove('hidden');$('#selected-file-name').textContent=file.name;$('#selected-file-size').textContent=formatBytes(file.size);$('#verify-file-button').disabled=false;resetVerifyResult();}
  $('#clear-file').addEventListener('click',()=>{selectedFile=null;fileInput.value='';$('#selected-file').classList.add('hidden');$('#verify-file-button').disabled=true;resetVerifyResult();});
  function resetVerifyResult(){ $('#verify-empty').classList.remove('hidden');$('#analysis-state').classList.add('hidden');$('#verify-result').classList.add('hidden');$('#verify-result').innerHTML=''; }
  async function demoHashFile(file){
    const buf=await file.arrayBuffer(),bytes=new Uint8Array(buf);
    if(globalThis.crypto?.subtle?.digest){const hash=await crypto.subtle.digest('SHA-256',buf);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');}
    let h=2166136261;for(const b of bytes){h^=b;h=Math.imul(h,16777619)>>>0;}let out='';for(let i=0;i<8;i++){h=Math.imul(h^(i+1)*2654435761,16777619)>>>0;out+=h.toString(16).padStart(8,'0');}return out.slice(0,64);
  }
  function runAnalysis(resultFactory){
    $('#verify-empty').classList.add('hidden');$('#verify-result').classList.add('hidden');$('#analysis-state').classList.remove('hidden');const progress=$('#analysis-progress');progress.style.width='0';$$('.analysis-steps span').forEach(s=>s.classList.remove('done'));let step=0;
    const timer=setInterval(()=>{step++;progress.style.width=`${step*25}%`;const el=$(`.analysis-steps span[data-step="${step}"]`);el?.classList.add('done');if(step>=4){clearInterval(timer);setTimeout(async()=>{try{const r=await resultFactory();showVerifyResult(r);}catch{notify('Не удалось выполнить демонстрацию','Проверьте введённые данные.','error');resetVerifyResult();}},220)}},320);
  }
  function demoMatch(seed){const tracks=getTracks();const idx=seed%tracks.length;const t=tracks[idx];const similarity=seed%5===0?0.68:(seed%3===0?0.83:0.93+(seed%6)/100);const verdict=similarity>=.90?'same':similarity>=.75?'derivative':'different';return {track:t,similarity:Math.min(similarity,.99),verdict};}
  $('#verify-file-button').addEventListener('click',()=>{if(!selectedFile)return;runAnalysis(async()=>{const hash=await demoHashFile(selectedFile);const seed=parseInt(hash.slice(0,2),16);return {...demoMatch(seed),fingerprint:`ADNA-DEMO · ${hash.slice(0,4)}:${hash.slice(4,8)}:${hash.slice(8,12)}:${hash.slice(12,16)}`,source:selectedFile.name};});});
  $('#verify-fingerprint-button').addEventListener('click',()=>{const v=$('#fingerprint-input').value.replace(/\s+/g,'');if(v.length<20){notify('Недостаточно данных','Введите демонстрационный отпечаток длиной не менее 20 символов.','error');return;}runAnalysis(async()=>({...demoMatch([...v].reduce((a,c)=>a+c.charCodeAt(0),0)%256),fingerprint:`${v.startsWith('QTI')?'ADNA v2':'ADNA v1'} · входные данные`,source:'введённый отпечаток'}));});
  $('#verify-id-button').addEventListener('click',()=>{const v=$('#verify-id-input').value.trim().toUpperCase();const t=getTracks().find(x=>(x.isrc||'').toUpperCase()===v||x.id.toUpperCase()===v);runAnalysis(async()=>t?{track:t,similarity:1,verdict:'same',fingerprint:t.fingerprint,source:v}:{track:null,similarity:0,verdict:'different',fingerprint:'—',source:v});});
  function showVerifyResult(r){
    $('#analysis-state').classList.add('hidden');$('#verify-result').classList.remove('hidden');const same=r.verdict==='same',derivative=r.verdict==='derivative';const label=same?'Совпадение':derivative?'Вероятное производное':'Совпадений нет';const badge=same?'success':derivative?'warning':'neutral';
    $('#verify-result').innerHTML=r.track?`<div class="result-status">${statusBadge(label)}<strong>${Math.round(r.similarity*100)}%</strong></div><h3 class="result-title">${escapeHtml(r.track.title)}</h3><p class="result-artist">${escapeHtml(r.track.artist)}</p><div class="result-data"><div class="result-cell"><span>Вердикт</span><strong>${escapeHtml(label)}</strong></div><div class="result-cell"><span>Тип объекта</span><strong>${escapeHtml(r.track.type)}</strong></div><div class="result-cell"><span>NDP-ID</span><strong>${escapeHtml(r.track.id)}</strong></div><div class="result-cell"><span>ISRC</span><strong>${escapeHtml(r.track.isrc||'—')}</strong></div></div><div class="similarity"><div class="similarity-head"><span>Сходство</span><strong>${(r.similarity*100).toFixed(1)}%</strong></div><div class="similarity-bar"><i style="width:${r.similarity*100}%"></i></div></div><div class="result-cell"><span>Демо-отпечаток</span><strong class="mono-value">${escapeHtml(r.fingerprint)}</strong></div><div class="result-actions"><button class="button primary" id="open-result-track">Открыть паспорт</button><button class="button secondary" id="repeat-check">Новая проверка</button></div>`:`<div class="result-status">${statusBadge('Не найдено')}</div><h3 class="result-title">В реестре нет похожего произведения</h3><p class="result-artist">Демонстрационный результат. В реальном сервисе решение принимает движок ADNA.</p><div class="result-data"><div class="result-cell"><span>Максимальное сходство</span><strong>ниже 75%</strong></div><div class="result-cell"><span>Решение</span><strong>Можно продолжить регистрацию</strong></div></div><div class="result-actions"><button class="button primary" id="register-result-track">Зарегистрировать</button><button class="button secondary" id="repeat-check">Новая проверка</button></div>`;
    $('#open-result-track')?.addEventListener('click',()=>{selectedRegistryId=r.track.id;navigate('registry');renderRegistry();});$('#register-result-track')?.addEventListener('click',()=>navigate('register-track'));$('#repeat-check')?.addEventListener('click',resetVerifyResult);
  }

  // Registration wizard
  function populateParentSelect(){ const select=$('#track-parent');if(!select)return;const current=select.value;select.innerHTML='<option value="">Нет / исходное произведение</option>'+getTracks().map(t=>`<option value="${escapeHtml(t.id)}">${escapeHtml(t.title)} · ${escapeHtml(t.id)}</option>`).join('');select.value=current; }
  function updateTrackForm(){populateParentSelect();renderSplits();renderPreview();updateWizard();}
  function renderSplits(){
    $('#split-editor').innerHTML=splitRows.map((s,i)=>`<div class="split-row" data-split-row="${i}"><label class="field"><span>Роль</span><select data-split-field="role"><option ${s.role==='Автор'?'selected':''}>Автор</option><option ${s.role==='Продюсер'?'selected':''}>Продюсер</option><option ${s.role==='Артист'?'selected':''}>Артист</option><option ${s.role==='Правообладатель'?'selected':''}>Правообладатель</option><option ${s.role==='Источник сэмпла'?'selected':''}>Источник сэмпла</option></select></label><label class="field"><span>Имя / получатель</span><input data-split-field="name" value="${escapeHtml(s.name)}" placeholder="Имя участника"></label><label class="field"><span>Доля, %</span><input data-split-field="share" type="number" min="0" max="100" value="${Number(s.share)||0}"></label><button class="icon-button" type="button" data-remove-split="${i}" aria-label="Удалить">×</button></div>`).join('');
    $$('[data-split-row]').forEach(row=>row.querySelectorAll('[data-split-field]').forEach(input=>input.addEventListener('input',()=>{const i=Number(row.dataset.splitRow);splitRows[i][input.dataset.splitField]=input.dataset.splitField==='share'?Number(input.value):input.value;updateSplitTotal();renderPreview();})));
    $$('[data-remove-split]').forEach(btn=>btn.addEventListener('click',()=>{if(splitRows.length<=1)return;splitRows.splice(Number(btn.dataset.removeSplit),1);renderSplits();renderPreview();}));updateSplitTotal();
  }
  function updateSplitTotal(){const total=splitRows.reduce((a,s)=>a+(Number(s.share)||0),0);const el=$('#split-total-value');el.textContent=`${total}%`;el.className=total===100?'ok':'bad';}
  $('#add-split').addEventListener('click',()=>{splitRows.push({role:'Автор',name:'',share:0});renderSplits();renderPreview();});
  $$('input[name="ai-license"]').forEach(r=>r.addEventListener('change',()=>{$$('.option-card').forEach(c=>c.classList.toggle('selected',c.contains(r)&&r.checked));renderPreview();}));
  ['track-title','track-artist','track-isrc','track-type','track-genre','track-bpm','track-parent','track-license-note'].forEach(id=>$('#'+id).addEventListener('input',renderPreview));
  function registrationData(){return{title:$('#track-title').value.trim()||'Без названия',artist:$('#track-artist').value.trim()||'Исполнитель не указан',isrc:$('#track-isrc').value.trim().toUpperCase(),type:$('#track-type').value,genre:$('#track-genre').value.trim()||'—',bpm:$('#track-bpm').value||'—',parent:$('#track-parent').value||null,aiLicense:$('input[name="ai-license"]:checked')?.value||'Не задано',licenseNote:$('#track-license-note').value.trim(),splits:splitRows};}
  function renderPreview(){const d=registrationData(),total=splitRows.reduce((a,s)=>a+(Number(s.share)||0),0);$('#preview-passport').innerHTML=`<span class="panel-kicker">ЦИФРОВОЙ ПАСПОРТ ПРАВ NORMALDANCE</span><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.artist)}</p><div class="preview-id">NDP-ID · БУДЕТ СОЗДАН ПОСЛЕ РЕГИСТРАЦИИ</div><div class="passport-chips"><span class="chip">${escapeHtml(d.type)}</span><span class="chip">${escapeHtml(d.genre)}</span><span class="chip">${escapeHtml(String(d.bpm))} BPM</span></div><div class="passport-section"><h3>Права · ${total}%</h3><div class="splitbar">${d.splits.map(s=>`<i style="width:${Number(s.share)||0}%"></i>`).join('')}</div>${d.splits.map(s=>`<div class="split-line"><span>${escapeHtml(s.role)} · ${escapeHtml(s.name||'не указан')}</span><strong>${Number(s.share)||0}%</strong></div>`).join('')}</div><div class="passport-section"><h3>Лицензия ИИ</h3><strong>${escapeHtml(d.aiLicense)}</strong></div>`;if(wizardStep===4)renderReview();}
  function updateWizard(){ $$('.wizard-step').forEach(b=>{const n=Number(b.dataset.wizardStep);b.classList.toggle('active',n===wizardStep);b.classList.toggle('done',n<wizardStep)});$$('[data-wizard-pane]').forEach(p=>p.classList.toggle('active',Number(p.dataset.wizardPane)===wizardStep));$('#wizard-back').disabled=wizardStep===1;$('#wizard-next').textContent=wizardStep===4?'Зарегистрировать произведение':'Продолжить';if(wizardStep===4)renderReview(); }
  $$('.wizard-step').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.wizardStep);if(n<=wizardStep){wizardStep=n;updateWizard();}}));
  $('#wizard-back').addEventListener('click',()=>{if(wizardStep>1){wizardStep--;updateWizard();}});
  $('#wizard-next').addEventListener('click',()=>{
    const err=$('#track-form-error');err.textContent='';const d=registrationData();
    if(wizardStep===1 && (!$('#track-title').value.trim()||!$('#track-artist').value.trim())){err.textContent='Укажите название произведения и исполнителя.';return;}
    if(wizardStep===2){const total=splitRows.reduce((a,s)=>a+(Number(s.share)||0),0);if(total!==100||splitRows.some(s=>!s.name.trim())){err.textContent='Заполните всех участников. Сумма долей должна быть ровно 100%.';return;}}
    if(wizardStep<4){wizardStep++;updateWizard();return;}
    if(!$('#track-confirm').checked){err.textContent='Подтвердите корректность сведений.';return;}
    registerNewTrack(d);
  });
  function renderReview(){const d=registrationData(),parent=getTracks().find(t=>t.id===d.parent);$('#registration-review').innerHTML=`<div class="review-title"><div><span class="panel-kicker">Готово к регистрации</span><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.artist)}</p></div>${statusBadge('Черновик')}</div><div class="review-grid"><div><span>Тип</span><strong>${escapeHtml(d.type)}</strong></div><div><span>ISRC</span><strong>${escapeHtml(d.isrc||'будет добавлен позже')}</strong></div><div><span>Происхождение</span><strong>${escapeHtml(parent?parent.title:'Исходное')}</strong></div><div><span>Лицензия ИИ</span><strong>${escapeHtml(d.aiLicense)}</strong></div><div><span>Участников</span><strong>${d.splits.length}</strong></div><div><span>Сумма долей</span><strong>${d.splits.reduce((a,s)=>a+(Number(s.share)||0),0)}%</strong></div></div>`;}
  function registerNewTrack(d){const tracks=getTracks();const id=randomId();const track={id,isrc:d.isrc||`RU-NDP-${String(new Date().getFullYear()).slice(-2)}-${String(90000+tracks.length+1)}`,title:d.title,artist:d.artist,type:d.type,genre:d.genre,bpm:Number(d.bpm)||null,key:'—',duration:'—',label:'Независимый',parent:d.parent,status:'Подтверждено',aiLicense:d.aiLicense,created:today(),fingerprint:'ADNA-ДЕМО · ожидает подключения реального движка',splits:d.splits.map(s=>({...s}))};tracks.unshift(track);save(STORAGE.tracks,tracks);selectedRegistryId=id;wizardStep=1;splitRows=[{role:'Автор',name:'',share:70},{role:'Продюсер',name:'',share:30}];$('#track-form').reset();$('#track-confirm').checked=false;renderAll();navigate('registry');notify('Произведение зарегистрировано',`${d.title} добавлено в локальный реестр.`);}

  // Royalties
  function renderRoyalties(){const events=getEvents();$('#royalty-events').innerHTML=events.map(e=>`<div class="royalty-event"><span class="royalty-date">${escapeHtml(e.date)}</span><i class="event-dot"></i><div><h3>${escapeHtml(e.kind)}</h3><p>${escapeHtml(e.text)}</p></div><div class="royalty-amount"><strong>${escapeHtml(e.amount)}</strong><small>${escapeHtml(e.status)}</small></div></div>`).join('');}


  // Sample library
  function sampleStatusClass(status){return status==='В продаже'?'success':status==='Обмен'?'warning':'neutral';}
  function waveformBars(seed=1,count=34){let x=seed;return Array.from({length:count},()=>{x=(x*9301+49297)%233280;const h=18+Math.round((x/233280)*72);return `<i style="height:${h}%"></i>`}).join('');}
  function renderSamples(){
    const root=$('#sample-grid'); if(!root)return;
    const query=($('#sample-search')?.value||'').trim().toLowerCase(), filter=$('#sample-filter')?.value||'all';
    const samples=getSamples().filter(s=>(filter==='all'||s.status===filter)&&(!query||[s.title,s.id,s.kind,...s.tags].join(' ').toLowerCase().includes(query)));
    root.innerHTML=samples.length?samples.map((s,i)=>`<article class="sample-card ${selectedSampleId===s.id?'focused':''}" data-sample-card="${escapeHtml(s.id)}"><div class="sample-cover ${escapeHtml(s.color||'violet')}"><button class="sample-play" type="button" data-play-sample="${escapeHtml(s.id)}" aria-label="Воспроизвести ${escapeHtml(s.title)}">▶</button><div class="mini-wave">${waveformBars(i+3,22)}</div><span>${escapeHtml(s.duration)}</span></div><div class="sample-body"><div class="sample-title"><div><span class="panel-kicker">${escapeHtml(s.kind)}</span><h3>${escapeHtml(s.title)}</h3></div><span class="badge ${sampleStatusClass(s.status)}">${escapeHtml(s.status)}</span></div><code>${escapeHtml(s.id)}</code><div class="sample-specs"><span>${s.bpm?`${s.bpm} BPM`:'One-shot'}</span><span>${escapeHtml(s.key||'—')}</span><span>${s.uses} использ.</span></div><div class="sample-tags">${s.tags.map(t=>`<span>#${escapeHtml(t)}</span>`).join('')}</div><div class="sample-license"><span>Лицензия</span><strong>${escapeHtml(s.license)}</strong><small>Downstream: ${escapeHtml(s.downstream)}</small></div><div class="sample-footer"><strong>${escapeHtml(s.price)}</strong><button class="text-button" type="button" data-sample-message="${escapeHtml(s.id)}">Обсудить →</button></div></div></article>`).join(''):`<div class="empty-state"><h3>Сэмплы не найдены</h3><p>Измените фильтр или поисковый запрос.</p></div>`;
    $$('[data-play-sample]').forEach(btn=>btn.addEventListener('click',()=>toggleSamplePlay(btn)));
    $$('[data-sample-message]').forEach(btn=>btn.addEventListener('click',()=>openConversationForSample(btn.dataset.sampleMessage)));
    if(selectedSampleId){requestAnimationFrame(()=>{const card=$(`[data-sample-card="${CSS.escape(selectedSampleId)}"]`);card?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>{card?.classList.remove('focused');selectedSampleId=null;},1700);});}
  }
  function toggleSamplePlay(btn){
    if(samplePlayTimer){clearTimeout(samplePlayTimer);samplePlayTimer=null;$$('.sample-card.playing').forEach(c=>c.classList.remove('playing'));$$('.sample-play').forEach(b=>b.textContent='▶');}
    const card=btn.closest('.sample-card'); if(btn.dataset.active==='1'){btn.dataset.active='0';return;}
    $$('.sample-play').forEach(b=>b.dataset.active='0');btn.dataset.active='1';btn.textContent='■';card.classList.add('playing');notify('Демо-прослушивание',card.querySelector('h3')?.textContent||'Сэмпл');
    samplePlayTimer=setTimeout(()=>{btn.dataset.active='0';btn.textContent='▶';card.classList.remove('playing');samplePlayTimer=null;},4200);
  }
  $('#sample-search')?.addEventListener('input',renderSamples);$('#sample-filter')?.addEventListener('change',renderSamples);
  $('#add-demo-sample')?.addEventListener('click',()=>{const samples=getSamples();const n=samples.length+1;samples.unshift({id:`ND-SMP-DEMO-${String(n).padStart(3,'0')}`,title:`Новый сэмпл ${n}`,kind:'One-shot',duration:'00:04',bpm:null,key:'A',tags:['demo','new'],status:'Не продаётся',price:'—',license:'Не задана',downstream:'—',uses:0,color:'violet'});save(STORAGE.samples,samples);renderSamples();notify('Сэмпл добавлен','Новая демонстрационная карточка сохранена локально.');});

  // Personal messages
  function updateMessageBadge(){const n=getConversations().reduce((sum,c)=>sum+(Number(c.unread)||0),0),el=$('#message-unread');if(el){el.textContent=n;el.classList.toggle('hidden',!n);}}
  function renderMessages(){
    const list=$('#conversation-list');if(!list)return;let conversations=getConversations();
    if(currentView==='messages'){const opened=conversations.find(c=>c.id===selectedConversationId);if(opened&&opened.unread){opened.unread=0;save(STORAGE.conversations,conversations);}}
    const q=($('#conversation-search')?.value||'').trim().toLowerCase();const filtered=conversations.filter(c=>!q||[c.user.name,c.user.role,c.deal,c.offer,getSamples().find(s=>s.id===c.sampleId)?.title||''].join(' ').toLowerCase().includes(q));
    $('#conversation-count').textContent=filtered.length;list.innerHTML=filtered.length?filtered.map(c=>{const last=c.messages[c.messages.length-1],profile=getPublicProfile(profileIdForConversation(c));return `<button class="conversation-item ${c.id===selectedConversationId?'active':''}" data-conversation="${escapeHtml(c.id)}">${avatarMarkup(profile)}<div><div><strong>${escapeHtml(c.user.name)}</strong><time>${escapeHtml(last?.time||'')}</time></div><span class="deal-kind">${escapeHtml(c.deal)}</span><p>${escapeHtml(last?.text||'')}</p></div>${c.unread?`<b class="unread-count">${c.unread}</b>`:''}</button>`}).join(''):`<div class="empty-state"><h3>Диалоги не найдены</h3><p>Измените поисковый запрос.</p></div>`;
    $$('[data-conversation]').forEach(btn=>btn.addEventListener('click',()=>selectConversation(btn.dataset.conversation)));
    let selected=conversations.find(c=>c.id===selectedConversationId)||filtered[0]||conversations[0];if(selected){selectedConversationId=selected.id;renderChat(selected);}updateMessageBadge();
  }
  function selectConversation(id){selectedConversationId=id;const conversations=getConversations(),c=conversations.find(x=>x.id===id);if(c){c.unread=0;save(STORAGE.conversations,conversations);}renderMessages();}
  function renderChat(c){
    const sample=getSamples().find(s=>s.id===c.sampleId),profileId=profileIdForConversation(c),profile=getPublicProfile(profileId);
    $('#chat-head').innerHTML=`<button class="chat-person chat-person-button" type="button" data-open-user-profile="${escapeHtml(profileId||'')}" aria-label="Открыть профиль ${escapeHtml(c.user.name)}">${avatarMarkup(profile)}<div><h3>${escapeHtml(c.user.name)} <span class="verified-mini" title="Профиль подтверждён NDP">✓</span></h3><p>${escapeHtml(c.user.role)} · ${profile?.online?'<span class="online-text">онлайн</span>':'не в сети'} · <span class="open-profile-hint">открыть профиль</span></p></div></button><div class="chat-head-actions"><button class="button secondary small" type="button" data-open-user-profile="${escapeHtml(profileId||'')}">Профиль</button><button class="button secondary small" type="button" data-open-chat-sample="${escapeHtml(c.sampleId)}">Открыть сэмпл</button></div>`;
    $('#chat-context').innerHTML=`<div><span class="deal-pill">${escapeHtml(c.deal)}</span><strong>${escapeHtml(sample?.title||c.sampleId)}</strong><code>${escapeHtml(c.sampleId)}</code></div><div><span>Предложение</span><strong>${escapeHtml(c.offer)}</strong></div>`;
    $('#chat-messages').innerHTML=c.messages.map(m=>`<div class="message ${m.from==='me'?'out':'in'}"><div>${escapeHtml(m.text)}</div><time>${escapeHtml(m.time)}</time></div>`).join('');
    $('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;
    $$('[data-open-user-profile]').forEach(btn=>btn.addEventListener('click',()=>openPublicProfile(btn.dataset.openUserProfile,c.id)));
    $('[data-open-chat-sample]')?.addEventListener('click',e=>{selectedSampleId=e.currentTarget.dataset.openChatSample;navigate('account');renderSamples();});
  }
  function currentConversation(){return getConversations().find(c=>c.id===selectedConversationId)}
  function saveConversationMessage(from,text){const conversations=getConversations(),c=conversations.find(x=>x.id===selectedConversationId);if(!c)return;c.messages.push({from,time:'сейчас',text});if(from==='them')c.unread=currentView==='messages'?0:(c.unread||0)+1;save(STORAGE.conversations,conversations);renderMessages();}
  $('#conversation-search')?.addEventListener('input',renderMessages);
  $('#message-form')?.addEventListener('submit',e=>{e.preventDefault();const input=$('#message-input'),text=input.value.trim();if(!text)return;saveConversationMessage('me',text);input.value='';notify('Сообщение отправлено','Диалог сохранён локально.');});
  const incomingReplies={
    'conv-kera':['Да, фиксируем 4 500 ₽ и 10% downstream. Можешь сформировать предложение.','Проверил NDP-ID — источник и доли отображаются корректно. Готов принять лицензию.'],
    'conv-samplelab':['Манифест посмотрел. 5% downstream устраивает, покупку подтверждаю.','Пришли финальную версию лицензии — после этого можем закрывать сделку.'],
    'conv-mira':['Мой пакет уже зарегистрирован. Могу прислать NDP-ID для взаимной привязки.','Согласен на обмен. Давай зафиксируем обе лицензии как взаимные без разовой оплаты.']
  };
  $('#simulate-incoming')?.addEventListener('click',()=>{const c=currentConversation();if(!c)return;const arr=incomingReplies[c.id]||['Предложение получил. Давай продолжим обсуждение условий.'];const text=arr[c.messages.filter(m=>m.from==='them').length%arr.length];saveConversationMessage('them',text);notify('Новое сообщение',`${c.user.name}: ${text.slice(0,58)}${text.length>58?'…':''}`);});
  function openConversationForSample(sampleId){const c=getConversations().find(x=>x.sampleId===sampleId);if(c){selectedConversationId=c.id;navigate('messages');renderMessages();return;}notify('Диалог пока не создан','Для этого сэмпла в демо нет готового собеседника.');}

  // Public profiles for message participants
  function openPublicProfile(profileId,conversationId=selectedConversationId){
    if(!getPublicProfile(profileId)){notify('Профиль недоступен','Для этого пользователя демо-профиль не найден.','error');return;}
    selectedPublicProfileId=profileId;if(conversationId)selectedConversationId=conversationId;navigate('user-profile');
  }
  function renderPublicProfile(){
    const p=getPublicProfile(selectedPublicProfileId)||seedPublicProfiles.kera;if(!p)return;
    $('#public-profile-avatar').src=p.avatar;$('#public-profile-avatar').alt=`Аватар ${p.name}`;
    $('#public-profile-name').textContent=p.name;$('#public-profile-role').textContent=p.role;$('#public-profile-location').textContent=p.location;
    $('#public-profile-joined').textContent=p.joined;$('#public-profile-response').textContent=p.response;$('#public-profile-id').textContent=p.ndpId;
    $('#public-profile-bio').textContent=p.bio;$('#public-profile-genres').textContent=p.genres.join(' · ');$('#public-profile-specialties').textContent=p.specialties.join(' · ');$('#public-profile-policy').textContent=p.policy;
    const online=$('#public-profile-online');online.classList.toggle('offline',!p.online);online.title=p.online?'Онлайн':'Не в сети';
    const verified=$('#public-profile-verified');verified.textContent=p.verified?'✓ NDP VERIFIED':'НЕ ПОДТВЕРЖДЁН';verified.classList.toggle('success',p.verified);verified.classList.toggle('neutral',!p.verified);
    $('#public-profile-stats').innerHTML=`<article><strong>${p.stats.works}</strong><span>произведений</span></article><article><strong>${p.stats.samples}</strong><span>сэмплов</span></article><article><strong>${p.stats.deals}</strong><span>сделок</span></article><article><strong>${p.stats.derivatives}</strong><span>производных</span></article>`;
    $('#public-profile-rating').textContent=`${p.rating.toFixed(1)} / 5`;$('#public-profile-rating-bar').style.width=`${Math.min(100,p.rating/5*100)}%`;$('#public-profile-rating-note').textContent=p.ratingNote;
    $('#public-profile-catalog-count').textContent=p.catalog.length;
    $('#public-profile-catalog').innerHTML=p.catalog.map(item=>`<article class="public-catalog-item"><div><span class="panel-kicker">${escapeHtml(item.type)}</span><h4>${escapeHtml(item.title)}</h4><code>${escapeHtml(item.id)}</code></div><div class="public-catalog-meta"><span class="badge ${item.status==='В продаже'?'success':item.status==='Обмен'?'warning':'neutral'}">${escapeHtml(item.status)}</span><small>${escapeHtml(item.license)}</small><strong>${escapeHtml(item.price)}</strong></div></article>`).join('');
  }
  $('#public-profile-back')?.addEventListener('click',()=>{navigate('messages');renderMessages();});
  $('#public-profile-message')?.addEventListener('click',()=>{
    const p=getPublicProfile(selectedPublicProfileId),c=getConversations().find(x=>profileIdForConversation(x)===p?.id);
    if(c)selectedConversationId=c.id;navigate('messages');renderMessages();requestAnimationFrame(()=>$('#message-input')?.focus());
  });
  $('#public-profile-copy-id')?.addEventListener('click',async()=>{
    const p=getPublicProfile(selectedPublicProfileId);if(!p)return;
    try{await navigator.clipboard?.writeText(p.ndpId);notify('NDP-ID скопирован',p.ndpId);}catch{notify('NDP-ID',p.ndpId);}
  });

  // How it works demo
  function logHow(text,reset=false){const root=$('#how-demo-log');if(!root)return;if(reset)root.innerHTML='';const row=document.createElement('span');row.textContent=`${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit',second:'2-digit'})} · ${text}`;root.append(row);root.scrollTop=root.scrollHeight;}
  function showHowStep(step){howDemoStep=Math.max(1,Math.min(3,Number(step)||1));$$('[data-how-step]').forEach(b=>b.classList.toggle('active',Number(b.dataset.howStep)===howDemoStep));$$('[data-how-pane]').forEach(p=>p.classList.toggle('active',Number(p.dataset.howPane)===howDemoStep));}
  $$('[data-how-step]').forEach(b=>b.addEventListener('click',()=>showHowStep(b.dataset.howStep)));
  function resetHowDemo(writeLog=true){
    howDemoStep=1;showHowStep(1);if($('#demo-fingerprint'))$('#demo-fingerprint').textContent='—';if($('#demo-similarity'))$('#demo-similarity').textContent='0,00';if($('#demo-similarity-bar'))$('#demo-similarity-bar').style.width='0%';if($('#adna-demo-state'))$('#adna-demo-state').textContent='ГОТОВО';if($('#adna-demo-result'))$('#adna-demo-result').innerHTML='<span>◎</span><div><strong>Анализ не запущен</strong><small>Запустите сценарий или этот этап отдельно.</small></div>';if($('#registry-demo-state'))$('#registry-demo-state').textContent='ОЖИДАЕТ ADNA';if($('#graph-resolve'))$('#graph-resolve').innerHTML='<strong>0 / 3</strong><small>узлов прав разрешено</small>';$$('[data-rights-node]').forEach(n=>n.classList.remove('resolved'));if($('#payout-demo-state'))$('#payout-demo-state').textContent='ОЖИДАЕТ ПРАВА';$$('[data-payout]').forEach(x=>x.textContent='0 ₽');if($('#payout-total'))$('#payout-total').textContent='0 ₽ / 1 000 ₽';if(writeLog)logHow('Демонстрация сброшена.',true);
  }
  async function runAdnaDemo(){showHowStep(1);$('#adna-demo-state').textContent='АНАЛИЗ';$('#adna-waveform').classList.add('scanning');$('#demo-fingerprint').textContent='вычисление спектрограммы…';logHow('Получен аудиофрагмент metro_break_172.wav. Строится 256-байтный ADNA-отпечаток.');await delay(650);$('#demo-fingerprint').textContent='8f4c91aa02de…43bc020178ca';$('#demo-similarity').textContent='0,97';$('#demo-similarity-bar').style.width='97%';await delay(550);$('#adna-waveform').classList.remove('scanning');$('#adna-demo-state').textContent='MATCH';$('#adna-demo-result').innerHTML='<span>✓</span><div><strong>Совпадение подтверждено · 0,97</strong><small>Найден зарегистрированный источник: «Стеклянные барабаны».</small></div>';$('#registry-demo-state').textContent='ГОТОВО';logHow('Сходство 0,97 ≥ 0,95. Объект сопоставлен с NDP-ID ND-SMP-43BC-0201.');}
  async function runRegistryDemo(){showHowStep(2);$('#registry-demo-state').textContent='RESOLVING';logHow('Реестр раскрывает связи «производное → исходное» и манифесты прав.');const nodes=$$('[data-rights-node]');for(let i=0;i<nodes.length;i++){await delay(380);nodes[i].classList.add('resolved');$('#graph-resolve').innerHTML=`<strong>${i+1} / 3</strong><small>узлов прав разрешено</small>`;}$('#registry-demo-state').textContent='РАЗРЕШЕНО';$('#payout-demo-state').textContent='ГОТОВО';logHow('Цепочка разрешена: сэмпл → исходный трек → производное произведение. Найдены условия downstream.');}
  async function runPayoutDemo(){showHowStep(3);$('#payout-demo-state').textContent='РАСЧЁТ';logHow('Получено событие использования на 1 000 ₽. Выполняется каскадный расчёт сплитов.');let total=0;for(const el of $$('[data-payout]')){await delay(280);const value=Number(el.dataset.payout);total+=value;el.textContent=`${value.toLocaleString('ru-RU')} ₽`;$('#payout-total').textContent=`${total.toLocaleString('ru-RU')} ₽ / 1 000 ₽`;}$('#payout-demo-state').textContent='РАСПРЕДЕЛЕНО';logHow('1 000 ₽ полностью распределены. Расчётный слой подготовил выплаты правообладателям через выбранный платёжный рельс.');}
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  $('#run-adna-demo')?.addEventListener('click',runAdnaDemo);$('#run-registry-demo')?.addEventListener('click',runRegistryDemo);$('#run-payout-demo')?.addEventListener('click',runPayoutDemo);$('#reset-how-demo')?.addEventListener('click',()=>resetHowDemo(true));
  $('#run-how-demo')?.addEventListener('click',async e=>{const btn=e.currentTarget;btn.disabled=true;resetHowDemo(true);logHow('Запущен сквозной сценарий ADNA → реестр прав → распределение.');await runAdnaDemo();await delay(350);await runRegistryDemo();await delay(350);await runPayoutDemo();btn.disabled=false;notify('Сценарий завершён','ADNA, цепочка прав и распределение выплаты показаны последовательно.');});

  // Developer
  function renderDeveloper(key='identify'){const e=endpointExamples[key];$('#code-title').textContent=e.title;$('#code-example').textContent=e.code;$$('.endpoint').forEach(x=>x.classList.toggle('active',x.dataset.endpoint===key));}
  $$('.endpoint').forEach(btn=>btn.addEventListener('click',()=>renderDeveloper(btn.dataset.endpoint))); $('#copy-code').addEventListener('click',async()=>{await navigator.clipboard?.writeText($('#code-example').textContent);notify('Пример скопирован','Код помещён в буфер обмена.');});

  // Profile & settings
  $('#profile-form').addEventListener('submit',e=>{e.preventDefault();currentUser={...currentUser,name:$('#profile-name').value.trim(),role:$('#profile-role').value};save(STORAGE.user,currentUser);hydrateUser();notify('Профиль обновлён','Изменения сохранены локально.');});
  $('#notifications-toggle').checked=localStorage.getItem(STORAGE.notifications)!=='0';$('#notifications-toggle').addEventListener('change',e=>localStorage.setItem(STORAGE.notifications,e.target.checked?'1':'0'));
  $('#reset-demo').addEventListener('click',()=>{if(!confirm('Сбросить локальные данные демонстрации?'))return;[STORAGE.user,STORAGE.session,STORAGE.tracks,STORAGE.events,STORAGE.samples,STORAGE.conversations].forEach(k=>localStorage.removeItem(k));ensureSeed();showAuth();notify('Данные сброшены','Демонстрационный реестр восстановлен.');});

  window.addEventListener('hashchange',()=>{if(localStorage.getItem(STORAGE.session)==='1')navigate(location.hash.replace('#','')||'dashboard',false)});
  if(localStorage.getItem(STORAGE.session)==='1') showApp(); else showAuth();
})();
