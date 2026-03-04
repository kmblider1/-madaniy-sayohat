/* ══════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════ */
const USERS=[
  {id:1,name:"Abdullayev Sardor",group:"KT-301",role:"student",email:"sardor@mail.uz",password:"123",avatar:"SA"},
  {id:2,name:"Karimova Nilufar",group:"KT-301",role:"student",email:"nilufar@mail.uz",password:"123",avatar:"KN"},
  {id:3,name:"Prof. Yakubbayev M.",group:"",role:"teacher",email:"teacher@mail.uz",password:"123",avatar:"YM"},
];
const BLOOM_LEVELS={eslash:{icon:"🧠",label:"Eslash",color:"#5B5FC7",order:1},tushunish:{icon:"💡",label:"Tushunish",color:"#7B5FB8",order:2},qollash:{icon:"🔧",label:"Qo'llash",color:"#3A9E7E",order:3},tahlil:{icon:"🔬",label:"Tahlil",color:"#D4943A",order:4},baholash:{icon:"⚖️",label:"Baholash",color:"#E8604C",order:5},yaratish:{icon:"🎨",label:"Yaratish",color:"#9E5FA0",order:6}};
const STUDENT_LEVELS=["B1","B2","C1"];
let studentLevel="B1";
const MODULES=[
  {id:1,title:"Koreys oilaviy qadriyatlari",status:"done",score:88,date:"2026-02-03",desc:"Oila, 효도, hurmat",
    topics:["효도 (Ota-onaga hurmat)","Oilaviy iyerarxiya","Bayramlar: 설날, 추석","Ota-onalar kuni: 어버이날"],
    tasks:[
      {t:"📖 Darslik 12-13 bet o'qing: Koreys oilasi haqida 3 ta fakt yozing",done:true,bloom:"eslash",level:"B1"},
      {t:"📖 Darslik 14 bet: 절 (ta'zim) turlarini sanab chiqing",done:true,bloom:"eslash",level:"B1"},
      {t:"SKY Castle 1-qism ko'rish (subtitirli, 0.75x)",done:true,bloom:"eslash",level:"B1"},
      {t:"SKY Castle 1-qism ko'rish (subtitrsiz, normal tezlik)",done:true,bloom:"eslash",level:"C1"},
      {t:"📖 효도 tushunchasi haqida esse (300 so'z) — darslik 12 betdan foydalaning",done:true,bloom:"yaratish",level:"B1"},
      {t:"📖 O'zbek va koreys oilasini solishtiring (darslik 13-bet oila a'zolari sxemasi asosida)",done:true,bloom:"tahlil",level:"B2"},
      {t:"Oilaviy qadriyatlar debati: 효도 zamonaviy hayotda kerakmi?",done:true,bloom:"baholash",level:"B2"},
      {t:"📖 Lug'atga 8 ta oila so'zini qo'shing: 할아버지, 외삼촌, 이모... (darslik 13-bet)",done:true,bloom:"eslash",level:"B1"}
    ],
    media:[
      {title:"SKY Castle — 1-qism",type:"video",url:"https://www.youtube.com/embed/KSE5Mbi8d2w",tip:"B1: 0.75x tezlik + subtitirlar | C1: normal tezlik, subtitrsiz"},
      {title:"Koreys oilasi haqida (oddiy tushuntirish)",type:"video",url:"https://www.youtube.com/embed/1YZJqkPGi3o",tip:"B1 uchun mos — sekin nutq, subtitirli"},
      {title:"어머니 — Kim Kwang-seok",type:"audio",url:"https://www.youtube.com/embed/oqFMNW7vfmM",tip:"Tinglang va asosiy so'zlarni yozing"}
    ],
    resources:["📖 Confucian Ethics","📚 Darslik: 6-15, 18-27 bet"],
    keyVocab:["효도","가족","어른","존경","족보","세배","절","어버이날"]},
  {id:2,title:"Ish madaniyati va 빨리빨리",status:"done",score:92,date:"2026-02-17",desc:"Korporativ madaniyat",
    topics:["회식 (Jamoaviy kechki ovqat)","선배/후배 tizimi","빨리빨리 madaniyati","Chaebol tizimlari: Samsung, LG, Hyundai"],
    tasks:[
      {t:"📖 Darslik 36-37 bet: ovqat odobi qoidalarini 5 ta yozing",done:true,bloom:"eslash",level:"B1"},
      {t:"📖 Darslik 40-41 bet: 김치 turlari va 김장 haqida tushuntiring",done:true,bloom:"tushunish",level:"B1"},
      {t:"Samsung reklama ko'rish va 빨리빨리 madaniyatini tushuntiring",done:true,bloom:"tushunish",level:"B1"},
      {t:"Misaeng vebtun tahlili — ofis madaniyati",done:true,bloom:"tahlil",level:"B2"},
      {t:"COIL: Koreya talabasi bilan suhbat",done:true,bloom:"qollash",level:"B2"},
      {t:"📖 선배/후배 tizimini O'zbek hurmat bilan solishtiring (darslik 14-bet)",done:true,bloom:"tahlil",level:"C1"},
      {t:"Ish madaniyati esse (300 so'z)",done:true,bloom:"yaratish",level:"B1"},
      {t:"📖 Koreya kompaniyasiga ariza xati yozing (rasmiy uslub — darslik 14-bet asosida)",done:true,bloom:"yaratish",level:"B2"}
    ],
    media:[
      {title:"Samsung reklama tahlili",type:"video",url:"https://www.youtube.com/embed/PNKiFmFhkYk",tip:"Brendlash strategiyasiga e'tibor bering"},
      {title:"Misaeng — ofis hayoti",type:"video",url:"https://www.youtube.com/embed/JjCKjMfnmxk",tip:"B1: koreyscha subtitirlar bilan | B2: subtitrsiz"},
      {title:"빨리빨리 madaniyati tushuntirish",type:"video",url:"https://www.youtube.com/embed/5u5M4g3Gzso",tip:"Oddiy til — B1 uchun mos"}
    ],
    resources:["📖 Samsung Way","📊 KOTRA hisoboti","📚 Darslik: 36-45, 48-51 bet"],
    keyVocab:["빨리빨리","회식","선배","후배","상차리기","김치","김장","숟가락"]},
  {id:3,title:"Hurmat tizimi (존댓말)",status:"active",score:null,date:"2026-03-03",desc:"Rasmiy/norasmiy nutq",
    topics:["존댓말 vs 반말","Yosh/mavqe bo'yicha murojaat","Ish yerida so'zlashuv uslubi","호칭 — murojaat shakllari"],
    tasks:[
      {t:"📖 Darslik 14-15 bet o'qing: 절 turlari va salomlashish haqida yozing",done:false,bloom:"eslash",level:"B1"},
      {t:"📖 존댓말 va 반말 farqini tushuntiring (평절 va 큰절 misolida)",done:false,bloom:"tushunish",level:"B1"},
      {t:"📖 Rasmiy/norasmiy dialog yozing (5 satr) — darslik 14-bet asosida",done:false,bloom:"qollash",level:"B1"},
      {t:"📖 Rasmiy/norasmiy dialog yozing (15 satr, 3 holat: oila, ish, maktab)",done:false,bloom:"qollash",level:"C1"},
      {t:"Debat: Hurmat tizimi — zamonaviy hayotda kerakmi?",done:false,bloom:"baholash",level:"B2"},
      {t:"Reply 1988 — til uslubini tahlil qiling (존댓말 vs 반말)",done:false,bloom:"tahlil",level:"B2"},
      {t:"📖 Kundalikda refleksiya: O'zbek va koreys salom berishdagi farq (darslik 14-15 bet)",done:false,bloom:"yaratish",level:"B1"},
      {t:"Viktorina: 10+ to'g'ri javob (darslik savollari)",done:false,bloom:"eslash",level:"B1"}
    ],
    media:[
      {title:"존댓말 vs 반말 tushuntirish",type:"video",url:"https://www.youtube.com/embed/Ij_0MlHHSgc",tip:"B1: 0.75x tezlik + koreyscha subtitirlar"},
      {title:"Reply 1988 — oilaviy dialog",type:"video",url:"https://www.youtube.com/embed/iEXQGWcnl8A",tip:"Rasmiy va norasmiy nutqga e'tibor bering"},
      {title:"Koreyscha salomlashish",type:"video",url:"https://www.youtube.com/embed/0me4Pr2lmzA",tip:"Oddiy — B1 uchun perfect"}
    ],
    resources:["📖 Korean Honorifics Guide","📚 Darslik: 14-15 bet (salom)"],
    keyVocab:["존댓말","반말","호칭","경어","평절","큰절","인사","예절"]},
  {id:4,title:"Ta'lim tizimi",status:"locked",score:null,date:"2026-03-17",desc:"수능, hakwon",
    topics:["수능 — milliy imtihon","학원 (Hakwon) madaniyati","SKY universitetlari","교육열 — Ta'limga ishtiyoq"],
    tasks:[
      {t:"📖 Darslik 10-11 bet: 한글 haqida 5 ta fakt yozing (kim, qachon, nima uchun)",done:false,bloom:"eslash",level:"B1"},
      {t:"📖 Nima uchun 세종대왕 hangulni yaratgan? Tushuntiring (darslik 10-bet)",done:false,bloom:"tushunish",level:"B1"},
      {t:"📖 SKY Castle ep.5-8: ta'lim bosimi tahlili — darslik 54-59 bet bilan solishtiring",done:false,bloom:"tahlil",level:"B2"},
      {t:"📖 O'zbekiston vs Koreya ta'lim tizimi esse (300 so'z)",done:false,bloom:"yaratish",level:"B1"},
      {t:"📖 O'zbekiston vs Koreya ta'lim — chuqur taqqoslash (800 so'z, darslik asosida)",done:false,bloom:"yaratish",level:"C1"},
      {t:"COIL: Ta'lim tajribasi almashish",done:false,bloom:"qollash",level:"B2"},
      {t:"📖 학원 tizimi foydali yoki zararli? Baholang",done:false,bloom:"baholash",level:"C1"},
      {t:"📖 Lug'atga 5 ta so'z: 수능, 학원, 훈민정음, 성균관, 교육 (darslik 10-bet)",done:false,bloom:"eslash",level:"B1"}
    ],
    media:[
      {title:"수능 kuni — hujjatli film",type:"video",url:"https://www.youtube.com/embed/gMfFG9VS8EA",tip:"B1: subtitirlar bilan | C1: subtitrsiz"},
      {title:"Koreya ta'lim tizimi tushuntirish",type:"video",url:"https://www.youtube.com/embed/qEbGrfVUz8k",tip:"Inglizcha — barcha darajalar uchun"},
      {title:"SKY Castle ep.5 trailer",type:"video",url:"https://www.youtube.com/embed/KSE5Mbi8d2w",tip:"Dramatik sahna — til tahlili uchun"}
    ],
    resources:["📖 Education Fever","📊 OECD PISA natijalar","📚 Darslik: 54-59 bet (bayramlar)"],
    keyVocab:["수능","학원","대학교","교육","훈민정음","세종대왕","한글","성균관"]},
  {id:5,title:"Pop-madaniyat (한류)",status:"locked",score:null,date:"2026-03-31",desc:"K-pop, K-drama",
    topics:["한류 — Koreya to'lqini","K-pop sanoati","K-drama globalizatsiya","Koreya brendlari dunyo bozorida"],
    tasks:[
      {t:"📖 Darslik 62-73 bet: xalq o'yinlari ro'yxatini tuzing (연날리기, 널뛰기, 윷놀이...)",done:false,bloom:"eslash",level:"B1"},
      {t:"📖 Darslik 76-83 bet: 판소리, 풍물놀이, 아리랑 — farqlarni tushuntiring",done:false,bloom:"tushunish",level:"B1"},
      {t:"📖 An'anaviy san'at (darslik 76-90) vs K-pop — o'xshashlik va farq tahlili",done:false,bloom:"tahlil",level:"B2"},
      {t:"K-drama vs O'zbek serial — debat",done:false,bloom:"baholash",level:"B2"},
      {t:"📖 한류 ta'siri haqida esse (300 so'z) — darslik va zamonaviy madaniyat",done:false,bloom:"yaratish",level:"B1"},
      {t:"📖 An'anaviy san'atdan zamonaviy K-pop gacha — evolyutsiya tahlili (800 so'z)",done:false,bloom:"yaratish",level:"C1"},
      {t:"📖 O'zbekistonga 한류 ta'siri — baholash (darslik 86-90 hunarmandchilik bilan solishtiring)",done:false,bloom:"baholash",level:"C1"},
      {t:"Final prezentatsiya: \"Koreya madaniyati sayohati\" (5 daqiqa, darslikdan misollar)",done:false,bloom:"yaratish",level:"B2"}
    ],
    media:[
      {title:"BTS — Dynamite (official MV)",type:"video",url:"https://www.youtube.com/embed/gdZLi9oWNZg",tip:"Tinglang, asosiy so'zlarni yozing"},
      {title:"한류 haqida hujjatli film",type:"video",url:"https://www.youtube.com/embed/jOTqXc3kJfE",tip:"B2+: murakkab mavzu, koreyscha subtitirlar bilan"},
      {title:"Crash Landing on You — trailer",type:"video",url:"https://www.youtube.com/embed/GVQGWgeVc4k",tip:"K-drama namunasi — subtitirlarni sinab ko'ring"}
    ],
    resources:["📖 K-Pop Confidential","📚 Darslik: 62-91 bet (o'yin, san'at)"],
    keyVocab:["한류","아이돌","드라마","팬덤","판소리","강강술래","윷놀이","태권도"]},
];
let decon=[
  {id:1,title:'"SKY Castle" serial tahlili',type:"Video",tags:["oila"],date:"2026-02-05",note:"Bolalar ta'limiga munosabat"},
  {id:2,title:"Samsung reklama tahlili",type:"Reklama",tags:["texnologiya"],date:"2026-02-08",note:"Kompaniyaga sadoqat"},
  {id:3,title:'"Misaeng" vebtun tahlili',type:"Vebtun",tags:["ish"],date:"2026-02-20",note:"Ofis madaniyati"},
];
let concepts=[
  {id:1,term:"정 (jeong)",meaning:"Hissiy bog'lanish",uzbek:"Mehribonlik",example:"So'zsiz tushunish"},
  {id:2,term:"눈치 (nunchi)",meaning:"Vaziyatni sezish",uzbek:"Farosat",example:"Kayfiyatni his qilish"},
  {id:3,term:"한 (han)",meaning:"Chuqur qayg'u",uzbek:"Hasrat",example:"Tarixiy chidash"},
  {id:4,term:"빨리빨리",meaning:"Tezroq!",uzbek:"Tez-tez",example:"1 kunda yetkazish"},
  {id:5,term:"효도 (hyodo)",meaning:"Ota-onaga hurmat",uzbek:"Ota-onaga xizmat",example:"Darslik 12-bet: oiladagi eng muhim qadriyat"},
  {id:6,term:"세배 (sebae)",meaning:"Yangi yil ta'zimi",uzbek:"Bayram salomi",example:"Darslik 54-bet: 설날da kattalarni ta'zimlash"},
  {id:7,term:"한복 (hanbok)",meaning:"An'anaviy kiyim",uzbek:"Milliy libos",example:"Darslik 30-bet: 저고리+치마/바지"},
  {id:8,term:"김치 (kimchi)",meaning:"Fermentlangan sabzavot",uzbek:"Achitilgan sabzavot",example:"Darslik 40-bet: eng mashhur koreys taomi"},
  {id:9,term:"한옥 (hanok)",meaning:"An'anaviy uy",uzbek:"Milliy uy",example:"Darslik 48-bet: 기와집 va 초가집"},
  {id:10,term:"한글 (hangul)",meaning:"Koreys yozuvi",uzbek:"Alifbo",example:"Darslik 10-bet: 세종대왕 1443-yilda yaratgan"},
  {id:11,term:"훈민정음",meaning:"Hangulning asl nomi",uzbek:"Xalqni o'rgatish ovozlari",example:"Darslik 10-bet: hangul yaratilish kitobi"},
  {id:12,term:"태극기 (taegukgi)",meaning:"Koreya bayrog'i",uzbek:"Davlat bayrog'i",example:"Darslik 8-bet: 빛과 생명, 평화와 발전"},
  {id:13,term:"무궁화 (mugunghwa)",meaning:"Koreya milliy guli",uzbek:"Milliy gul",example:"Darslik 9-bet: yirtilmas gul — cheksizlik ramzi"},
  {id:14,term:"족보 (jokbo)",meaning:"Oilaviy shajara",uzbek:"Nasabnoma",example:"Darslik 12-bet: ajdodlar va qarindoshlar kitobi"},
  {id:15,term:"돌잡이 (doljabi)",meaning:"1 yoshlik tanlov marosimi",uzbek:"Birinchi tug'ilgan kun marosimi",example:"Darslik 20-bet: bola kelajagini bashorat qilish"},
  {id:16,term:"송편 (songpyeon)",meaning:"Yarim oy shaklidagi guruch keki",uzbek:"Bayram pishirig'i",example:"Darslik 58-bet: 추석 da tayyorlanadi"},
  {id:17,term:"윷놀이 (yutnori)",meaning:"An'anaviy taxta o'yini",uzbek:"Milliy stol o'yini",example:"Darslik 54-bet: 설날da o'ynaladigan mashxur o'yin"},
  {id:18,term:"판소리 (pansori)",meaning:"Koreys opera san'ati",uzbek:"Qo'shiqli hikoya",example:"Darslik 79-bet: 소리꾼(qo'shiqchi) va 고수(barabonchi)"},
  {id:19,term:"강강술래",meaning:"An'anaviy aylanma raqs",uzbek:"Ayollar davra raqsi",example:"Darslik 58-bet: 추석da oydinlikda aylanma raqs"},
  {id:20,term:"김장 (gimjang)",meaning:"Qishga kimchi tayyorlash",uzbek:"Qishlik kimchi",example:"Darslik 40-bet: har yili kuzda butun oila bilan"},
];
let debates=[{id:1,topic:"야근 — fidokorlikmi?",myPosition:"Muvozanat zarur",date:"2026-02-12",conclusion:"Mehnatsevarlik qadrlanadi"}];
let coil=[{id:1,partner:"Kim Minji (김민지)",platform:"KakaoTalk",date:"2026-02-10",topic:"Oilaviy bayramlar"}];
let projects=[
  {id:1,title:"Rezyume (이력서)",type:"Hujjat",status:"done",feedback:"A'lo!"},
  {id:2,title:"Qiyosiy taqdimot",type:"Taqdimot",status:"progress",feedback:null},
];
let essays=[{id:1,title:"Oila qadriyatlarini angladim",date:"2026-02-14",wordCount:850,excerpt:"Koreys hurmat tizimi meni o'ylantirib qo'ydi..."}];
let journal=[
  {id:1,date:"2026-02-16",mood:"😊",title:"Koreys filmi",text:"Katta oila birga ovqatlangani hayratga soldi."},
  {id:2,date:"2026-02-15",mood:"🤔",title:"Nunchi haqida",text:"O'zbeklarda ham sezgirlik bor ekan."},
];
const QUIZ=[
  /* === 제1단원: 한국 (Koreya) — darslik 6-15 bet === */
  {q:"📖 Koreyani qadimdan qanday nom bilan atashgan? (Darslik 7-bet)",opts:["백두산","금수강산","한민족","동해"],c:1},
  {q:"📖 Koreya bayrog'i qanday nomlanadi? (Darslik 8-bet)",opts:["일장기","무궁화","오성홍기","태극기"],c:3},
  {q:"📖 태극기 nimani bildiradi? (Darslik 8-bet)",opts:["Urush va g'alaba","Yorug'lik, hayot, tinchlik va rivojlanish","Quyosh va oy","Dengiz va tog'"],c:1},
  {q:"📖 Koreya milliy guli qaysi? (Darslik 9-bet)",opts:["장미 (atirgul)","벚꽃 (sakura)","무궁화 (mugunghwa)","국화 (xrizantema)"],c:2},
  {q:"📖 Hangulning asl nomi nima edi? (Darslik 10-bet)",opts:["한자","훈민정음","천자문","가나"],c:1},
  {q:"📖 Hangulni kim, qachon yaratgan? (Darslik 10-bet)",opts:["고종, 1897","세종대왕, 1443","이순신, 1592","단군, BC 2333"],c:1},
  {q:"📖 Hangul unlilarini (모음) nima asosida yaratilgan? (Darslik 11-bet)",opts:["Hayvonlar shakli","Osmon, yer va odam","Raqamlar","Yulduzlar"],c:1},
  {q:"📖 Hangul undoshlari (자음) nima asosida yaratilgan? (Darslik 11-bet)",opts:["Tabiat hodisalari","Hayvonlar","Nutq a'zolari shakli","Buyumlar"],c:2},
  {q:"📖 Koreya oilasida eng muhim qadriyat nima? (Darslik 12-bet)",opts:["Boylik","효도 (ota-onaga hurmat)","Ta'lim","Sport"],c:1},
  {q:"📖 족보 nima? (Darslik 12-bet)",opts:["Oshxona kitobi","Oilaviy shajara kitobi","Maktab kundaligi","Sayohat xaritasi"],c:1},
  {q:"📖 Koreyada nechanchi avlodgacha qarindosh hisoblanadi? (Darslik 12-bet)",opts:["3-avlod","5-avlod","8-avlod","10-avlod"],c:2},
  {q:"📖 Koreyslarning an'anaviy ta'zimi (절) necha xil? (Darslik 14-bet)",opts:["1 xil","2 xil: 평절 va 큰절","3 xil","4 xil"],c:1},
  {q:"📖 큰절 (katta ta'zim) qachon qilinadi? (Darslik 14-bet)",opts:["Do'stlar bilan uchrashganda","To'y yoki marosimda","Ish joyida","Maktabda"],c:1},
  /* === 제2단원: 일생의 의례 (Hayot marosimlari) — darslik 18-27 bet === */
  {q:"📖 백일 nima? (Darslik 20-bet)",opts:["Tug'ilgan kunning 1000-kuni","Bolaning 100 kunligi","To'y kuni","O'lim yiligi"],c:1},
  {q:"📖 돌 (Dol) nima? (Darslik 20-bet)",opts:["Birinchi tug'ilgan kun","Maktabga kirish","Nikoh marosimi","60 yosh"],c:0},
  {q:"📖 돌잡이 da bola nima qiladi? (Darslik 21-bet)",opts:["Raqs tushadi","Buyumlardan birini tanlaydi (kelajakni bashorat)","Qo'shiq aytadi","Yurish boshlanadi"],c:1},
  {q:"📖 Koreys to'yida 목기러기 nima? (Darslik 22-bet)",opts:["Kelin libosi","Yog'och g'oz — sadoqat ramzi","To'y taomi","Musiqiy asbob"],c:1},
  {q:"📖 회갑 (Hwegap) nima? (Darslik 24-bet)",opts:["Bolaning 1 yoshi","Nikoh 25-yilligi","60 yoshlik bayram","Maktab bitirish"],c:2},
  /* === 제3단원: 의생활 (Kiyim) — darslik 30-33 bet === */
  {q:"📖 한복 da erkaklar nima kiyadi? (Darslik 30-bet)",opts:["치마 va 저고리","저고리 va 바지","원삼 va 족두리","두루마기 faqat"],c:1},
  {q:"📖 한복 da ayollar nima kiyadi? (Darslik 30-bet)",opts:["저고리 va 바지","저고리 va 치마","원삼 va 족두리","두루마기 faqat"],c:1},
  {q:"📖 두루마기 nima? (Darslik 30-bet)",opts:["Bosh kiyim","Ustki kiyim (palto)","Oyoq kiyim","Kamar bog'ich"],c:1},
  {q:"📖 Koreys xalqini nima uchun 백의민족 deyishgan? (Darslik 30-bet)",opts:["Qora kiyim kiyishgani uchun","Oq kiyim yoqtirishgani uchun","Qizil kiyim kiyishgani uchun","Ko'k kiyim kiyishgani uchun"],c:1},
  {q:"📖 노리개 nima? (Darslik 30-bet)",opts:["한복 ga taqiladigan bezak","Bosh kiyim","Oyoq kiyim","Kamar bog'ich"],c:0},
  /* === 제4단원: 식생활 (Ovqatlanish) — darslik 36-45 bet === */
  {q:"📖 Koreys dasturxonida 밥그릇 qaysi tomonda turadi? (Darslik 36-bet)",opts:["O'ng tomonda","Chap tomonda","Markazda","Orqada"],c:1},
  {q:"📖 Ovqat paytida 숟가락 va 젓가락 ni qanday ishlatish kerak? (Darslik 36-bet)",opts:["Ikkalasini bir vaqtda","Birini qo'yib birini olish kerak","Faqat qo'l bilan yeyish kerak","Faqat 숟가락"],c:1},
  {q:"📖 Ovqat paytida kim birinchi qoshiq ko'tarishi kerak? (Darslik 36-bet)",opts:["Eng yosh kishi","Mehmon","Katta (어른)","Kim istasa"],c:2},
  {q:"📖 김치 qanday tayyorlanadi? (Darslik 40-bet)",opts:["Qovuriladi","Tuzlangan sabzavotlar aralashtirib fermentlanadi","Qaynatiladi","Muzlatiladi"],c:1},
  {q:"📖 배추김치 va 깍두기 ning farqi nima? (Darslik 40-bet)",opts:["Ikkalasi bir xil","Biri karam, biri turp","Biri qizil, biri oq","Biri issiq, biri sovuq"],c:1},
  {q:"📖 김장 nima? (Darslik 40-bet)",opts:["Yozlik taom","Qishga kimchi tayyorlash marosimi","Bayram taomi","Restoran nomi"],c:1},
  /* === 제5단원: 주거생활 (Uy-joy) — darslik 48-51 bet === */
  {q:"📖 한옥 da 기와집 nima? (Darslik 48-bet)",opts:["Pichan tomli uy","Sopol kafel tomli uy","Temir tomli uy","Shisha tomli uy"],c:1},
  {q:"📖 기와지붕 ning egri chizig'i nimaga o'xshatiladi? (Darslik 48-bet)",opts:["Tog' cho'qqisiga","Qush qanotini yozganiga","To'lqinga","Bulutga"],c:1},
  /* === 제6단원: 명절 (Bayramlar) — darslik 54-59 bet === */
  {q:"📖 설날 qachon nishonlanadi? (Darslik 54-bet)",opts:["Quyosh taqvimi 1-yanvar","Oy taqvimi 1-yanvar (음력 1월 1일)","Oy taqvimi 15-avgust","25-dekabr"],c:1},
  {q:"📖 설날 da qaysi taom yeyiladi? (Darslik 54-bet)",opts:["송편","비빔밥","떡국","불고기"],c:2},
  {q:"📖 세배 nima? (Darslik 54-bet)",opts:["Taom yeyish","Kattalarni ta'zimlash (tiz cho'kib salom)","Sovg'a berish","Kiyim kiyish"],c:1},
  {q:"📖 설빔 nima? (Darslik 54-bet)",opts:["설날 taomi","설날 o'yini","설날 uchun yangi kiyim","설날 bezagi"],c:2},
  {q:"📖 윷놀이 qanday o'yin? (Darslik 54-bet)",opts:["Karta o'yini","Tayoqchalar bilan o'ynaladigan taxta o'yini","Futbol","Suzish"],c:1},
  {q:"📖 추석 qachon nishonlanadi? (Darslik 58-bet)",opts:["음력 1월 1일","음력 5월 5일","음력 8월 15일","음력 12월 25일"],c:2},
  {q:"📖 추석 ning boshqa nomi nima? (Darslik 58-bet)",opts:["단오","대보름","한가위","동지"],c:2},
  {q:"📖 추석 da qaysi taom tayyorlanadi? (Darslik 58-bet)",opts:["떡국","송편 (yarim oy shaklidagi guruch keki)","김밥","라면"],c:1},
  {q:"📖 추석 da 성묘 nima? (Darslik 58-bet)",opts:["O'yin o'ynash","Ajdodlar qabriga tashrif","Taom pishirish","Kiyim sotib olish"],c:1},
  {q:"📖 강강술래 nima? (Darslik 58-bet)",opts:["Taom turi","Kiyim nomi","Ayollarning davra raqsi","Jang uslubi"],c:2},
  /* === 제7단원: 민속놀이 (O'yinlar) — darslik 62-73 bet === */
  {q:"📖 연날리기 qanday o'yin? (Darslik 62-bet)",opts:["Suvda suzish","Varrak (kaytma) uchirish","To'p o'ynash","Ot poygasi"],c:1},
  {q:"📖 널뛰기 qanday o'yin? (Darslik 64-bet)",opts:["Arqon tashlab o'ynash","Taxtada sakrash (tepalka/balanser)","Suzish","Yugurish"],c:1},
  /* === Mavjud savollar (umumiy bilim) === */
  {q:"Koreyada hurmatli ayol, madaniyat arbobi va olimning onasi — bu kim?",opts:["성혜림","김여정","신사임당","김정숙"],c:2},
  {q:"\"현모양처\" qanday ma'no anglatadi?",opts:["Kuchli jangchi","Aqlli ona va yaxshi xotin","Mashhur aktrisa","Boy ayol"],c:1},
  {q:"존댓말 nima?",opts:["Norasmiy nutq","Rasmiy-hurmatli nutq","Yozma til","Qadimiy til"],c:1},
  {q:"반말 qachon ishlatiladi?",opts:["Kattalar bilan","Boshliq bilan","Tengdosh do'stlar bilan","Notanish odamlar bilan"],c:2},
  {q:"Koreya alifbosida nechta undosh (자음) bor?",opts:["10 ta","14 ta","19 ta","21 ta"],c:1},
  {q:"Koreya alifbosida nechta unli (모음) bor?",opts:["5 ta","8 ta","10 ta","14 ta"],c:2},
  {q:"수능 nima?",opts:["Sport musobaqasi","Milliy universitetga kirish imtihoni","Oshpazlik kursi","Musiqiy konkurs"],c:1},
  {q:"학원 (hakwon) nima?",opts:["Universitet","Qo'shimcha ta'lim kursi","Kutubxona","Muzey"],c:1},
  {q:"Koreys tilida 선배 va 후배 nima?",opts:["Ota va ona","Katta va kichik hamkasb/hamkurslar","Er va xotin","Do'stlar"],c:1},
  {q:"한류 (Hallyu) nima?",opts:["Koreys ovqati","Koreya madaniyati to'lqini","Koreys jang san'ati","Koreys yozuvi"],c:1},
];
const CAL_EVENTS=[
  {date:"2026-03-03",title:"3-modul: Hurmat tizimi (존댓말)",color:"#D4943A",type:"modul",modId:3},
  {date:"2026-03-05",title:"📖 Dialog: Rasmiy/norasmiy farqlar",color:"#5B5FC7",type:"task",modId:3},
  {date:"2026-03-07",title:"💬 Debat: Hurmat tizimi — zamonaviy hayot",color:"#E8604C",type:"task",modId:3},
  {date:"2026-03-10",title:"🌐 COIL — Lee Soyeon",color:"#5B5FC7",type:"coil"},
  {date:"2026-03-12",title:"📓 Kundalikda refleksiya deadline",color:"#3A9E7E",type:"task",modId:3},
  {date:"2026-03-14",title:"🎯 Viktorina: 10+ to'g'ri javob",color:"#9E5FA0",type:"task",modId:3},
  {date:"2026-03-15",title:"⭐ 3-modul yakuniy baho",color:"#E8604C",type:"deadline"},
  {date:"2026-03-17",title:"4-modul: Ta'lim tizimi",color:"#D4943A",type:"modul",modId:4},
  {date:"2026-03-20",title:"📖 SKY Castle ep.5-8 tahlili",color:"#5B5FC7",type:"task",modId:4},
  {date:"2026-03-24",title:"✍️ Ta'lim tizimi taqqoslash esse",color:"#E8604C",type:"task",modId:4},
  {date:"2026-03-28",title:"🌐 COIL: Ta'lim tajribasi",color:"#5B5FC7",type:"task",modId:4},
  {date:"2026-03-31",title:"5-modul: Pop-madaniyat (한류)",color:"#D4943A",type:"modul",modId:5},
];
const STUDENTS=[
  {id:1,name:"Abdullayev Sardor",progress:68,modules:2,score:90,group:"KT-301",badges:4,decon:3,essays:2,debates:1,journal:5,quizBest:28,feedback:[]},
  {id:2,name:"Karimova Nilufar",progress:55,modules:2,score:85,group:"KT-301",badges:3,decon:2,essays:1,debates:1,journal:3,quizBest:22,feedback:[]},
  {id:3,name:"Raximov Jasur",progress:72,modules:2,score:93,group:"KT-301",badges:5,decon:4,essays:3,debates:2,journal:6,quizBest:35,feedback:[]},
  {id:4,name:"To'rayeva Madina",progress:45,modules:1,score:78,group:"KT-301",badges:2,decon:1,essays:0,debates:0,journal:2,quizBest:18,feedback:[]},
  {id:5,name:"Usmonov Doniyor",progress:82,modules:2,score:95,group:"KT-301",badges:6,decon:5,essays:3,debates:2,journal:7,quizBest:38,feedback:[]},
];
const VR_LOCS=[
  {id:"gwanghwamun",nameKr:"광화문",sub:"Darvoza",icon:"🚪",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kwanghwamun.JPG?width=1600",desc:"1395-yilda qurilgan bosh darvoza. Gyeongbokgung saroyining eng muhim kirish joyi.",cultural:"Soqchilar almashinuvi marosimi har kuni o'tkaziladi.",facts:["1395-yil qurilgan","2010-yilda tiklangan","Har kuni marosim"],hs:[{x:20,y:60,l:"Haechi",d:"Himoya hayvoni"},{x:50,y:30,l:"Arka",d:"Qirol joyi"},{x:80,y:55,l:"Soqchilar",d:"Postlar"}],nb:["geunjeongjeon","gyeonghoeru"]},
  {id:"geunjeongjeon",nameKr:"근정전",sub:"Taxt zali",icon:"👑",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Seoul_Geunjeongjeon_01.jpg?width=1600",desc:"Taxt marosimlari o'tkazilgan bosh zal.",cultural:"Amaldorlar martaba tartibida turish kerak edi.",facts:["Milliy xazina #1","Ikki qavatli","Konfutsiy asosida"],hs:[{x:50,y:25,l:"Taxt",d:"Oltin taxt"},{x:25,y:70,l:"Toshlar",d:"Martaba belgi"},{x:75,y:50,l:"Ajdarho",d:"Qirollik ramzi"}],nb:["gwanghwamun","gyeonghoeru"]},
  {id:"gyeonghoeru",nameKr:"경회루",sub:"Ziyofat",icon:"🏯",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Gyeonghoeru,_Gyeongbokgung.jpg?width=1600",desc:"Ko'l ustidagi ziyofat pavil'oni.",cultural:"48 ustun — osmon-yer uyg'unligi ramzi.",facts:["48 ustun","10,000 won banknotada","3 orol"],hs:[{x:35,y:40,l:"Ko'l",d:"Lotus gullari"},{x:65,y:30,l:"Zal",d:"Ziyofat qavati"},{x:50,y:75,l:"Ko'prik",d:"Tosh ko'prik"}],nb:["geunjeongjeon","hyangwonjeong"]},
  {id:"hyangwonjeong",nameKr:"향원정",sub:"Bog'",icon:"🌸",img:"https://commons.wikimedia.org/wiki/Special:FilePath/Gyeongbokgung_Hyangwonjeong.jpg?width=1600",desc:"Qirollik dam olish bog'i.",cultural:"Tabiatga qaytish falsafasi aks etadi.",facts:["1873-yil qurilgan","Olti burchakli","Turli gullar"],hs:[{x:40,y:35,l:"Tom",d:"Noyob shakl"},{x:60,y:65,l:"Ko'prik",d:"Yog'och"},{x:25,y:55,l:"Hovuz",d:"Lotus"}],nb:["gyeonghoeru","gwanghwamun"]},
];

/* ══════ STATE ══════ */
