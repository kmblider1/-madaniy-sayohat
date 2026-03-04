let openModule=null,openMapModule=null,openModMedia=null;
function getFilteredTasks(m){return m.tasks.filter(t=>STUDENT_LEVELS.indexOf(t.level)<=STUDENT_LEVELS.indexOf(studentLevel))}
function getAdaptiveHint(m){const done=m.tasks.filter(t=>t.done);const bloomDone=done.map(t=>BLOOM_LEVELS[t.bloom]?.order||0);const maxBloom=Math.max(0,...bloomDone);const nextBloom=Object.entries(BLOOM_LEVELS).find(([k,v])=>v.order===maxBloom+1);const filtered=getFilteredTasks(m).filter(t=>!t.done);if(filtered.length===0)return null;if(nextBloom){const rec=filtered.find(t=>t.bloom===nextBloom[0]);if(rec)return{task:rec,reason:`Keyingi Blum bosqichi: ${nextBloom[1].label}`}}return{task:filtered[0],reason:"Keyingi topshiriq"}}
function toggleTask(modId,taskIdx){const m=MODULES.find(x=>x.id===modId);if(!m||m.status==='locked')return;m.tasks[taskIdx].done=!m.tasks[taskIdx].done;checkBadges();renderDashboard()}
function toggleMapTask(modId,taskIdx){const m=MODULES.find(x=>x.id===modId);if(!m||m.status==='locked')return;m.tasks[taskIdx].done=!m.tasks[taskIdx].done;checkBadges();renderMap()}
function renderDashboard(){const ec=earnedCount(),bl=getBadges().length;
const stats=[{n:decon.length,l:"Tahlillar",c:"var(--accent-coral)",bg:"var(--accent-coral)",em:"🔍"},{n:debates.length+coil.length,l:"Muloqotlar",c:"var(--accent-amber)",bg:"var(--accent-amber)",em:"💬"},{n:projects.length+essays.length,l:"Amaliy ishlar",c:"var(--accent-jade)",bg:"var(--accent-jade)",em:"⭐"}];
const prog=[{l:"Lug'at",v:Math.min(100,concepts.length*5),c:"var(--accent-indigo)"},{l:"Muloqot",v:Math.min(100,(debates.length+coil.length)*25),c:"var(--accent-amber)"},{l:"Amaliy",v:Math.min(100,(projects.length+essays.length)*20),c:"var(--accent-coral)"}];
let h=`<div class="grid-3 stagger" style="margin-bottom:22px">${stats.map(s=>`<div class="stat-card"><div class="stat-glow" style="background:${s.bg}"></div><div class="stat-emoji">${s.em}</div><div class="stat-number" style="color:${s.c}">${s.n}</div><div class="stat-label">${s.l}</div></div>`).join('')}</div>`;
h+=`<div class="grid-2"><div class="glass-card"><div class="card-header"><div class="card-title">O'sish</div><div style="font-family:var(--ff-display);font-size:28px;background:linear-gradient(135deg,var(--accent-amber),var(--accent-coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent">${Math.round(ec/bl*100)}%</div></div><div class="progress-track" style="margin-bottom:20px"><div class="progress-fill" style="width:${ec/bl*100}%;background:linear-gradient(90deg,var(--accent-amber),var(--accent-coral))"></div></div>${prog.map(p=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="font-size:11px;width:60px;color:var(--text-muted);font-weight:500">${p.l}</span><div style="flex:1;height:4px;background:var(--border-subtle);border-radius:3px"><div style="width:${p.v}%;height:100%;background:${p.c};border-radius:3px;transition:width 1s var(--ease)"></div></div><span style="font-size:11px;font-weight:700;width:30px;text-align:right">${p.v}%</span></div>`).join('')}</div>`;
h+=`<div class="glass-card"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
  <div class="card-title">Modullar</div>
  <div style="display:flex;align-items:center;gap:6px">
    <span style="font-size:10px;color:var(--text-muted)">Daraja:</span>
    ${STUDENT_LEVELS.map(lv=>`<button class="tag ${studentLevel===lv?'tag-indigo':''}" style="cursor:pointer;font-size:10px;padding:3px 10px;border:1px solid ${studentLevel===lv?'var(--accent-indigo)':'var(--border-medium)'}" onclick="studentLevel='${lv}';renderDashboard()">${lv}</button>`).join('')}
  </div>
</div>${MODULES.map(m=>{
  const filtered=m.tasks.filter(t=>STUDENT_LEVELS.indexOf(t.level)<=STUDENT_LEVELS.indexOf(studentLevel));
  const tasksDone=filtered.filter(t=>t.done).length;const tasksTotal=filtered.length;const taskPct=tasksTotal?Math.round(tasksDone/tasksTotal*100):0;
  const isOpen=openModule===m.id;
  const hint=getAdaptiveHint(m);
  return`<div style="margin-bottom:${isOpen?'16':'8'}px;border-radius:16px;border:1px solid ${isOpen?'var(--accent-amber)':'var(--border-subtle)'};overflow:hidden;transition:all .3s var(--ease);background:${isOpen?'var(--accent-amber-soft)':'transparent'}">
  <div class="mod-item" style="cursor:pointer;padding:14px 16px;margin:0;border:none" onclick="openModule=openModule===${m.id}?null:${m.id};renderDashboard()">
    <div class="mod-dot ${m.status==='done'?'done':m.status==='active'?'active-m':'locked'}">${m.status==='done'?'✓':m.status==='locked'?'🔒':m.id}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="font-size:14px;font-weight:600;color:${m.status==='locked'?'var(--text-muted)':'var(--text-primary)'}">${m.title}</span>
        ${m.status==='active'?'<span class="tag tag-amber" style="font-size:9px">Hozir</span>':''}
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
        <div style="flex:1;max-width:120px;height:4px;background:var(--border-subtle);border-radius:3px"><div style="width:${taskPct}%;height:100%;background:${m.status==='done'?'var(--accent-jade)':m.status==='active'?'var(--accent-amber)':'var(--border-medium)'};border-radius:3px;transition:width .5s"></div></div>
        <span style="font-size:10px;color:var(--text-muted)">${tasksDone}/${tasksTotal}</span>
      </div>
    </div>
    ${m.score?`<span style="font-family:var(--ff-display);font-size:20px;color:var(--accent-jade)">${m.score}</span>`:''}
    <span style="font-size:12px;color:var(--text-muted);transition:transform .3s;transform:rotate(${isOpen?180:0}deg)">▼</span>
  </div>
  ${isOpen?`<div style="padding:0 16px 16px;border-top:1px solid var(--border-subtle)">
    <!-- Adaptive Recommendation -->
    ${hint&&m.status==='active'?`<div style="margin-top:12px;padding:12px 14px;background:linear-gradient(135deg,rgba(212,148,58,.08),rgba(232,96,76,.04));border-radius:12px;border-left:3px solid var(--accent-amber)">
      <div style="font-size:10px;font-weight:700;color:var(--accent-amber);text-transform:uppercase;letter-spacing:.5px">🎯 Tavsiya: ${hint.reason}</div>
      <div style="font-size:12px;font-weight:600;margin-top:4px;color:var(--text-primary)">${hint.task.t}</div>
      <div style="display:flex;gap:4px;margin-top:6px"><span style="font-size:9px;padding:2px 6px;border-radius:4px;background:${BLOOM_LEVELS[hint.task.bloom]?.color}20;color:${BLOOM_LEVELS[hint.task.bloom]?.color}">${BLOOM_LEVELS[hint.task.bloom]?.icon} ${BLOOM_LEVELS[hint.task.bloom]?.label}</span><span style="font-size:9px;padding:2px 6px;border-radius:4px;background:var(--accent-indigo-soft);color:var(--accent-indigo)">${hint.task.level}</span></div>
    </div>`:''}
    <!-- Bloom Legend -->
    <div style="margin-top:14px;margin-bottom:10px">
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📊 Blum taksonomiyasi</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">${Object.entries(BLOOM_LEVELS).map(([k,v])=>{const cnt=filtered.filter(t=>t.bloom===k).length;const doneC=filtered.filter(t=>t.bloom===k&&t.done).length;return`<span style="font-size:9px;padding:3px 8px;border-radius:6px;background:${v.color}15;color:${v.color};opacity:${cnt>0?1:.4}">${v.icon} ${v.label} ${doneC}/${cnt}</span>`}).join('')}</div>
    </div>
    <!-- Topics -->
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📚 Mavzular</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${m.topics.map(t=>`<span class="tag tag-indigo" style="font-size:11px">${t}</span>`).join('')}</div>
    </div>
    <!-- Tasks with Bloom + Level -->
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">✅ Topshiriqlar — ${studentLevel} daraja (${tasksDone}/${tasksTotal})</div>
      ${filtered.map((t,ti)=>{const origIdx=m.tasks.indexOf(t);const bl=BLOOM_LEVELS[t.bloom];return`<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 12px;margin-bottom:4px;border-radius:10px;background:${t.done?'rgba(58,158,126,.06)':'var(--bg-elevated)'};cursor:${m.status!=='locked'?'pointer':'default'}" ${m.status!=='locked'?`onclick="toggleTask(${m.id},${origIdx})"`:''}>
        <div style="width:20px;height:20px;border-radius:6px;border:2px solid ${t.done?'var(--accent-jade)':'var(--border-medium)'};background:${t.done?'var(--accent-jade)':'transparent'};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;flex-shrink:0;margin-top:1px">${t.done?'✓':''}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;color:${t.done?'var(--text-muted)':'var(--text-primary)'};${t.done?'text-decoration:line-through':''}">${t.t}</div>
          <div style="display:flex;gap:4px;margin-top:4px">
            <span style="font-size:9px;padding:1px 6px;border-radius:4px;background:${bl?.color}15;color:${bl?.color}">${bl?.icon} ${bl?.label}</span>
            <span style="font-size:9px;padding:1px 6px;border-radius:4px;background:var(--accent-indigo-soft);color:var(--accent-indigo)">${t.level}</span>
          </div>
        </div>
      </div>`}).join('')}
    </div>
    <!-- Media -->
    ${m.media&&m.media.length?`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">🎬 Media materiallar</div>
      ${m.media.map((md,mi)=>`<div style="margin-bottom:8px;border-radius:12px;border:1px solid var(--border-subtle);overflow:hidden">
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;background:var(--bg-elevated)" onclick="openModMedia=openModMedia==='${m.id}-${mi}'?null:'${m.id}-${mi}';renderDashboard()">
          <span style="font-size:16px">${md.type==='video'?'📺':'🎵'}</span>
          <div style="flex:1"><div style="font-size:12px;font-weight:600">${md.title}</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px">${md.tip}</div></div>
          <span style="font-size:10px;color:var(--text-muted)">${openModMedia==='${m.id}-${mi}'?'▲':'▼'}</span>
        </div>
        ${openModMedia===m.id+'-'+mi?`<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden"><iframe src="${md.url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" allowfullscreen allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"></iframe></div>`:''}
      </div>`).join('')}
    </div>`:''}
    <!-- Key Vocab -->
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">🔤 Kalit so'zlar</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${m.keyVocab.map(v=>`<span style="padding:4px 12px;border-radius:8px;background:var(--accent-plum-soft);color:var(--accent-plum);font-size:12px;font-weight:600;font-family:var(--ff-kr)">${v}</span>`).join('')}</div>
    </div>
    <!-- Resources -->
    <div>
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📎 Resurslar</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${m.resources.map(r=>`<span class="tag tag-amber" style="font-size:11px">${r}</span>`).join('')}</div>
    </div>
    ${m.status==='active'?`<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-subtle);display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-jade btn-sm" onclick="goTo('tahlil')" style="flex:1">📖 Tahlil</button>
      <button class="btn btn-ghost btn-sm" onclick="goTo('dialog')" style="flex:1">💬 Debat</button>
      <button class="btn btn-ghost btn-sm" onclick="goTo('journal')" style="flex:1">📓 Kundalik</button>
      <button class="btn btn-ghost btn-sm" onclick="goTo('kutubxona')" style="flex:1">📚 Darslik</button>
    </div>`:''}
    ${m.status==='done'&&m.score?`<div style="margin-top:14px;padding:14px;background:linear-gradient(135deg,rgba(58,158,126,.08),rgba(58,158,126,.02));border-radius:12px;display:flex;align-items:center;justify-content:space-between">
      <div><div style="font-size:11px;color:var(--text-muted)">Yakuniy ball</div><div style="font-size:24px;font-weight:800;color:var(--accent-jade);font-family:var(--ff-display)">${m.score}</div></div>
      <div style="font-size:28px">🎉</div>
    </div>`:''}
  </div>`:''}</div>`}).join('')}</div></div>`;
document.getElementById('dashboard-c').innerHTML=h}

/* ══════ TAHLIL ══════ */
let tahlilTab="decon", deconEdit=null, conceptEdit=null;
function renderTahlil(){let h=`<div class="tabs"><button class="tab-btn ${tahlilTab==='decon'?'active':''}" onclick="tahlilTab='decon';deconEdit=null;renderTahlil()">Dekonstruksiya (${decon.length})</button><button class="tab-btn ${tahlilTab==='vocab'?'active':''}" onclick="tahlilTab='vocab';conceptEdit=null;renderTahlil()">Lug'at (${concepts.length})</button></div>`;
if(tahlilTab==='decon'){
  if(deconEdit!==null){
    /* ── DECON EDITOR ── */
    const isNew=deconEdit==='new';
    const d=isNew?{title:'',type:'',tags:[],note:'',date:today}:decon.find(x=>x.id===deconEdit);
    h+=`<div class="glass-card" style="padding:0;overflow:hidden">
      <div style="padding:16px 22px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:10px"><button class="btn btn-ghost btn-sm" onclick="deconEdit=null;renderTahlil()">← Orqaga</button><span style="font-size:12px;color:var(--text-muted)">${isNew?'Yangi tahlil':'Tahrirlash'}</span></div>
        <button class="btn btn-jade btn-sm" onclick="saveDecon(${isNew})">💾 Saqlash</button>
      </div>
      <div style="padding:24px">
        <div class="form-field"><label class="form-label">Sarlavha</label><input class="form-input" id="dc-title" value="${isNew?'':d.title.replace(/"/g,'&quot;')}" placeholder="Masalan: Reply 1988 serial tahlili"/></div>
        <div class="grid-2"><div class="form-field"><label class="form-label">Turi</label><select class="form-input" id="dc-type"><option value="Video" ${!isNew&&d.type==='Video'?'selected':''}>🎬 Video</option><option value="Reklama" ${!isNew&&d.type==='Reklama'?'selected':''}>📺 Reklama</option><option value="Vebtun" ${!isNew&&d.type==='Vebtun'?'selected':''}>📱 Vebtun</option><option value="Film" ${!isNew&&d.type==='Film'?'selected':''}>🎥 Film</option><option value="Musiqa" ${!isNew&&d.type==='Musiqa'?'selected':''}>🎵 Musiqa</option><option value="Boshqa" ${!isNew&&d.type==='Boshqa'?'selected':''}>📋 Boshqa</option></select></div>
        <div class="form-field"><label class="form-label">Teglar (vergul bilan)</label><input class="form-input" id="dc-tags" value="${isNew?'':d.tags.join(', ')}" placeholder="oila, texnologiya, ish"/></div></div>
        <div class="form-field"><label class="form-label">Tahlil matni</label><div id="dc-note" contenteditable="true" style="min-height:200px;font-size:14px;line-height:1.9;color:var(--text-primary);outline:none;padding:16px;border:1px solid var(--border-medium);border-radius:14px;background:var(--bg-warm)" onfocus="this.style.borderColor='var(--accent-amber)';this.style.boxShadow='0 0 0 3px var(--accent-amber-soft)'" onblur="this.style.borderColor='var(--border-medium)';this.style.boxShadow='none'">${isNew?'':d.note}</div></div>
      </div>
    </div>`;
  } else {
    h+=`<div style="display:flex;justify-content:space-between;margin-bottom:16px"><span style="font-size:12px;color:var(--text-muted)">${decon.length} ta tahlil</span><button class="btn btn-coral btn-sm" onclick="deconEdit='new';renderTahlil()">+ Yangi tahlil</button></div>`;
    h+=decon.map(d=>`<div class="list-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <span style="font-size:14px;font-weight:600;flex:1">${d.title}</span>
        <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;margin-left:10px">
          <span style="font-size:10px;color:var(--text-muted)">${d.date}</span>
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();deconEdit=${d.id};renderTahlil()" style="padding:3px 8px">✏️</button>
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();deleteDecon(${d.id})" style="padding:3px 8px;color:var(--accent-coral)">🗑</button>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:8px"><span class="tag tag-indigo">${d.type}</span>${d.tags.map(t=>`<span class="tag tag-amber">${t}</span>`).join('')}</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">${d.note}</div>
    </div>`).join('');
  }
} else {
  if(conceptEdit!==null){
    const isNew=conceptEdit==='new';
    const c=isNew?{term:'',meaning:'',uzbek:'',example:''}:concepts.find(x=>x.id===conceptEdit);
    h+=`<div class="glass-card" style="padding:0;overflow:hidden">
      <div style="padding:16px 22px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:10px"><button class="btn btn-ghost btn-sm" onclick="conceptEdit=null;renderTahlil()">← Orqaga</button><span style="font-size:12px;color:var(--text-muted)">${isNew?'Yangi so\'z':'Tahrirlash'}</span></div>
        <button class="btn btn-jade btn-sm" onclick="saveConcept(${isNew})">💾 Saqlash</button>
      </div>
      <div style="padding:24px">
        <div class="grid-2"><div class="form-field"><label class="form-label">Atama (koreys)</label><input class="form-input" id="cn-term" value="${isNew?'':c.term}" placeholder="효도" style="font-family:var(--ff-kr);font-size:18px"/></div>
        <div class="form-field"><label class="form-label">Ma'nosi</label><input class="form-input" id="cn-meaning" value="${isNew?'':c.meaning}" placeholder="Ota-onaga hurmat"/></div></div>
        <div class="grid-2"><div class="form-field"><label class="form-label">O'zbekcha muqobili</label><input class="form-input" id="cn-uzbek" value="${isNew?'':c.uzbek}" placeholder="Hurmat"/></div>
        <div class="form-field"><label class="form-label">Hayotiy misol</label><input class="form-input" id="cn-example" value="${isNew?'':c.example}" placeholder="Masalan: ..."/></div></div>
      </div>
    </div>`;
  } else {
    h+=`<div style="display:flex;justify-content:space-between;margin-bottom:16px"><span style="font-size:12px;color:var(--text-muted)">${concepts.length} ta konsepsiya${concepts.length<5?` <span style="color:var(--accent-amber)">(5 ta = 📚)</span>`:''}</span><button class="btn btn-coral btn-sm" onclick="conceptEdit='new';renderTahlil()">+ Yangi so'z</button></div>`;
    h+=`<div class="grid-2">${concepts.map(c=>`<div class="glass-card" style="cursor:pointer;position:relative">
      <div style="position:absolute;top:12px;right:12px;display:flex;gap:4px"><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();conceptEdit=${c.id};renderTahlil()" style="padding:3px 8px">✏️</button><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();deleteConcept(${c.id})" style="padding:3px 8px;color:var(--accent-coral)">🗑</button></div>
      <div style="font-family:var(--ff-kr);font-size:20px;font-weight:700;background:linear-gradient(135deg,var(--accent-indigo),var(--accent-plum));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px">${c.term}</div>
      <div style="font-size:13px;margin-bottom:4px">${c.meaning}</div>
      <div style="font-size:11px;color:var(--text-muted)">🇺🇿 ${c.uzbek}</div>
      ${c.example?`<div style="font-size:10px;color:var(--text-muted);margin-top:4px;font-style:italic">💡 ${c.example}</div>`:''}
    </div>`).join('')}</div>`;
  }
}
document.getElementById('tahlil-c').innerHTML=h}
function saveDecon(isNew){const title=document.getElementById('dc-title').value.trim(),type=document.getElementById('dc-type').value,tags=document.getElementById('dc-tags').value.split(',').map(t=>t.trim()).filter(t=>t),note=document.getElementById('dc-note').innerHTML;if(!title){alert('Sarlavha kiriting!');return}if(isNew){decon.push({id:Date.now(),title,type,tags,date:today,note})}else{const idx=decon.findIndex(d=>d.id===deconEdit);if(idx>=0){decon[idx].title=title;decon[idx].type=type;decon[idx].tags=tags;decon[idx].note=note}}deconEdit=null;renderTahlil();checkBadges()}
function deleteDecon(id){if(!confirm("Tahlilni o'chirmoqchimisiz?"))return;decon=decon.filter(d=>d.id!==id);renderTahlil();checkBadges()}
function saveConcept(isNew){const term=document.getElementById('cn-term').value.trim(),meaning=document.getElementById('cn-meaning').value.trim(),uzbek=document.getElementById('cn-uzbek').value.trim(),example=document.getElementById('cn-example').value.trim();if(!term||!meaning){alert('Atama va ma\'nosini kiriting!');return}if(isNew){concepts.push({id:Date.now(),term,meaning,uzbek,example})}else{const idx=concepts.findIndex(c=>c.id===conceptEdit);if(idx>=0){concepts[idx]={...concepts[idx],term,meaning,uzbek,example}}}conceptEdit=null;renderTahlil();checkBadges()}
function deleteConcept(id){if(!confirm("So'zni o'chirmoqchimisiz?"))return;concepts=concepts.filter(c=>c.id!==id);renderTahlil();checkBadges()}

/* ══════ DIALOG ══════ */
let dialogTab="debate", debateEdit=null, coilEdit=null;
function renderDialog(){let h=`<div class="tabs"><button class="tab-btn ${dialogTab==='debate'?'active':''}" onclick="dialogTab='debate';debateEdit=null;renderDialog()">Debatlar (${debates.length})</button><button class="tab-btn ${dialogTab==='coil'?'active':''}" onclick="dialogTab='coil';coilEdit=null;renderDialog()">COIL (${coil.length})</button></div>`;
if(dialogTab==='debate'){
  if(debateEdit!==null){
    const isNew=debateEdit==='new';
    const d=isNew?{topic:'',myPosition:'',conclusion:'',date:today}:debates.find(x=>x.id===debateEdit);
    h+=`<div class="glass-card" style="padding:0;overflow:hidden">
      <div style="padding:16px 22px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:10px"><button class="btn btn-ghost btn-sm" onclick="debateEdit=null;renderDialog()">← Orqaga</button><span style="font-size:12px;color:var(--text-muted)">${isNew?'Yangi debat':'Tahrirlash'}</span></div>
        <button class="btn btn-jade btn-sm" onclick="saveDebate(${isNew})">💾 Saqlash</button>
      </div>
      <div style="padding:24px">
        <div class="form-field"><label class="form-label">Debat mavzusi</label><input class="form-input" id="db-topic" value="${isNew?'':d.topic.replace(/"/g,'&quot;')}" placeholder="Masalan: 야근 — fidokorlikmi yoki istismormi?" style="font-size:16px;font-weight:600"/></div>
        <div class="form-field"><label class="form-label">📋 Mening pozitsiyam</label><div id="db-position" contenteditable="true" style="min-height:150px;font-size:14px;line-height:1.9;color:var(--text-primary);outline:none;padding:16px;border:1px solid var(--border-medium);border-radius:14px;background:var(--bg-warm)" onfocus="this.style.borderColor='var(--accent-amber)'" onblur="this.style.borderColor='var(--border-medium)'">${isNew?'':d.myPosition}</div></div>
        <div class="form-field"><label class="form-label">✅ Xulosa</label><div id="db-conclusion" contenteditable="true" style="min-height:100px;font-size:14px;line-height:1.9;color:var(--text-primary);outline:none;padding:16px;border:1px solid rgba(58,158,126,.2);border-radius:14px;background:var(--accent-jade-soft)" onfocus="this.style.borderColor='var(--accent-jade)'" onblur="this.style.borderColor='rgba(58,158,126,.2)'">${isNew?'':d.conclusion}</div></div>
      </div>
    </div>`;
  } else {
    h+=`<div style="display:flex;justify-content:space-between;margin-bottom:16px"><span style="font-size:12px;color:var(--text-muted)">${debates.length} ta debat${debates.length<2?` <span style="color:var(--accent-amber)">(2 ta = 💬)</span>`:''}</span><button class="btn btn-coral btn-sm" onclick="debateEdit='new';renderDialog()">+ Yangi debat</button></div>`;
    h+=debates.map(d=>`<div class="glass-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div style="display:flex;gap:8px;align-items:center"><span class="tag tag-coral">#${d.id}</span><span style="font-size:10px;color:var(--text-muted)">${d.date}</span></div>
        <div style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" onclick="debateEdit=${d.id};renderDialog()" style="padding:3px 8px">✏️</button><button class="btn btn-ghost btn-sm" onclick="deleteDebate(${d.id})" style="padding:3px 8px;color:var(--accent-coral)">🗑</button></div>
      </div>
      <h3 style="font-family:var(--ff-display);font-size:17px;margin-bottom:14px">${d.topic}</h3>
      <div style="background:var(--border-subtle);border-radius:14px;padding:16px;margin-bottom:10px;font-size:13px;line-height:1.7"><b>Pozitsiyam:</b> ${d.myPosition}</div>
      <div style="background:var(--accent-jade-soft);border:1px solid rgba(58,158,126,.12);border-radius:14px;padding:16px;font-size:13px;line-height:1.7"><b style="color:var(--accent-jade)">Xulosa:</b> ${d.conclusion}</div>
    </div>`).join('');
  }
} else {
  if(coilEdit!==null){
    const isNew=coilEdit==='new';
    const c=isNew?{partner:'',platform:'KakaoTalk',topic:'',summary:'',date:today}:coil.find(x=>x.id===coilEdit);
    h+=`<div class="glass-card" style="padding:0;overflow:hidden">
      <div style="padding:16px 22px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:10px"><button class="btn btn-ghost btn-sm" onclick="coilEdit=null;renderDialog()">← Orqaga</button><span style="font-size:12px;color:var(--text-muted)">${isNew?'Yangi COIL':'Tahrirlash'}</span></div>
        <button class="btn btn-jade btn-sm" onclick="saveCoil(${isNew})">💾 Saqlash</button>
      </div>
      <div style="padding:24px">
        <div class="grid-2"><div class="form-field"><label class="form-label">Hamkor ismi</label><input class="form-input" id="cl-partner" value="${isNew?'':c.partner}" placeholder="Lee Soyeon (이소연)"/></div>
        <div class="form-field"><label class="form-label">Platforma</label><select class="form-input" id="cl-platform"><option ${!isNew&&c.platform==='KakaoTalk'?'selected':''}>KakaoTalk</option><option ${!isNew&&c.platform==='Zoom'?'selected':''}>Zoom</option><option ${!isNew&&c.platform==='Discord'?'selected':''}>Discord</option><option ${!isNew&&c.platform==='Telegram'?'selected':''}>Telegram</option><option ${!isNew&&c.platform==='Boshqa'?'selected':''}>Boshqa</option></select></div></div>
        <div class="form-field"><label class="form-label">Suhbat mavzusi</label><input class="form-input" id="cl-topic" value="${isNew?'':c.topic}" placeholder="Masalan: Oilaviy bayramlar"/></div>
        <div class="form-field"><label class="form-label">Suhbat xulosa / Muhim fikrlar</label><div id="cl-summary" contenteditable="true" style="min-height:180px;font-size:14px;line-height:1.9;color:var(--text-primary);outline:none;padding:16px;border:1px solid var(--border-medium);border-radius:14px;background:var(--bg-warm)" onfocus="this.style.borderColor='var(--accent-indigo)'" onblur="this.style.borderColor='var(--border-medium)'">${isNew?'':(c.summary||'')}</div></div>
      </div>
    </div>`;
  } else {
    h+=`<div style="display:flex;justify-content:space-between;margin-bottom:16px"><span style="font-size:12px;color:var(--text-muted)">${coil.length} ta muloqot</span><button class="btn btn-coral btn-sm" onclick="coilEdit='new';renderDialog()">+ Yangi COIL</button></div>`;
    h+=coil.map(c=>`<div class="glass-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--accent-indigo),var(--accent-plum));display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800">${c.partner[0]||'?'}</div><div><div style="font-size:14px;font-weight:600">${c.partner}</div><div style="font-size:10px;color:var(--text-muted)">${c.platform} • ${c.date}</div></div></div>
        <div style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" onclick="coilEdit=${c.id};renderDialog()" style="padding:3px 8px">✏️</button><button class="btn btn-ghost btn-sm" onclick="deleteCoil(${c.id})" style="padding:3px 8px;color:var(--accent-coral)">🗑</button></div>
      </div>
      <div style="padding:14px;background:var(--border-subtle);border-radius:14px;font-size:13px;line-height:1.7"><b>Mavzu:</b> ${c.topic}</div>
      ${c.summary?`<div style="padding:14px;background:var(--accent-indigo-soft);border-radius:14px;font-size:12px;line-height:1.7;margin-top:8px">${c.summary}</div>`:''}
    </div>`).join('');
  }
}
document.getElementById('dialog-c').innerHTML=h}
function saveDebate(isNew){const topic=document.getElementById('db-topic').value.trim(),pos=document.getElementById('db-position').innerHTML,concl=document.getElementById('db-conclusion').innerHTML;if(!topic){alert('Mavzuni kiriting!');return}if(isNew){debates.push({id:debates.length+1,topic,myPosition:pos,conclusion:concl,date:today})}else{const idx=debates.findIndex(d=>d.id===debateEdit);if(idx>=0){debates[idx].topic=topic;debates[idx].myPosition=pos;debates[idx].conclusion=concl}}debateEdit=null;renderDialog();checkBadges()}
function deleteDebate(id){if(!confirm("Debatni o'chirmoqchimisiz?"))return;debates=debates.filter(d=>d.id!==id);renderDialog();checkBadges()}
function saveCoil(isNew){const partner=document.getElementById('cl-partner').value.trim(),platform=document.getElementById('cl-platform').value,topic=document.getElementById('cl-topic').value.trim(),summary=document.getElementById('cl-summary').innerHTML;if(!partner){alert('Hamkor ismini kiriting!');return}if(isNew){coil.push({id:Date.now(),partner,platform,topic,summary,date:today})}else{const idx=coil.findIndex(c=>c.id===coilEdit);if(idx>=0){coil[idx]={...coil[idx],partner,platform,topic,summary}}}coilEdit=null;renderDialog();checkBadges()}
function deleteCoil(id){if(!confirm("COIL ni o'chirmoqchimisiz?"))return;coil=coil.filter(c=>c.id!==id);renderDialog();checkBadges()}

/* ══════ TAJRIBA ══════ */
let tajribaTab="projects", essayEditing=null, essayViewId=null, projectEdit=null;
function renderTajriba(){let h=`<div class="tabs"><button class="tab-btn ${tajribaTab==='projects'?'active':''}" onclick="tajribaTab='projects';essayEditing=null;essayViewId=null;projectEdit=null;renderTajriba()">Jonli Keys (${projects.length})</button><button class="tab-btn ${tajribaTab==='essays'?'active':''}" onclick="tajribaTab='essays';projectEdit=null;renderTajriba()">Esselar (${essays.length})</button></div>`;
if(tajribaTab==='projects'){
  if(projectEdit!==null){
    const isNew=projectEdit==='new';
    const p=isNew?{title:'',type:'Hujjat',status:'progress',body:'',feedback:null}:projects.find(x=>x.id===projectEdit);
    h+=`<div class="glass-card" style="padding:0;overflow:hidden">
      <div style="padding:16px 22px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:10px"><button class="btn btn-ghost btn-sm" onclick="projectEdit=null;renderTajriba()">← Orqaga</button><span style="font-size:12px;color:var(--text-muted)">${isNew?'Yangi loyiha':'Tahrirlash'}</span></div>
        <button class="btn btn-jade btn-sm" onclick="saveProject(${isNew})">💾 Saqlash</button>
      </div>
      <div style="padding:24px">
        <div class="form-field"><label class="form-label">Loyiha nomi</label><input class="form-input" id="pj-title" value="${isNew?'':p.title.replace(/"/g,'&quot;')}" placeholder="Masalan: Rezyume (이력서)" style="font-size:16px;font-weight:600"/></div>
        <div class="grid-2"><div class="form-field"><label class="form-label">Turi</label><select class="form-input" id="pj-type"><option ${!isNew&&p.type==='Hujjat'?'selected':''}>Hujjat</option><option ${!isNew&&p.type==='Taqdimot'?'selected':''}>Taqdimot</option><option ${!isNew&&p.type==='Video'?'selected':''}>Video</option><option ${!isNew&&p.type==='Loyiha'?'selected':''}>Loyiha</option><option ${!isNew&&p.type==='Boshqa'?'selected':''}>Boshqa</option></select></div>
        <div class="form-field"><label class="form-label">Holati</label><select class="form-input" id="pj-status"><option value="progress" ${!isNew&&p.status==='progress'?'selected':''}>⏳ Jarayonda</option><option value="done" ${!isNew&&p.status==='done'?'selected':''}>✓ Tayyor</option></select></div></div>
        <div class="form-field"><label class="form-label">Loyiha tavsifi / Mazmuni</label><div id="pj-body" contenteditable="true" style="min-height:200px;font-size:14px;line-height:1.9;color:var(--text-primary);outline:none;padding:16px;border:1px solid var(--border-medium);border-radius:14px;background:var(--bg-warm)" onfocus="this.style.borderColor='var(--accent-amber)'" onblur="this.style.borderColor='var(--border-medium)'">${isNew?'':(p.body||'')}</div></div>
      </div>
    </div>`;
  } else {
    h+=`<div style="display:flex;justify-content:space-between;margin-bottom:16px"><span style="font-size:12px;color:var(--text-muted)">${projects.length} ta loyiha</span><button class="btn btn-coral btn-sm" onclick="projectEdit='new';renderTajriba()">+ Yangi loyiha</button></div>`;
    h+=`<div class="grid-2">${projects.map(p=>`<div class="glass-card" style="position:relative">
      <div style="position:absolute;top:14px;right:14px;display:flex;gap:4px">
        <span class="tag ${p.status==='done'?'tag-jade':'tag-amber'}">${p.status==='done'?'✓ Tayyor':'⏳ Jarayon'}</span>
        <button class="btn btn-ghost btn-sm" onclick="projectEdit=${p.id};renderTajriba()" style="padding:3px 8px">✏️</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteProject(${p.id})" style="padding:3px 8px;color:var(--accent-coral)">🗑</button>
      </div>
      <div style="font-size:15px;font-weight:600;padding-right:140px;margin-bottom:4px">${p.title}</div>
      <span class="tag tag-muted" style="margin-bottom:8px">${p.type||'Hujjat'}</span>
      ${p.body?`<div style="font-size:12px;color:var(--text-secondary);margin-top:8px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${(p.body||'').replace(/<[^>]*>/g,'').substring(0,120)}</div>`:''}
      ${p.feedback?`<div style="margin-top:10px;padding:10px;background:var(--accent-jade-soft);border-radius:10px;font-size:12px;color:var(--accent-jade)">💬 ${p.feedback}</div>`:''}
    </div>`).join('')}</div>`;
  }
}
else if(essayEditing!==null){
  /* ── ESSAY EDITOR ── */
  const isNew=essayEditing==='new';
  const essay=isNew?{title:'',body:'',date:today}:essays.find(e=>e.id===essayEditing);
  h+=`<div class="glass-card" style="padding:0;overflow:hidden">
    <div style="padding:18px 24px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn btn-ghost btn-sm" onclick="essayEditing=null;renderTajriba()">← Orqaga</button>
        <span style="font-size:13px;color:var(--text-muted)">${isNew?'Yangi esse yozish':'Esseni tahrirlash'}</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <span id="essay-wc" style="font-size:11px;color:var(--text-muted);background:var(--border-subtle);padding:4px 12px;border-radius:8px">0 so'z</span>
        <span id="essay-saved" style="font-size:11px;color:var(--accent-jade);opacity:0;transition:opacity .3s">✓ Saqlandi</span>
        <button class="btn btn-jade btn-sm" onclick="saveEssay(${isNew?'true':'false'})">💾 Saqlash</button>
      </div>
    </div>
    <div style="padding:24px">
      <input class="form-input" id="essay-title" value="${isNew?'':essay.title.replace(/"/g,'&quot;')}" placeholder="Esse sarlavhasini kiriting..." style="font-family:var(--ff-display);font-size:22px;font-weight:600;border:none;background:transparent;padding:8px 0;margin-bottom:8px;border-bottom:2px solid var(--border-subtle)" onfocus="this.style.borderBottomColor='var(--accent-amber)'" onblur="this.style.borderBottomColor='var(--border-subtle)'"/>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;display:flex;gap:16px">
        <span>📅 ${essay.date}</span>
        <span id="essay-chars">0 belgi</span>
        <span id="essay-time">~0 daq o'qish</span>
      </div>
      <div id="essay-toolbar" style="display:flex;gap:4px;padding:8px 0;border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);margin-bottom:16px;flex-wrap:wrap">
        <button onclick="essayFormat('bold')" style="padding:6px 10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-warm);cursor:pointer;font-weight:800;font-size:13px;color:var(--text-secondary);transition:.2s" title="Qalin">B</button>
        <button onclick="essayFormat('italic')" style="padding:6px 10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-warm);cursor:pointer;font-style:italic;font-size:13px;color:var(--text-secondary);transition:.2s" title="Kursiv">I</button>
        <button onclick="essayFormat('underline')" style="padding:6px 10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-warm);cursor:pointer;text-decoration:underline;font-size:13px;color:var(--text-secondary);transition:.2s" title="Tagiga chizish">U</button>
        <div style="width:1px;background:var(--border-subtle);margin:0 4px"></div>
        <button onclick="essayFormat('insertUnorderedList')" style="padding:6px 10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-warm);cursor:pointer;font-size:13px;color:var(--text-secondary)" title="Ro'yxat">• Ro'yxat</button>
        <button onclick="essayFormat('insertOrderedList')" style="padding:6px 10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-warm);cursor:pointer;font-size:13px;color:var(--text-secondary)" title="Raqamli">1. Raqamli</button>
        <div style="width:1px;background:var(--border-subtle);margin:0 4px"></div>
        <button onclick="essayHeading()" style="padding:6px 10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-warm);cursor:pointer;font-size:13px;font-weight:700;color:var(--text-secondary)" title="Sarlavha">H</button>
        <button onclick="essayFormat('formatBlock','blockquote')" style="padding:6px 10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-warm);cursor:pointer;font-size:13px;color:var(--text-secondary)" title="Iqtibos">❝ Iqtibos</button>
      </div>
      <div id="essay-body" contenteditable="true" style="min-height:400px;max-height:70vh;overflow-y:auto;font-size:15px;line-height:2;color:var(--text-primary);outline:none;padding:4px 0" oninput="updateEssayStats()">${isNew?'<p>Esseni shu yerda yozing...</p>':essay.body||'<p></p>'}</div>
    </div>
  </div>`;
}
else if(essayViewId!==null){
  /* ── ESSAY VIEW ── */
  const essay=essays.find(e=>e.id===essayViewId);
  if(essay){
    h+=`<div class="glass-card" style="padding:0;overflow:hidden">
      <div style="padding:18px 24px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
        <button class="btn btn-ghost btn-sm" onclick="essayViewId=null;renderTajriba()">← Orqaga</button>
        <div style="display:flex;gap:8px">
          <button class="btn btn-amber btn-sm" onclick="essayEditing=${essay.id};essayViewId=null;renderTajriba()">✏️ Tahrirlash</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--accent-coral)" onclick="deleteEssay(${essay.id})">🗑 O'chirish</button>
        </div>
      </div>
      <div style="padding:32px;max-width:680px;margin:0 auto">
        <h1 style="font-family:var(--ff-display);font-size:28px;font-weight:700;margin-bottom:12px;line-height:1.3">${essay.title}</h1>
        <div style="display:flex;gap:16px;font-size:11px;color:var(--text-muted);margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border-subtle)">
          <span>📅 ${essay.date}</span>
          <span>📝 ${essay.wordCount} so'z</span>
          <span>⏱ ~${Math.max(1,Math.ceil(essay.wordCount/200))} daq o'qish</span>
        </div>
        <div style="font-size:15px;line-height:2;color:var(--text-secondary)">${essay.body||essay.excerpt}</div>
      </div>
    </div>`;
  }
}
else{
  /* ── ESSAY LIST ── */
  h+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><div><span style="font-size:12px;color:var(--text-muted)">${essays.length} ta esse</span>${essays.length<3?`<span style="font-size:11px;color:var(--accent-amber);margin-left:8px">(3 ta = ✍️ badge)</span>`:''}</div><button class="btn btn-coral btn-sm" onclick="essayEditing='new';renderTajriba()">✏️ Yangi esse yozish</button></div>`;
  if(essays.length===0){
    h+=`<div class="glass-card" style="text-align:center;padding:48px"><div style="font-size:48px;margin-bottom:12px">✍️</div><h3 style="font-family:var(--ff-display);font-size:18px;margin-bottom:6px">Hali esse yo'q</h3><p style="font-size:13px;color:var(--text-muted);margin-bottom:18px">Birinchi essengizni yozib, tajribangizni ifodalang!</p><button class="btn btn-coral" onclick="essayEditing='new';renderTajriba()">Esse yozishni boshlash</button></div>`;
  } else {
    h+=essays.map(e=>`<div class="glass-card" style="cursor:pointer;transition:all .35s var(--ease)" onclick="essayViewId=${e.id};renderTajriba()" onmouseover="this.style.borderColor='var(--accent-amber)'" onmouseout="this.style.borderColor='var(--bg-glass-border)'">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <h3 style="font-family:var(--ff-display);font-size:18px;flex:1">${e.title}</h3>
        <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();essayEditing=${e.id};renderTajriba()" style="padding:4px 10px">✏️</button>
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();deleteEssay(${e.id})" style="padding:4px 10px;color:var(--accent-coral)">🗑</button>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);font-style:italic;padding:16px;background:var(--border-subtle);border-radius:14px;border-left:3px solid var(--accent-amber);line-height:1.7;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${(e.body||e.excerpt).replace(/<[^>]*>/g,'').substring(0,200)}...</div>
      <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:10px;color:var(--text-muted)">
        <span>📅 ${e.date}</span>
        <span>📝 ${e.wordCount} so'z • ~${Math.max(1,Math.ceil(e.wordCount/200))} daq o'qish</span>
      </div>
    </div>`).join('');
  }
}
document.getElementById('tajriba-c').innerHTML=h;
if(essayEditing!==null)setTimeout(()=>{updateEssayStats();const b=document.getElementById('essay-body');if(b&&essayEditing==='new'){b.addEventListener('focus',function once(){if(b.textContent.trim()==='Esseni shu yerda yozing...'){b.innerHTML='<p><br></p>'}b.removeEventListener('focus',once)});}},50);
}
function essayFormat(cmd,val){document.execCommand(cmd,false,val||null);document.getElementById('essay-body').focus()}
function essayHeading(){const sel=window.getSelection();if(!sel.rangeCount)return;const node=sel.anchorNode.parentElement;if(node.tagName==='H3'){document.execCommand('formatBlock',false,'p')}else{document.execCommand('formatBlock',false,'h3')}document.getElementById('essay-body').focus()}
function updateEssayStats(){const b=document.getElementById('essay-body');if(!b)return;const text=b.textContent.trim();const words=text?text.split(/\s+/).filter(w=>w.length>0).length:0;const chars=text.length;const readMin=Math.max(1,Math.ceil(words/200));const wc=document.getElementById('essay-wc');const cc=document.getElementById('essay-chars');const rt=document.getElementById('essay-time');if(wc)wc.textContent=words+' so\'z';if(cc)cc.textContent=chars+' belgi';if(rt)rt.textContent='~'+readMin+' daq o\'qish'}
function saveEssay(isNew){
  const title=document.getElementById('essay-title').value.trim();
  const body=document.getElementById('essay-body').innerHTML;
  const text=document.getElementById('essay-body').textContent.trim();
  const words=text?text.split(/\s+/).filter(w=>w.length>0).length:0;
  if(!title){alert('Sarlavha kiriting!');return}
  if(words<1){alert('Esse matnini yozing!');return}
  if(isNew){
    essays.push({id:Date.now(),title:title,date:today,wordCount:words,body:body,excerpt:text.substring(0,150)});
  } else {
    const idx=essays.findIndex(e=>e.id===essayEditing);
    if(idx>=0){essays[idx].title=title;essays[idx].body=body;essays[idx].wordCount=words;essays[idx].excerpt=text.substring(0,150)}
  }
  const sv=document.getElementById('essay-saved');if(sv){sv.style.opacity='1';setTimeout(()=>{sv.style.opacity='0'},2000)}
  checkBadges();
}
function deleteEssay(id){if(!confirm('Esseni o\'chirmoqchimisiz?'))return;essays=essays.filter(e=>e.id!==id);essayViewId=null;essayEditing=null;renderTajriba();checkBadges()}
function saveProject(isNew){const title=document.getElementById('pj-title').value.trim(),type=document.getElementById('pj-type').value,status=document.getElementById('pj-status').value,body=document.getElementById('pj-body').innerHTML;if(!title){alert('Loyiha nomini kiriting!');return}if(isNew){projects.push({id:Date.now(),title,type,status,body,feedback:null})}else{const idx=projects.findIndex(p=>p.id===projectEdit);if(idx>=0){projects[idx].title=title;projects[idx].type=type;projects[idx].status=status;projects[idx].body=body}}projectEdit=null;renderTajriba();checkBadges()}
function deleteProject(id){if(!confirm("Loyihani o'chirmoqchimisiz?"))return;projects=projects.filter(p=>p.id!==id);renderTajriba();checkBadges()}

/* ══════ GAMIFICATION ══════ */
function renderGamification(){const bs=getBadges(),ec=earnedCount();const lv=ec>=8?3:ec>=4?2:1;const ln=["","Boshlang'ich sayohatchi","Tajribali tadqiqotchi","Madaniy elchi"][lv];
const nextLvNeed=lv===1?4:lv===2?8:bs.length;const nextLvName=lv===1?"Tajribali tadqiqotchi":lv===2?"Madaniy elchi":"Maksimal daraja!";
let h=`<div class="glass-card" style="text-align:center;padding:36px;margin-bottom:22px;position:relative;overflow:hidden">
  <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:linear-gradient(135deg,var(--accent-amber),var(--accent-coral));filter:blur(60px);opacity:.12"></div>
  <div style="font-size:56px;margin-bottom:10px;position:relative">🏆</div>
  <div style="font-family:var(--ff-display);font-size:24px;margin-bottom:4px;position:relative">Daraja ${lv}: ${ln}</div>
  <div style="font-size:12px;color:var(--text-muted);margin-bottom:18px;position:relative">${ec*150} XP • ${ec}/${bs.length} badge</div>
  <div style="max-width:320px;margin:0 auto;position:relative"><div class="progress-track" style="height:8px"><div class="progress-fill" style="width:${ec/bs.length*100}%;background:linear-gradient(90deg,var(--accent-amber),var(--accent-coral))"></div></div></div>
  ${lv<3?`<div style="font-size:11px;color:var(--text-muted);margin-top:12px;position:relative">Keyingi daraja: <b style="color:var(--accent-amber)">${nextLvName}</b> — yana ${nextLvNeed-ec} badge kerak</div>`:`<div style="font-size:11px;color:var(--accent-jade);margin-top:12px;position:relative;font-weight:600">🎉 Tabriklaymiz! Siz eng yuqori darajaga yetdingiz!</div>`}
</div>`;

h+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div class="card-title">Barcha yutuqlar</div><div style="display:flex;gap:8px"><span class="tag tag-jade">✓ ${ec} ochilgan</span><span class="tag tag-muted">🔒 ${bs.length-ec} qulfda</span></div></div>`;

h+=`<div class="grid-3 stagger">${bs.map(b=>{
  const pct=Math.round(b.cur/b.max*100);
  const colors=b.check?{border:'var(--accent-amber)',bg:'var(--accent-amber-soft)',bar:'linear-gradient(90deg,var(--accent-amber),var(--accent-coral))'}:{border:'var(--border-subtle)',bg:'transparent',bar:'var(--border-medium)'};
  return `<div class="badge-card ${b.check?'earned':'locked'}" style="cursor:pointer;position:relative" onclick="${b.check?'':`goTo('${b.page}')`}">
    ${b.check?`<div style="position:absolute;top:-1px;right:-1px;background:linear-gradient(135deg,var(--accent-jade),#2D8A6A);color:#fff;font-size:9px;font-weight:800;padding:4px 10px;border-radius:0 var(--r-xl) 0 12px;letter-spacing:.5px">OCHILDI</div>`:''}
    <div class="badge-icon" style="margin-bottom:12px">${b.icon}</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:3px">${b.title}</div>
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px">${b.desc}</div>
    <div style="margin:0 auto;max-width:120px;margin-bottom:10px">
      <div style="height:4px;background:var(--border-subtle);border-radius:3px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${colors.bar};border-radius:3px;transition:width .8s var(--ease)"></div>
      </div>
      <div style="font-size:9px;color:var(--text-muted);margin-top:3px;font-weight:600">${pct}%</div>
    </div>
    ${b.check
      ?'<span class="tag tag-jade" style="font-size:10px">✓ +150 XP</span>'
      :`<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();goTo('${b.page}')" style="font-size:10px;padding:5px 12px">${b.hint.split('→')[0].trim()} →</button>`
    }
  </div>`}).join('')}</div>`;

/* Yaqin ochiladigan badgelar */
const almostDone=bs.filter(b=>!b.check&&b.cur/b.max>=0.5).sort((a,b)=>(b.cur/b.max)-(a.cur/a.max));
if(almostDone.length>0){
  h+=`<div class="glass-card" style="margin-top:22px"><div class="card-title" style="margin-bottom:14px">🔥 Yaqinda ochiladigan badgelar</div>${almostDone.map(b=>`<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border-subtle)">
    <div style="font-size:28px">${b.icon}</div>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">${b.title} <span style="font-size:11px;color:var(--text-muted);font-weight:400">${b.desc}</span></div>
      <div style="height:5px;background:var(--border-subtle);border-radius:3px;overflow:hidden;max-width:200px"><div style="width:${Math.round(b.cur/b.max*100)}%;height:100%;background:linear-gradient(90deg,var(--accent-amber),var(--accent-coral));border-radius:3px"></div></div>
    </div>
    <button class="btn btn-amber btn-sm" onclick="goTo('${b.page}')" style="white-space:nowrap">Davom etish →</button>
  </div>`).join('')}</div>`;
}

document.getElementById('gamification-c').innerHTML=h}

/* ══════ QUIZ ══════ */
let qi=0,qSel=null,qAnswered=false,qScore=0,qStarted=false,qDone=false;
function renderQuiz(){const el=document.getElementById('quiz-c');
if(!qStarted){el.innerHTML=`<div class="glass-card" style="text-align:center;padding:50px;position:relative;overflow:hidden"><div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,var(--accent-indigo-soft),transparent 60%),radial-gradient(circle at 70% 60%,var(--accent-coral-soft),transparent 50%)"></div><div style="font-size:64px;margin-bottom:14px;position:relative">🎯</div><h2 style="font-family:var(--ff-display);font-size:26px;margin-bottom:8px;position:relative">Madaniyat viktorinasi</h2><p style="font-size:14px;color:var(--text-muted);margin-bottom:24px;position:relative">${QUIZ.length} savol${quizBest>0?' • Rekord: '+quizBest+'/'+QUIZ.length:''}</p><button class="btn btn-coral" style="padding:14px 36px;font-size:15px;position:relative" onclick="qStarted=true;qi=0;qScore=0;qSel=null;qAnswered=false;qDone=false;renderQuiz()">Boshlash 🚀</button></div>`;return}
if(qDone){el.innerHTML=`<div class="glass-card" style="text-align:center;padding:50px"><div style="font-size:64px;margin-bottom:14px">${qScore>=QUIZ.length*0.8?'🏆':qScore>=QUIZ.length*0.5?'🎉':'📚'}</div><h2 style="font-family:var(--ff-display);font-size:24px">Natija: ${qScore}/${QUIZ.length}</h2><div style="font-family:var(--ff-display);font-size:48px;margin:16px 0;background:linear-gradient(135deg,${qScore>=QUIZ.length*0.5?'var(--accent-jade),#2D8A6A':'var(--accent-coral),#D04A38'});-webkit-background-clip:text;-webkit-text-fill-color:transparent">${Math.round(qScore/QUIZ.length*100)}%</div><button class="btn btn-coral" onclick="qStarted=false;renderQuiz()">Qayta boshlash</button></div>`;return}
const q=QUIZ[qi];
el.innerHTML=`<div class="glass-card" style="max-width:640px"><div class="progress-track" style="margin-bottom:20px"><div class="progress-fill" style="width:${(qi+1)/QUIZ.length*100}%;background:linear-gradient(90deg,var(--accent-indigo),var(--accent-plum))"></div></div><div style="display:flex;justify-content:space-between;margin-bottom:18px"><span class="tag tag-indigo">Savol ${qi+1}/${QUIZ.length}</span><span class="tag tag-jade">✓ ${qScore}</span></div><h3 style="font-family:var(--ff-display);font-size:19px;margin-bottom:22px;line-height:1.5">${q.q}</h3>${q.opts.map((o,i)=>`<button class="quiz-opt ${qAnswered&&i===q.c?'correct':''} ${qAnswered&&qSel===i&&i!==q.c?'wrong':''}" onclick="quizAnswer(${i})"><span style="font-weight:700;margin-right:8px;opacity:.4">${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}${qAnswered?`<div style="text-align:right;margin-top:16px"><button class="btn btn-coral" onclick="quizNext()">${qi<QUIZ.length-1?'Keyingi →':'Natijalarni ko\'rish'}</button></div>`:''}</div>`}
function quizAnswer(i){if(qAnswered)return;qSel=i;qAnswered=true;if(i===QUIZ[qi].c)qScore++;renderQuiz()}
function quizNext(){if(qi<QUIZ.length-1){qi++;qSel=null;qAnswered=false}else{qDone=true;if(qScore>quizBest){quizBest=qScore;checkBadges()}}renderQuiz()}

/* ══════ JOURNAL ══════ */
let jOpen=false,jMood="😊",jEdit=null;
function renderJournal(){const MOODS=["😊","🤔","😄","😐","🤩","😢"];
let h=`<div style="display:flex;justify-content:space-between;margin-bottom:20px"><div style="font-size:12px;color:var(--text-muted)">📖 ${journal.length} yozuv${journal.length<7?` <span style="color:var(--accent-amber)">(7 ta = 🔥)</span>`:''}</div><button class="btn btn-coral btn-sm" onclick="jOpen=true;jEdit=null;renderJournal()">✏️ Yangi</button></div>`;
if(jOpen||jEdit!==null){
  const isEdit=jEdit!==null;
  const entry=isEdit?journal.find(e=>e.id===jEdit):{mood:'😊',title:'',text:''};
  if(isEdit&&entry)jMood=entry.mood;
  h+=`<div class="glass-card" style="padding:0;overflow:hidden;margin-bottom:18px">
    <div style="padding:16px 22px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:10px"><button class="btn btn-ghost btn-sm" onclick="jOpen=false;jEdit=null;renderJournal()">← Orqaga</button><span style="font-size:12px;color:var(--text-muted)">${isEdit?'Tahrirlash':'Yangi yozuv'}</span></div>
      <button class="btn btn-jade btn-sm" onclick="saveJournal(${isEdit})">💾 Saqlash</button>
    </div>
    <div style="padding:24px">
      <div style="margin-bottom:16px"><label class="form-label">Kayfiyat</label><div style="display:flex;gap:8px;margin-top:6px">${MOODS.map(m=>`<button onclick="jMood='${m}';document.querySelectorAll('.mood-btn').forEach(b=>{b.style.border='2px solid transparent';b.style.background='transparent'});this.style.border='2px solid var(--accent-amber)';this.style.background='var(--accent-amber-soft)'" class="mood-btn" style="font-size:32px;padding:8px;border:2px solid ${jMood===m?'var(--accent-amber)':'transparent'};border-radius:14px;cursor:pointer;background:${jMood===m?'var(--accent-amber-soft)':'transparent'};transition:.2s">${m}</button>`).join('')}</div></div>
      <div class="form-field"><label class="form-label">Sarlavha</label><input class="form-input" id="j-title" value="${isEdit?entry.title.replace(/"/g,'&quot;'):''}" placeholder="Bugungi kuzatish sarlavhasi..." style="font-size:16px;font-weight:600"/></div>
      <div class="form-field"><label class="form-label">Kundalik matni</label><div id="j-text" contenteditable="true" style="min-height:200px;font-size:14px;line-height:2;color:var(--text-primary);outline:none;padding:16px;border:1px solid var(--border-medium);border-radius:14px;background:var(--bg-warm)" onfocus="this.style.borderColor='var(--accent-amber)';this.style.boxShadow='0 0 0 3px var(--accent-amber-soft)'" onblur="this.style.borderColor='var(--border-medium)';this.style.boxShadow='none'">${isEdit?(entry.text||''):''}</div></div>
    </div>
  </div>`;
}
h+=journal.map(e=>`<div class="journal-entry">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <div style="display:flex;align-items:center;gap:10px"><span style="font-size:26px">${e.mood}</span><span style="font-size:15px;font-weight:600">${e.title}</span></div>
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:10px;color:var(--text-muted)">${e.date}</span>
      <button class="btn btn-ghost btn-sm" onclick="jEdit=${e.id};jOpen=false;renderJournal()" style="padding:3px 8px">✏️</button>
      <button class="btn btn-ghost btn-sm" onclick="deleteJournal(${e.id})" style="padding:3px 8px;color:var(--accent-coral)">🗑</button>
    </div>
  </div>
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.8">${e.text}</div>
</div>`).join('');
document.getElementById('journal-c').innerHTML=h}
function saveJournal(isEdit){const t=document.getElementById('j-title').value.trim(),txt=document.getElementById('j-text').innerHTML;const plainTxt=document.getElementById('j-text').textContent.trim();if(!t||!plainTxt){alert('Sarlavha va matn kiriting!');return}if(isEdit){const idx=journal.findIndex(e=>e.id===jEdit);if(idx>=0){journal[idx].mood=jMood;journal[idx].title=t;journal[idx].text=txt}}else{journal.unshift({id:Date.now(),date:today,mood:jMood,title:t,text:txt})}jOpen=false;jEdit=null;renderJournal();checkBadges()}
function deleteJournal(id){if(!confirm("Yozuvni o'chirmoqchimisiz?"))return;journal=journal.filter(e=>e.id!==id);renderJournal();checkBadges()}

/* ══════ CALENDAR ══════ */
function renderCalendar(){
const todayNum=21; /* Feb 21 — current month is March coming */
let h=`<div class="glass-card" style="margin-bottom:20px">
  <div style="text-align:center;margin-bottom:18px"><h2 style="font-family:var(--ff-display);font-size:22px">Mart 2026</h2>
    <p style="font-size:11px;color:var(--text-muted);margin-top:4px">${CAL_EVENTS.length} ta voqea rejalashtirilgan</p>
  </div>
  <div class="cal-grid" style="margin-bottom:10px">${"Du Se Ch Pa Ju Sh Ya".split(" ").map(d=>`<div style="text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);padding:8px">${d}</div>`).join('')}</div><div class="cal-grid">`;
for(let i=0;i<37;i++){if(i<6){h+='<div></div>';continue}const d=i-5;if(d>31)break;const ds=`2026-03-${String(d).padStart(2,'0')}`;const evs=CAL_EVENTS.filter(e=>e.date===ds);const isModStart=evs.some(e=>e.type==='modul');
h+=`<div class="cal-cell ${evs.length?'has-event':''}" style="background:${isModStart?'linear-gradient(135deg,var(--accent-amber),var(--accent-coral))':'transparent'};color:${isModStart?'#fff':'var(--text-primary)'};border-radius:12px;position:relative" ${evs.length?`title="${evs.map(e=>e.title).join(', ')}"`:''}>${d}${evs.length>0?`<div style="display:flex;gap:2px;justify-content:center;margin-top:2px">${evs.slice(0,3).map(e=>`<div class="cal-dot" style="background:${e.color};position:static;margin:0"></div>`).join('')}</div>`:''}</div>`}
h+=`</div></div>`;

/* Events list grouped by type */
const modulEvents=CAL_EVENTS.filter(e=>e.type==='modul');
const taskEvents=CAL_EVENTS.filter(e=>e.type==='task');
const otherEvents=CAL_EVENTS.filter(e=>e.type!=='modul'&&e.type!=='task');

h+=`<div class="glass-card">
  <div class="card-title" style="margin-bottom:16px">📅 Kelgusi voqealar</div>
  ${modulEvents.length?`<div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📘 Modul boshlanishlari</div>
    ${modulEvents.map(e=>{const m=e.modId?MODULES.find(x=>x.id===e.modId):null;return`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:6px;background:var(--accent-amber-soft);border-radius:12px;border-left:3px solid var(--accent-amber);cursor:pointer" onclick="${m?`openModule=${m.id};goTo('dashboard')`:''}">
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent-amber),var(--accent-coral));color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">${e.modId||'?'}</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:600">${e.title}</div><div style="font-size:10px;color:var(--text-muted)">${e.date}${m?' • '+m.topics.length+' mavzu • '+m.tasks.length+' topshiriq':''}</div></div>
      <span style="font-size:11px;color:var(--accent-amber)">→</span>
    </div>`}).join('')}
  </div>`:''}
  ${taskEvents.length?`<div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">✅ Topshiriq deadlinelari</div>
    ${taskEvents.map((e,i)=>{const m=e.modId?MODULES.find(x=>x.id===e.modId):null;return`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i<taskEvents.length-1?'border-bottom:1px solid var(--border-subtle)':''}">
      <div style="width:10px;height:10px;border-radius:50%;background:${e.color};box-shadow:0 0 8px ${e.color}40;flex-shrink:0"></div>
      <div style="flex:1"><div style="font-size:13px;font-weight:600">${e.title}</div><div style="font-size:10px;color:var(--text-muted)">${e.date}${m?' • Modul '+m.id:''}</div></div>
    </div>`}).join('')}
  </div>`:''}
  ${otherEvents.length?`<div><div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📌 Boshqa</div>
    ${otherEvents.map((e,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i<otherEvents.length-1?'border-bottom:1px solid var(--border-subtle)':''}">
      <div style="width:10px;height:10px;border-radius:50%;background:${e.color};flex-shrink:0"></div>
      <div><div style="font-size:13px;font-weight:600">${e.title}</div><div style="font-size:10px;color:var(--text-muted)">${e.date}</div></div>
    </div>`).join('')}
  </div>`:''}
</div>`;

document.getElementById('calendar-c').innerHTML=h}

/* ══════ MAP ══════ */
function renderMap(){
const doneCount=MODULES.filter(m=>m.status==='done').length;
const totalTasks=MODULES.reduce((a,m)=>a+getFilteredTasks(m).length,0);
const doneTasks=MODULES.reduce((a,m)=>a+getFilteredTasks(m).filter(t=>t.done).length,0);

let h=`<div class="glass-card" style="text-align:center;padding:28px;margin-bottom:22px;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,var(--accent-amber-soft),transparent 60%),radial-gradient(circle at 70% 60%,var(--accent-jade-soft),transparent 50%)"></div>
  <h2 style="font-family:var(--ff-display);font-size:22px;position:relative">Sizning madaniy sayohatingiz</h2>
  <p style="font-size:12px;color:var(--text-muted);margin-top:4px;position:relative">Koreya madaniyatiga qadam-baqadam</p>
  <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;position:relative">
    <div><span style="font-size:22px;font-weight:800;color:var(--accent-jade);font-family:var(--ff-display)">${doneCount}</span><span style="font-size:11px;color:var(--text-muted)">/${MODULES.length} modul</span></div>
    <div style="width:1px;background:var(--border-medium)"></div>
    <div><span style="font-size:22px;font-weight:800;color:var(--accent-amber);font-family:var(--ff-display)">${doneTasks}</span><span style="font-size:11px;color:var(--text-muted)">/${totalTasks} topshiriq</span></div>
  </div>
  <div style="max-width:300px;margin:14px auto 0;height:6px;background:var(--border-subtle);border-radius:4px;position:relative"><div style="width:${doneTasks/totalTasks*100}%;height:100%;background:linear-gradient(90deg,var(--accent-jade),var(--accent-amber));border-radius:4px;transition:width .8s"></div></div>
</div><div style="max-width:600px;margin:0 auto">`;

MODULES.forEach((m,i)=>{
  const mapFiltered=getFilteredTasks(m);const tasksDone=mapFiltered.filter(t=>t.done).length;
  const isOpen=openMapModule===m.id;
  h+=`<div style="display:flex">
    <div style="width:50px;display:flex;flex-direction:column;align-items:center">
      <div style="width:34px;height:34px;border-radius:12px;background:${m.status==='done'?'linear-gradient(135deg,var(--accent-jade),#2D8A6A)':m.status==='active'?'linear-gradient(135deg,var(--accent-amber),var(--accent-coral))':'var(--border-subtle)'};color:${m.status==='locked'?'var(--text-muted)':'#fff'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;z-index:2;box-shadow:${m.status!=='locked'?'0 4px 12px rgba(0,0,0,.15)':'none'};cursor:pointer" onclick="openMapModule=openMapModule===${m.id}?null:${m.id};renderMap()">${m.status==='done'?'✓':m.id}</div>
      ${i<MODULES.length-1?`<div style="flex:1;width:2px;background:${m.status==='done'?'var(--accent-jade)':'var(--border-subtle)'}"></div>`:''}
    </div>
    <div style="flex:1;padding:0 0 ${isOpen?'12':'24'}px 16px">
      <div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="openMapModule=openMapModule===${m.id}?null:${m.id};renderMap()">
        <span style="font-size:15px;font-weight:700;color:${m.status==='locked'?'var(--text-muted)':'var(--text-primary)'}">${m.title}</span>
        ${m.status==='active'?'<span class="tag tag-amber" style="font-size:9px">Hozir!</span>':''}
        ${m.score?`<span class="tag tag-jade" style="font-size:10px">${m.score}</span>`:''}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${m.date} • ${m.desc} • <span style="color:${tasksDone===mapFiltered.length?'var(--accent-jade)':'var(--text-muted)'}">${tasksDone}/${mapFiltered.length} topshiriq (${studentLevel})</span></div>
      ${isOpen?`<div style="margin-top:12px;padding:16px;background:var(--bg-elevated);border-radius:14px;border:1px solid var(--border-subtle)">
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">${m.topics.map(t=>`<span class="tag tag-indigo" style="font-size:10px">${t}</span>`).join('')}</div>
        ${mapFiltered.map((t,ti)=>{const origIdx=m.tasks.indexOf(t);const bl=BLOOM_LEVELS[t.bloom];return`<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;font-size:12px;${t.done?'color:var(--text-muted);text-decoration:line-through':''}" ${m.status!=='locked'?`onclick="toggleMapTask(${m.id},${origIdx})" style="cursor:pointer;display:flex;align-items:flex-start;gap:8px;padding:6px 0;font-size:12px;${t.done?'color:var(--text-muted);text-decoration:line-through':''}"`:''}><span style="width:16px;height:16px;border-radius:5px;border:2px solid ${t.done?'var(--accent-jade)':'var(--border-medium)'};background:${t.done?'var(--accent-jade)':'transparent'};display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;flex-shrink:0;margin-top:1px">${t.done?'✓':''}</span><div><span>${t.t}</span><div style="display:flex;gap:3px;margin-top:2px"><span style="font-size:8px;padding:1px 5px;border-radius:3px;background:${bl?.color}15;color:${bl?.color}">${bl?.icon} ${bl?.label}</span><span style="font-size:8px;padding:1px 5px;border-radius:3px;background:var(--accent-indigo-soft);color:var(--accent-indigo)">${t.level}</span></div></div></div>`}).join('')}
        <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:5px">${m.keyVocab.map(v=>`<span style="padding:3px 8px;border-radius:6px;background:var(--accent-plum-soft);color:var(--accent-plum);font-size:10px;font-family:var(--ff-kr)">${v}</span>`).join('')}</div>
      </div>`:''}
    </div>
  </div>`});

h+=`<div style="text-align:center;padding:24px"><div style="font-size:40px;margin-bottom:6px">🎓</div><div style="font-family:var(--ff-display);font-size:18px;background:linear-gradient(135deg,var(--accent-amber),var(--accent-coral));-webkit-background-clip:text;-webkit-text-fill-color:transparent">Manzil: Madaniy elchi</div></div></div>`;
document.getElementById('map-c').innerHTML=h}

/* ══════ VR TOUR ══════ */
let vrLoc=VR_LOCS[0],vrShowFacts=false,vrHotspot=null;
function renderVR(){vrVisited.add(vrLoc.id);checkBadges();
let h=`<div class="grid-4 stagger" style="margin-bottom:18px">${VR_LOCS.map(l=>`<div onclick="vrLoc=VR_LOCS.find(x=>x.id==='${l.id}');vrHotspot=null;vrShowFacts=false;renderVR()" style="padding:16px 12px;border-radius:var(--r-xl);border:${vrLoc.id===l.id?'2px solid var(--accent-amber)':'1px solid var(--border-subtle)'};background:${vrLoc.id===l.id?'var(--accent-amber-soft)':'var(--bg-elevated)'};cursor:pointer;text-align:center;position:relative;transition:all .3s var(--ease);backdrop-filter:var(--glass-blur)" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">${vrVisited.has(l.id)?'<span style="position:absolute;top:8px;right:8px;font-size:10px;color:var(--accent-jade)">✓</span>':''}<div style="font-size:28px;margin-bottom:6px">${l.icon}</div><div style="font-size:12px;font-weight:700">${l.nameKr}</div><div style="font-size:10px;color:var(--text-muted)">${l.sub}</div></div>`).join('')}</div>`;

h+=`<div class="glass-card" style="padding:0;overflow:hidden;margin-bottom:18px">
  <div style="padding:14px 22px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
    <div class="card-title">🕶️ ${vrLoc.nameKr} — ${vrLoc.sub}</div>
    <div style="display:flex;gap:6px;align-items:center">
      <span class="tag tag-plum">📷 Panorama</span>
      <span class="tag tag-jade">${vrVisited.size}/${VR_LOCS.length}</span>
    </div>
  </div>
  <div id="vr-pano" style="position:relative;width:100%;height:420px;overflow:hidden;cursor:grab;background:#1a1a2e;user-select:none">
    <img id="vr-img" src="${vrLoc.img}" alt="${vrLoc.nameKr}" draggable="false"
      style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);min-width:100%;min-height:100%;width:auto;height:140%;object-fit:cover;transition:none;pointer-events:none"/>
    <div id="vr-overlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(15,12,20,.85);z-index:5;transition:opacity .6s">
      <div style="text-align:center;color:#fff">
        <div style="font-size:48px;margin-bottom:12px;animation:pulse 2s infinite">📷</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:4px">Rasm yuklanmoqda...</div>
        <div style="font-size:11px;color:rgba(255,255,255,.4)">Sichqoncha bilan suring yoki barmoq bilan aylantiring</div>
      </div>
    </div>
    ${vrLoc.hs.map((hs,i)=>`<div class="vr-hs" onclick="vrHotspot=vrHotspot===${i}?null:${i};renderVR()" style="position:absolute;left:${hs.x}%;top:${hs.y}%;transform:translate(-50%,-50%);width:32px;height:32px;border-radius:50%;background:${vrHotspot===i?'linear-gradient(135deg,var(--accent-amber),var(--accent-coral))':'rgba(255,255,255,.9)'};border:2px solid var(--accent-amber);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${vrHotspot===i?'#fff':'var(--accent-amber)'};box-shadow:0 2px 14px rgba(0,0,0,.4);animation:pulse 2.5s infinite;z-index:10">${i+1}</div>`).join('')}
    ${vrHotspot!==null?`<div style="position:absolute;left:${vrLoc.hs[vrHotspot].x}%;top:${Math.max(5,vrLoc.hs[vrHotspot].y-18)}%;transform:translateX(-50%);background:rgba(0,0,0,.88);backdrop-filter:blur(12px);color:#fff;padding:12px 18px;border-radius:14px;font-size:12px;max-width:220px;z-index:20;box-shadow:0 8px 28px rgba(0,0,0,.4)"><b>${vrLoc.hs[vrHotspot].l}</b><div style="color:rgba(255,255,255,.6);margin-top:3px">${vrLoc.hs[vrHotspot].d}</div></div>`:''}
    <div style="position:absolute;bottom:0;left:0;right:0;padding:12px 16px;background:linear-gradient(transparent,rgba(0,0,0,.7));display:flex;justify-content:space-between;align-items:center;z-index:8">
      <div style="display:flex;gap:8px">${vrLoc.nb.map(nId=>{const nl=VR_LOCS.find(l=>l.id===nId);return`<button onclick="event.stopPropagation();vrLoc=VR_LOCS.find(x=>x.id==='${nId}');vrHotspot=null;vrShowFacts=false;renderVR()" style="padding:7px 14px;border-radius:16px;border:none;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);color:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--ff-body);transition:.2s" onmouseover="this.style.background='rgba(255,255,255,.3)'" onmouseout="this.style.background='rgba(255,255,255,.15)'">${nl.icon} ${nl.nameKr} →</button>`}).join('')}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.5)">↔ Suring</div>
    </div>
  </div>
  <div style="padding:12px 22px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:11px;color:var(--text-muted)">📸 Wikimedia Commons • CC BY-SA</div>
    <a href="https://topo360vr.com/file/2016/gyeongbokgung/vtour/index.html" target="_blank" class="btn btn-ghost btn-sm" style="font-size:11px">🕶️ 360° VR tur ↗</a>
  </div>
</div>`;

h+=`<div class="grid-2"><div class="glass-card">
  <div class="card-title" style="margin-bottom:12px">📖 Tavsif</div>
  <p style="font-size:13px;line-height:1.8;color:var(--text-secondary)">${vrLoc.desc}</p>
  <div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:6px">${vrLoc.hs.map(h=>`<span class="tag tag-amber" style="cursor:help" title="${h.d}">📍 ${h.l}</span>`).join('')}</div>
  <button class="btn btn-ghost btn-sm" onclick="vrShowFacts=!vrShowFacts;renderVR()" style="margin-top:14px">${vrShowFacts?'Yopish ▲':'Faktlar ▼'}</button>
  ${vrShowFacts?`<div style="padding:14px;background:var(--border-subtle);border-radius:14px;margin-top:10px">${vrLoc.facts.map(f=>`<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;display:flex;align-items:center;gap:8px"><span style="width:5px;height:5px;border-radius:50%;background:var(--accent-amber);flex-shrink:0"></span>${f}</div>`).join('')}</div>`:''}
</div><div class="glass-card">
  <div class="card-title" style="margin-bottom:12px">🎌 Madaniy kontekst</div>
  <p style="font-size:13px;line-height:1.8;color:var(--text-secondary)">${vrLoc.cultural}</p>
  <div style="margin-top:16px;padding:16px;background:var(--accent-indigo-soft);border-radius:14px;text-align:center">
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Gyeongbokgung saroyi</div>
    <div style="font-family:var(--ff-kr);font-size:20px;font-weight:700;color:var(--accent-indigo)">경복궁</div>
    <div style="font-size:10px;color:var(--text-muted);margin-top:4px">1395-yil qurilgan • Seul, Koreya</div>
  </div>
</div></div>`;

document.getElementById('vr-c').innerHTML=h;
/* Image load handler */
const img=document.getElementById('vr-img');
const overlay=document.getElementById('vr-overlay');
if(img){img.onload=()=>{if(overlay){overlay.style.opacity='0';setTimeout(()=>overlay.style.display='none',600)}};img.onerror=()=>{if(overlay)overlay.innerHTML='<div style="text-align:center;color:#fff"><div style="font-size:40px;margin-bottom:10px">⚠️</div><div style="font-size:13px">Rasm yuklanmadi</div><a href="'+vrLoc.img+'" target="_blank" style="color:var(--accent-amber);font-size:12px;display:inline-block;margin-top:8px">Rasmni ochish ↗</a></div>'}}
/* Drag to pan */
const pano=document.getElementById('vr-pano');
if(pano){let isDrag=false,startX=0,startY=0,imgX=0,imgY=0;
pano.addEventListener('mousedown',e=>{if(e.target.closest('.vr-hs')||e.target.tagName==='BUTTON')return;isDrag=true;startX=e.clientX;startY=e.clientY;const im=document.getElementById('vr-img');const r=im.getBoundingClientRect();const p=pano.getBoundingClientRect();imgX=r.left-p.left;imgY=r.top-p.top;pano.style.cursor='grabbing'});
pano.addEventListener('mousemove',e=>{if(!isDrag)return;const dx=e.clientX-startX;const dy=e.clientY-startY;const im=document.getElementById('vr-img');const p=pano.getBoundingClientRect();const maxX=0,maxY=0;const minX=p.width-im.offsetWidth;const minY=p.height-im.offsetHeight;const nx=Math.max(minX,Math.min(maxX,imgX+dx));const ny=Math.max(minY,Math.min(maxY,imgY+dy));im.style.position='absolute';im.style.left=nx+'px';im.style.top=ny+'px';im.style.transform='none'});
pano.addEventListener('mouseup',()=>{isDrag=false;pano.style.cursor='grab'});
pano.addEventListener('mouseleave',()=>{isDrag=false;pano.style.cursor='grab'});
/* Touch support */
let tStartX=0,tStartY=0,tImgX=0,tImgY=0;
pano.addEventListener('touchstart',e=>{if(e.target.closest('.vr-hs')||e.target.tagName==='BUTTON')return;const t=e.touches[0];tStartX=t.clientX;tStartY=t.clientY;const im=document.getElementById('vr-img');const r=im.getBoundingClientRect();const p=pano.getBoundingClientRect();tImgX=r.left-p.left;tImgY=r.top-p.top},{passive:true});
pano.addEventListener('touchmove',e=>{const t=e.touches[0];const dx=t.clientX-tStartX;const dy=t.clientY-tStartY;const im=document.getElementById('vr-img');const p=pano.getBoundingClientRect();const minX=p.width-im.offsetWidth;const minY=p.height-im.offsetHeight;const nx=Math.max(minX,Math.min(0,tImgX+dx));const ny=Math.max(minY,Math.min(0,tImgY+dy));im.style.position='absolute';im.style.left=nx+'px';im.style.top=ny+'px';im.style.transform='none'},{passive:true});
}}

/* ══════ KUTUBXONA ══════ */
const BOOK_CHAPTERS=[
  {id:1,unit:"제1단원",title:"한국 — Koreya",titleUz:"Koreya haqida",pages:"6-15",topics:["Ajoyib mamlakat","Taegukgi va Mugunghwa","Hangul","Koreya oilasi","Salomlashish odatlari"],modLink:1,color:"var(--accent-coral)"},
  {id:2,unit:"제2단원",title:"일생의 의례 — Hayot marosimlari",titleUz:"Hayot marosimlari",pages:"18-27",topics:["Tug'ilish","Pekil va Dol","Nikoh","Hwegap","Dafn va Jesa"],modLink:1,color:"var(--accent-amber)"},
  {id:3,unit:"제3단원",title:"의생활 — Kiyim-kechak",titleUz:"Hanbok va kiyim madaniyati",pages:"30-33",topics:["Hanbok xususiyatlari","Hanbok turlari"],modLink:null,color:"var(--accent-plum)"},
  {id:4,unit:"제4단원",title:"식생활 — Ovqatlanish",titleUz:"Koreya oshxonasi",pages:"36-45",topics:["Dasturxon va ovqat odobi","Kundalik taomlar","Kimchi va Bulgogi","Maxsus taomlar","Turli achitqilar"],modLink:2,color:"var(--accent-jade)"},
  {id:5,unit:"제5단원",title:"주거생활 — Uy-joy",titleUz:"Hanok — an'anaviy uy",pages:"48-51",topics:["Hanok afzalliklari","Hanok tuzilishi"],modLink:null,color:"var(--accent-indigo)"},
  {id:6,unit:"제6단원",title:"명절과 세시풍속 — Bayramlar",titleUz:"Bayramlar va urf-odatlar",pages:"54-59",topics:["Sollal (설날)","Jeongwol Daeboreum","Dano","Chuseok (추석)"],modLink:1,color:"var(--accent-coral)"},
  {id:7,unit:"제7단원",title:"민속놀이 — Xalq o'yinlari",titleUz:"An'anaviy o'yinlar",pages:"62-73",topics:["Bolalar o'yinlari","Kattalar o'yinlari"],modLink:5,color:"var(--accent-amber)"},
  {id:8,unit:"제8단원",title:"민속예술 — Xalq san'ati",titleUz:"San'at va e'tiqodlar",pages:"76-83",topics:["An'anaviy raqslar","Pungmul","Pansori","Arirang","Taekwondo","Xalq e'tiqodlari"],modLink:5,color:"var(--accent-plum)"},
  {id:9,unit:"제9단원",title:"전통공예 — Hunarmandchilik",titleUz:"An'anaviy hunarmandchilik",pages:"86-91",topics:["Sopol idishlar","Metall ishlari","Niqob yasash","Hanji qog'oz","Boshqa hunarlar"],modLink:5,color:"var(--accent-jade)"},
  {id:10,unit:"제10단원",title:"문화유적 — Madaniy yodgorliklar",titleUz:"Jahon merosi",pages:"94-117",topics:["Seoul va Gyeonggi","Gangwon","Chungcheong","Honam","Yeongnam","Jeju","Shimoliy Koreya"],modLink:null,color:"var(--accent-indigo)"}
];
const FLIPBOOK_URL="https://heyzine.com/flip-book/489d8dfcd4.html";
let bookView="chapters",activeChapter=null;

function renderKutubxona(){
let h=`<div class="glass-card" style="text-align:center;padding:28px;margin-bottom:22px;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,var(--accent-indigo-soft),transparent 60%),radial-gradient(circle at 70% 60%,var(--accent-plum-soft),transparent 50%)"></div>
  <div style="font-size:48px;position:relative;margin-bottom:8px">📚</div>
  <h2 style="font-family:var(--ff-display);font-size:22px;position:relative">한국문화 Kutubxonasi</h2>
  <p style="font-size:12px;color:var(--text-muted);margin-top:4px;position:relative">한글학교 학생용 한국문화 — 120 sahifa, 10 bo'lim</p>
  <div style="display:flex;justify-content:center;gap:10px;margin-top:16px;position:relative">
    <button class="btn ${bookView==='chapters'?'btn-indigo':'btn-ghost'} btn-sm" onclick="bookView='chapters';activeChapter=null;renderKutubxona()">📖 Bo'limlar</button>
    <button class="btn ${bookView==='reader'?'btn-indigo':'btn-ghost'} btn-sm" onclick="bookView='reader';renderKutubxona()">📕 Kitobni o'qish</button>
  </div>
</div>`;

if(bookView==='reader'){
  h+=`<div class="glass-card" style="padding:0;overflow:hidden;border-radius:var(--r-xl)">
    <iframe src="${FLIPBOOK_URL}" style="width:100%;height:75vh;min-height:500px;border:none;display:block" allowfullscreen></iframe>
  </div>
  <div style="text-align:center;margin-top:12px">
    <a href="${FLIPBOOK_URL}" target="_blank" class="btn btn-ghost btn-sm">↗ Yangi oynada ochish</a>
  </div>`;
} else {
  /* Chapters grid */
  h+=`<div class="grid-2">`;
  BOOK_CHAPTERS.forEach(ch=>{
    const isOpen=activeChapter===ch.id;
    const mod=ch.modLink?MODULES.find(m=>m.id===ch.modLink):null;
    h+=`<div class="glass-card" style="padding:0;overflow:hidden;border-top:3px solid ${ch.color};cursor:pointer;transition:all .3s var(--ease)" onclick="activeChapter=activeChapter===${ch.id}?null:${ch.id};renderKutubxona()">
      <div style="padding:18px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span class="tag" style="background:${ch.color}15;color:${ch.color};font-size:10px;font-weight:700">${ch.unit}</span>
          <span style="font-size:10px;color:var(--text-muted)">📄 ${ch.pages}</span>
        </div>
        <div style="font-size:14px;font-weight:700;font-family:var(--ff-kr);margin-bottom:4px">${ch.title.split(' — ')[0]}</div>
        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${ch.titleUz}</div>
        ${mod?`<div style="margin-top:8px"><span class="tag tag-amber" style="font-size:9px;cursor:pointer" onclick="event.stopPropagation();openModule=${mod.id};goTo('dashboard')">→ Modul ${mod.id}: ${mod.title.split('(')[0].trim()}</span></div>`:''}
      </div>
      ${isOpen?`<div style="padding:0 18px 18px;border-top:1px solid var(--border-subtle)">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin:12px 0 8px">Mavzular:</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px">${ch.topics.map(t=>`<span class="tag tag-indigo" style="font-size:10px">${t}</span>`).join('')}</div>
        <button class="btn btn-indigo btn-sm" onclick="event.stopPropagation();bookView='reader';renderKutubxona()" style="width:100%">📖 Kitobni ochish (${ch.pages}-sahifalar)</button>
      </div>`:''}
    </div>`;
  });
  h+=`</div>`;
}

document.getElementById('kutubxona-c').innerHTML=h}

/* ══════ TEACHER ══════ */
let tTab="dashboard",tStudent=null,tGrading=null;
function renderTeacher(){
const avg=Math.round(STUDENTS.reduce((a,s)=>a+s.progress,0)/STUDENTS.length);
const avgScore=Math.round(STUDENTS.reduce((a,s)=>a+s.score,0)/STUDENTS.length);
const totalBadges=STUDENTS.reduce((a,s)=>a+s.badges,0);
const totalEssays=STUDENTS.reduce((a,s)=>a+s.essays,0);
const topStudent=STUDENTS.reduce((a,b)=>a.score>b.score?a:b);
const needHelp=STUDENTS.filter(s=>s.progress<50);

let h=`<div class="tabs" style="margin-bottom:20px">
  <button class="tab-btn ${tTab==='dashboard'?'active':''}" onclick="tTab='dashboard';tStudent=null;tGrading=null;renderTeacher()">📊 Dashboard</button>
  <button class="tab-btn ${tTab==='students'?'active':''}" onclick="tTab='students';tStudent=null;tGrading=null;renderTeacher()">👥 Talabalar</button>
  <button class="tab-btn ${tTab==='grading'?'active':''}" onclick="tTab='grading';renderTeacher()">✅ Baholash</button>
  <button class="tab-btn ${tTab==='analytics'?'active':''}" onclick="tTab='analytics';renderTeacher()">📈 Tahlil</button>
</div>`;

/* ═══════ DASHBOARD TAB ═══════ */
if(tTab==='dashboard'){
  h+=`<div class="grid-4 stagger" style="margin-bottom:22px">${[
    {n:STUDENTS.length,l:"Talabalar",em:"👥",c:"var(--accent-indigo)",bg:"var(--accent-indigo)"},
    {n:avgScore,l:"O'rtacha ball",em:"📊",c:"var(--accent-amber)",bg:"var(--accent-amber)"},
    {n:totalBadges,l:"Jami badgelar",em:"🏅",c:"var(--accent-jade)",bg:"var(--accent-jade)"},
    {n:totalEssays,l:"Jami esselar",em:"✍️",c:"var(--accent-plum)",bg:"var(--accent-plum)"}
  ].map(s=>`<div class="stat-card" style="text-align:center"><div class="stat-glow" style="background:${s.bg}"></div><div class="stat-emoji">${s.em}</div><div class="stat-number" style="color:${s.c};font-size:26px">${s.n}</div><div class="stat-label">${s.l}</div></div>`).join('')}</div>`;

  /* Quick overview cards */
  h+=`<div class="grid-2">
    <div class="glass-card" style="overflow:hidden;position:relative">
      <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(58,158,126,.08),transparent);pointer-events:none"></div>
      <div class="card-title" style="margin-bottom:16px">🏆 Top talaba</div>
      <div style="display:flex;align-items:center;gap:16px">
        <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--accent-jade),#2D8A6A);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:800">${topStudent.name.split(' ').map(n=>n[0]).join('')}</div>
        <div>
          <div style="font-size:16px;font-weight:700">${topStudent.name}</div>
          <div style="font-size:12px;color:var(--text-muted)">${topStudent.score} ball • ${topStudent.badges} badge • ${topStudent.progress}%</div>
        </div>
      </div>
    </div>
    ${needHelp.length>0?`<div class="glass-card" style="overflow:hidden;position:relative;border-left:3px solid var(--accent-coral)">
      <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(232,96,76,.08),transparent);pointer-events:none"></div>
      <div class="card-title" style="margin-bottom:12px;color:var(--accent-coral)">⚠️ E'tibor kerak</div>
      ${needHelp.map(s=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-subtle)">
        <div><span style="font-size:13px;font-weight:600">${s.name}</span><span style="font-size:11px;color:var(--text-muted);margin-left:8px">${s.progress}%</span></div>
        <button class="btn btn-ghost btn-sm" onclick="tTab='students';tStudent=${s.id};renderTeacher()" style="font-size:10px">Ko'rish →</button>
      </div>`).join('')}
    </div>`:`<div class="glass-card" style="display:flex;align-items:center;justify-content:center;padding:30px"><div style="text-align:center"><div style="font-size:32px;margin-bottom:8px">✅</div><div style="font-size:13px;color:var(--accent-jade);font-weight:600">Barcha talabalar yaxshi natijada!</div></div></div>`}
  </div>`;

  /* Recent activity / Quick progress */
  h+=`<div class="glass-card" style="margin-top:20px">
    <div class="card-title" style="margin-bottom:16px">📋 Talabalar progressi</div>
    ${STUDENTS.sort((a,b)=>b.progress-a.progress).map(s=>{
      const color=s.progress>=70?'var(--accent-jade)':s.progress>=50?'var(--accent-amber)':'var(--accent-coral)';
      return `<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border-subtle);cursor:pointer" onclick="tTab='students';tStudent=${s.id};renderTeacher()" onmouseover="this.style.background='var(--border-subtle)'" onmouseout="this.style.background='transparent'">
        <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,${color},${color}CC);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;flex-shrink:0">${s.name.split(' ').map(n=>n[0]).join('')}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
            <div style="flex:1;height:5px;background:var(--border-subtle);border-radius:3px;max-width:160px"><div style="width:${s.progress}%;height:100%;background:${color};border-radius:3px;transition:width .8s"></div></div>
            <span style="font-size:10px;font-weight:700;color:${color}">${s.progress}%</span>
          </div>
        </div>
        <div style="display:flex;gap:12px;flex-shrink:0;font-size:11px;color:var(--text-muted)">
          <span title="Ball">🎯 ${s.score}</span>
          <span title="Badge">🏅 ${s.badges}</span>
          <span title="Esse">✍️ ${s.essays}</span>
        </div>
      </div>`}).join('')}
  </div>`;
}

/* ═══════ STUDENTS TAB ═══════ */
else if(tTab==='students'){
  if(tStudent!==null){
    /* ── STUDENT DETAIL VIEW ── */
    const s=STUDENTS.find(x=>x.id===tStudent);
    if(!s){tStudent=null;renderTeacher();return}
    const color=s.progress>=70?'var(--accent-jade)':s.progress>=50?'var(--accent-amber)':'var(--accent-coral)';
    const lv=s.badges>=8?3:s.badges>=4?2:1;
    const lvName=["","Boshlang'ich","Tajribali","Madaniy elchi"][lv];

    h+=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <button class="btn btn-ghost btn-sm" onclick="tStudent=null;renderTeacher()">← Orqaga</button>
      <span style="font-size:12px;color:var(--text-muted)">Talaba profili</span>
    </div>`;

    /* Profile header */
    h+=`<div class="glass-card" style="position:relative;overflow:hidden;padding:0">
      <div style="height:80px;background:linear-gradient(135deg,${color},${color}99);position:relative">
        <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
      </div>
      <div style="padding:0 28px 28px;margin-top:-30px">
        <div style="display:flex;align-items:flex-end;gap:18px;margin-bottom:16px">
          <div style="width:64px;height:64px;border-radius:18px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:${color};box-shadow:0 4px 16px rgba(0,0,0,.1);border:3px solid var(--bg-warm)">${s.name.split(' ').map(n=>n[0]).join('')}</div>
          <div><div style="font-size:20px;font-weight:700;font-family:var(--ff-display)">${s.name}</div><div style="font-size:12px;color:var(--text-muted)">${s.group} • Daraja ${lv}: ${lvName}</div></div>
        </div>
        <div class="grid-4" style="gap:10px">${[
          {n:s.score,l:"Ball",c:s.score>=90?'var(--accent-jade)':'var(--accent-amber)'},
          {n:s.progress+'%',l:"Progress",c:color},
          {n:s.badges,l:"Badge",c:'var(--accent-plum)'},
          {n:s.modules+'/5',l:"Modul",c:'var(--accent-indigo)'}
        ].map(x=>`<div style="text-align:center;padding:12px;background:var(--border-subtle);border-radius:14px"><div style="font-size:20px;font-weight:800;color:${x.c};font-family:var(--ff-display)">${x.n}</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px">${x.l}</div></div>`).join('')}</div>
      </div>
    </div>`;

    /* Portfolio breakdown */
    h+=`<div class="grid-2" style="margin-top:18px">
      <div class="glass-card">
        <div class="card-title" style="margin-bottom:14px">📋 Portfolio tarkibi</div>
        ${[
          {l:'Dekonstruksiyalar',n:s.decon,max:5,c:'var(--accent-indigo)',ic:'📖'},
          {l:'Esselar',n:s.essays,max:3,c:'var(--accent-amber)',ic:'✍️'},
          {l:'Debatlar',n:s.debates,max:2,c:'var(--accent-coral)',ic:'💬'},
          {l:'Kundalik yozuvlari',n:s.journal,max:7,c:'var(--accent-jade)',ic:'📓'},
          {l:'Viktorina rekordi',n:s.quizBest+'/42',max:42,c:'var(--accent-plum)',ic:'🎯'},
        ].map(a=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-subtle)">
          <span style="font-size:18px">${a.ic}</span>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px">${a.l}</span><span style="font-size:11px;font-weight:700;color:${a.c}">${a.n}</span></div>
            <div style="height:4px;background:var(--border-subtle);border-radius:3px"><div style="width:${Math.min(100,(typeof a.n==='string'?parseInt(a.n):a.n)/a.max*100)}%;height:100%;background:${a.c};border-radius:3px"></div></div>
          </div>
        </div>`).join('')}
      </div>
      <div class="glass-card">
        <div class="card-title" style="margin-bottom:14px">💬 Izohlar va baho</div>
        ${s.feedback.length>0?s.feedback.map(f=>`<div style="padding:12px;background:var(--border-subtle);border-radius:12px;margin-bottom:8px;border-left:3px solid ${f.type==='praise'?'var(--accent-jade)':f.type==='warn'?'var(--accent-coral)':'var(--accent-amber)'}">
          <div style="font-size:12px;line-height:1.6">${f.text}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px">${f.date} • <span style="color:${f.type==='praise'?'var(--accent-jade)':f.type==='warn'?'var(--accent-coral)':'var(--accent-amber)'}">${f.type==='praise'?'✓ Rag\'bat':f.type==='warn'?'⚠️ Ogohlantirish':'📝 Izoh'}</span></div>
        </div>`).join(''):'<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">Hali izoh yo\'q</div>'}
        <div style="margin-top:12px;border-top:1px solid var(--border-subtle);padding-top:14px">
          <div style="display:flex;gap:6px;margin-bottom:8px">
            <button class="btn btn-ghost btn-sm fb-type-btn" onclick="setFbType('note',this)" style="font-size:10px;border:1px solid var(--accent-amber);color:var(--accent-amber)">📝 Izoh</button>
            <button class="btn btn-ghost btn-sm fb-type-btn" onclick="setFbType('praise',this)" style="font-size:10px;border:1px solid var(--accent-jade);color:var(--accent-jade)">✓ Rag'bat</button>
            <button class="btn btn-ghost btn-sm fb-type-btn" onclick="setFbType('warn',this)" style="font-size:10px;border:1px solid var(--accent-coral);color:var(--accent-coral)">⚠️ Ogohlantirish</button>
          </div>
          <input type="hidden" id="fb-type" value="note"/>
          <div style="display:flex;gap:8px"><input class="form-input" id="fb-text" placeholder="Izoh yozing..." style="flex:1;font-size:12px;padding:10px 14px"/><button class="btn btn-jade btn-sm" onclick="addFeedback(${s.id})">Yuborish</button></div>
        </div>
      </div>
    </div>`;

    /* Quick grade update */
    h+=`<div class="glass-card" style="margin-top:18px">
      <div class="card-title" style="margin-bottom:14px">🎯 Baho yangilash</div>
      <div class="grid-3" style="gap:12px">
        <div class="form-field"><label class="form-label">Ball (0-100)</label><input class="form-input" id="gr-score" type="number" min="0" max="100" value="${s.score}" style="font-size:16px;font-weight:700;text-align:center"/></div>
        <div class="form-field"><label class="form-label">Progress (%)</label><input class="form-input" id="gr-progress" type="number" min="0" max="100" value="${s.progress}" style="font-size:16px;font-weight:700;text-align:center"/></div>
        <div class="form-field"><label class="form-label">Modullar</label><input class="form-input" id="gr-modules" type="number" min="0" max="5" value="${s.modules}" style="font-size:16px;font-weight:700;text-align:center"/></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">
        <button class="btn btn-jade" onclick="updateGrade(${s.id})">💾 Saqlash</button>
      </div>
    </div>`;
  } else {
    /* ── STUDENTS LIST ── */
    h+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
      <span style="font-size:12px;color:var(--text-muted)">${STUDENTS.length} ta talaba</span>
      <div style="display:flex;gap:8px">
        <select class="form-input" id="sort-by" onchange="renderTeacher()" style="font-size:11px;padding:6px 12px;width:auto">
          <option value="name">Ism bo'yicha</option>
          <option value="score">Ball bo'yicha</option>
          <option value="progress">Progress bo'yicha</option>
          <option value="badges">Badge bo'yicha</option>
        </select>
      </div>
    </div>`;

    const sortBy=document.getElementById('sort-by')?.value||'name';
    const sorted=[...STUDENTS].sort((a,b)=>{
      if(sortBy==='score')return b.score-a.score;
      if(sortBy==='progress')return b.progress-a.progress;
      if(sortBy==='badges')return b.badges-a.badges;
      return a.name.localeCompare(b.name);
    });

    h+=sorted.map((s,i)=>{
      const color=s.progress>=70?'var(--accent-jade)':s.progress>=50?'var(--accent-amber)':'var(--accent-coral)';
      return `<div class="glass-card" style="margin-bottom:12px;cursor:pointer;transition:all .3s" onclick="tStudent=${s.id};renderTeacher()" onmouseover="this.style.borderColor='${color}';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--bg-glass-border)';this.style.transform='none'">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="position:relative">
            <div style="width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,${color},${color}BB);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:800">${s.name.split(' ').map(n=>n[0]).join('')}</div>
            <div style="position:absolute;bottom:-2px;right:-2px;width:18px;height:18px;border-radius:6px;background:var(--bg-warm);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:${color};border:2px solid var(--bg-warm)">#${i+1}</div>
          </div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-size:15px;font-weight:700">${s.name}</div>
              <div style="font-size:22px;font-weight:800;color:${s.score>=90?'var(--accent-jade)':'var(--accent-amber)'};font-family:var(--ff-display)">${s.score}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="flex:1;height:5px;background:var(--border-subtle);border-radius:3px"><div style="width:${s.progress}%;height:100%;background:${color};border-radius:3px"></div></div>
              <span style="font-size:10px;font-weight:700;color:${color};width:32px">${s.progress}%</span>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span class="tag tag-indigo" style="font-size:10px">📖 ${s.decon} tahlil</span>
              <span class="tag tag-amber" style="font-size:10px">✍️ ${s.essays} esse</span>
              <span class="tag tag-plum" style="font-size:10px">🏅 ${s.badges} badge</span>
              <span class="tag tag-jade" style="font-size:10px">📓 ${s.journal} yozuv</span>
            </div>
          </div>
        </div>
        ${s.feedback.length>0?`<div style="margin-top:10px;padding:10px 14px;background:var(--border-subtle);border-radius:10px;font-size:11px;color:var(--text-muted)">💬 Oxirgi izoh: "${s.feedback[s.feedback.length-1].text.substring(0,60)}..."</div>`:''}
      </div>`}).join('');
  }
}

/* ═══════ GRADING TAB ═══════ */
else if(tTab==='grading'){
  h+=`<div class="glass-card" style="margin-bottom:18px">
    <div class="card-title" style="margin-bottom:4px">✅ Tezkor baholash</div>
    <p style="font-size:12px;color:var(--text-muted)">Barcha talabalarni bir joyda baholang</p>
  </div>`;

  h+=`<div class="glass-card" style="padding:0;overflow:hidden"><div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:var(--border-subtle)">
        <th style="padding:14px 16px;text-align:left;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap">Talaba</th>
        <th style="padding:14px 8px;text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Ball</th>
        <th style="padding:14px 8px;text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Progress</th>
        <th style="padding:14px 8px;text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Modul</th>
        <th style="padding:14px 8px;text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Izoh</th>
        <th style="padding:14px 8px;text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase"></th>
      </tr></thead>
      <tbody>${STUDENTS.map(s=>`<tr style="border-bottom:1px solid var(--border-subtle)" id="gr-row-${s.id}">
        <td style="padding:14px 16px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,var(--accent-indigo),var(--accent-plum));color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0">${s.name.split(' ').map(n=>n[0]).join('')}</div>
            <div><div style="font-weight:600;font-size:13px">${s.name}</div><div style="font-size:10px;color:var(--text-muted)">${s.group}</div></div>
          </div>
        </td>
        <td style="padding:10px 8px;text-align:center"><input type="number" id="qg-score-${s.id}" value="${s.score}" min="0" max="100" style="width:56px;text-align:center;padding:6px;border:1px solid var(--border-medium);border-radius:8px;font-size:14px;font-weight:700;background:var(--bg-warm);color:var(--text-primary)"/></td>
        <td style="padding:10px 8px;text-align:center"><input type="number" id="qg-prog-${s.id}" value="${s.progress}" min="0" max="100" style="width:56px;text-align:center;padding:6px;border:1px solid var(--border-medium);border-radius:8px;font-size:14px;font-weight:700;background:var(--bg-warm);color:var(--text-primary)"/></td>
        <td style="padding:10px 8px;text-align:center"><input type="number" id="qg-mod-${s.id}" value="${s.modules}" min="0" max="5" style="width:48px;text-align:center;padding:6px;border:1px solid var(--border-medium);border-radius:8px;font-size:14px;font-weight:700;background:var(--bg-warm);color:var(--text-primary)"/></td>
        <td style="padding:10px 8px;text-align:center"><input id="qg-fb-${s.id}" placeholder="Izoh..." style="width:120px;padding:6px 10px;border:1px solid var(--border-medium);border-radius:8px;font-size:11px;background:var(--bg-warm);color:var(--text-primary)"/></td>
        <td style="padding:10px 8px;text-align:center"><button class="btn btn-jade btn-sm" onclick="quickGrade(${s.id})" style="font-size:10px;padding:6px 12px">✓</button></td>
      </tr>`).join('')}</tbody>
    </table>
  </div></div>`;

  h+=`<div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn btn-jade" onclick="gradeAll()">💾 Barchasini saqlash</button></div>`;
}

/* ═══════ ANALYTICS TAB ═══════ */
else if(tTab==='analytics'){
  const scoreRanges=[
    {l:'90-100 (A\'lo)',count:STUDENTS.filter(s=>s.score>=90).length,c:'var(--accent-jade)'},
    {l:'80-89 (Yaxshi)',count:STUDENTS.filter(s=>s.score>=80&&s.score<90).length,c:'var(--accent-amber)'},
    {l:'70-79 (Qoniqarli)',count:STUDENTS.filter(s=>s.score>=70&&s.score<80).length,c:'var(--accent-coral)'},
    {l:'0-69 (Past)',count:STUDENTS.filter(s=>s.score<70).length,c:'var(--accent-coral)'}
  ];
  const maxCount=Math.max(...scoreRanges.map(r=>r.count),1);

  h+=`<div class="grid-2">
    <div class="glass-card">
      <div class="card-title" style="margin-bottom:16px">📊 Ball taqsimoti</div>
      ${scoreRanges.map(r=>`<div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px">${r.l}</span><span style="font-size:12px;font-weight:800;color:${r.c}">${r.count} talaba</span></div>
        <div style="height:24px;background:var(--border-subtle);border-radius:8px;overflow:hidden;position:relative">
          <div style="width:${r.count/maxCount*100}%;height:100%;background:${r.c};border-radius:8px;transition:width .8s;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;min-width:${r.count>0?'30px':'0'}">${r.count>0?r.count:''}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="glass-card">
      <div class="card-title" style="margin-bottom:16px">📈 Eng faol bo'limlar</div>
      ${[
        {l:'Kundalik yozuvlari',total:STUDENTS.reduce((a,s)=>a+s.journal,0),ic:'📓',c:'var(--accent-jade)'},
        {l:'Dekonstruksiyalar',total:STUDENTS.reduce((a,s)=>a+s.decon,0),ic:'📖',c:'var(--accent-indigo)'},
        {l:'Esselar',total:STUDENTS.reduce((a,s)=>a+s.essays,0),ic:'✍️',c:'var(--accent-amber)'},
        {l:'Debatlar',total:STUDENTS.reduce((a,s)=>a+s.debates,0),ic:'💬',c:'var(--accent-coral)'},
      ].sort((a,b)=>b.total-a.total).map(a=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-subtle)">
        <span style="font-size:20px">${a.ic}</span>
        <div style="flex:1"><div style="font-size:12px;margin-bottom:4px">${a.l}</div><div style="height:4px;background:var(--border-subtle);border-radius:3px"><div style="width:${a.total/30*100}%;height:100%;background:${a.c};border-radius:3px"></div></div></div>
        <span style="font-size:16px;font-weight:800;color:${a.c}">${a.total}</span>
      </div>`).join('')}
    </div>
  </div>`;

  /* Individual comparison */
  h+=`<div class="glass-card" style="margin-top:18px">
    <div class="card-title" style="margin-bottom:16px">👥 Talabalar taqqoslash</div>
    <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="border-bottom:2px solid var(--border-medium)">
        <th style="padding:10px;text-align:left;font-size:10px;color:var(--text-muted);text-transform:uppercase">Talaba</th>
        <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-muted)">📖</th>
        <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-muted)">✍️</th>
        <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-muted)">💬</th>
        <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-muted)">📓</th>
        <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-muted)">🎯</th>
        <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-muted)">🏅</th>
        <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-muted);font-weight:700">JAMI</th>
      </tr></thead>
      <tbody>${STUDENTS.map(s=>{const total=s.decon+s.essays+s.debates+s.journal;return`<tr style="border-bottom:1px solid var(--border-subtle)">
        <td style="padding:10px;font-weight:600">${s.name.split(' ')[0]}</td>
        <td style="padding:10px;text-align:center">${s.decon}</td>
        <td style="padding:10px;text-align:center">${s.essays}</td>
        <td style="padding:10px;text-align:center">${s.debates}</td>
        <td style="padding:10px;text-align:center">${s.journal}</td>
        <td style="padding:10px;text-align:center">${s.quizBest}/42</td>
        <td style="padding:10px;text-align:center">${s.badges}</td>
        <td style="padding:10px;text-align:center;font-weight:800;color:var(--accent-indigo)">${total}</td>
      </tr>`}).join('')}</tbody>
    </table></div>
  </div>`;
}

document.getElementById('teacher-c').innerHTML=h;
}

/* Teacher helper functions */
let currentFbType='note';
function setFbType(type,btn){currentFbType=type;document.getElementById('fb-type').value=type;document.querySelectorAll('.fb-type-btn').forEach(b=>{b.style.background='transparent';b.style.fontWeight='400'});if(btn){btn.style.background=type==='praise'?'var(--accent-jade-soft)':type==='warn'?'var(--accent-coral-soft)':'var(--accent-amber-soft)';btn.style.fontWeight='700'}}

function addFeedback(sid){const text=document.getElementById('fb-text').value.trim();if(!text){alert('Izoh yozing!');return}const s=STUDENTS.find(x=>x.id===sid);if(s){s.feedback.push({text,type:currentFbType,date:today});renderTeacher()}}

function updateGrade(sid){const s=STUDENTS.find(x=>x.id===sid);if(!s)return;const sc=parseInt(document.getElementById('gr-score').value);const pr=parseInt(document.getElementById('gr-progress').value);const md=parseInt(document.getElementById('gr-modules').value);if(!isNaN(sc))s.score=Math.max(0,Math.min(100,sc));if(!isNaN(pr))s.progress=Math.max(0,Math.min(100,pr));if(!isNaN(md))s.modules=Math.max(0,Math.min(5,md));s.feedback.push({text:`Ball: ${s.score}, Progress: ${s.progress}%, Modullar: ${s.modules}/5 — yangilandi`,type:'note',date:today});renderTeacher()}

function quickGrade(sid){const s=STUDENTS.find(x=>x.id===sid);if(!s)return;const sc=parseInt(document.getElementById('qg-score-'+sid).value);const pr=parseInt(document.getElementById('qg-prog-'+sid).value);const md=parseInt(document.getElementById('qg-mod-'+sid).value);const fb=document.getElementById('qg-fb-'+sid).value.trim();if(!isNaN(sc))s.score=Math.max(0,Math.min(100,sc));if(!isNaN(pr))s.progress=Math.max(0,Math.min(100,pr));if(!isNaN(md))s.modules=Math.max(0,Math.min(5,md));if(fb)s.feedback.push({text:fb,type:'note',date:today});const row=document.getElementById('gr-row-'+sid);if(row){row.style.background='var(--accent-jade-soft)';setTimeout(()=>row.style.background='transparent',1200)}}

function gradeAll(){STUDENTS.forEach(s=>quickGrade(s.id));setTimeout(()=>renderTeacher(),500)}

/* ══════ PROFIL ══════ */
function renderProfil(){if(!currentUser)return;const ec=earnedCount(),bl=getBadges().length,bs=getBadges(),total=decon.length+concepts.length+debates.length+coil.length+projects.length+essays.length;
const lv=ec>=8?3:ec>=4?2:1;const ln=["","Boshlang'ich sayohatchi","Tajribali tadqiqotchi","Madaniy elchi"][lv];

let h=`
<!-- Decorative background art -->
<div style="position:relative;overflow:hidden">
  <div style="position:absolute;top:-80px;right:-60px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(212,148,58,.12) 0%,rgba(232,96,76,.06) 50%,transparent 70%);pointer-events:none;z-index:0"></div>
  <div style="position:absolute;top:200px;left:-100px;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(91,95,199,.08) 0%,rgba(158,95,160,.04) 50%,transparent 70%);pointer-events:none;z-index:0"></div>
  <div style="position:absolute;bottom:50px;right:-40px;width:250px;height:250px;border-radius:50%;background:radial-gradient(circle,rgba(58,158,126,.08) 0%,transparent 60%);pointer-events:none;z-index:0"></div>

  <!-- Profile Header Card -->
  <div class="glass-card" style="position:relative;overflow:hidden;padding:0;z-index:1">
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,148,58,.06) 0%,rgba(232,96,76,.04) 40%,rgba(91,95,199,.04) 70%,rgba(158,95,160,.06) 100%);pointer-events:none"></div>
    <div style="position:absolute;top:-30px;right:-30px;width:160px;height:160px;border-radius:50%;background:linear-gradient(135deg,var(--accent-amber),var(--accent-coral));opacity:.06;pointer-events:none"></div>
    <div style="padding:32px;position:relative;display:flex;align-items:center;gap:22px">
      <div style="width:80px;height:80px;border-radius:22px;background:linear-gradient(135deg,var(--accent-amber),var(--accent-coral));display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff;box-shadow:0 8px 28px rgba(232,96,76,.25);flex-shrink:0">${currentUser.avatar}</div>
      <div style="flex:1">
        <h2 style="font-family:var(--ff-display);font-size:24px;margin-bottom:4px">${currentUser.name}</h2>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">${currentUser.role==='teacher'?"O'qituvchi":currentUser.group+" • Koreys tili"}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span class="tag tag-amber">🏆 Daraja ${lv}: ${ln}</span>
          <span class="tag tag-jade">${ec*150} XP</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:10px">
          <span style="font-size:11px;color:var(--text-muted)">Til darajasi:</span>
          ${STUDENT_LEVELS.map(slv=>`<button style="padding:4px 12px;border-radius:8px;font-size:11px;font-weight:700;border:2px solid ${studentLevel===slv?'var(--accent-indigo)':'var(--border-medium)'};background:${studentLevel===slv?'var(--accent-indigo)':'transparent'};color:${studentLevel===slv?'#fff':'var(--text-muted)'};cursor:pointer;transition:all .2s" onclick="studentLevel='${slv}';renderProfil()">${slv}</button>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="grid-3 stagger" style="margin-top:20px;position:relative;z-index:1">${[
    {n:ec+'/'+bl,l:"Badgelar",em:"🏅",c:"var(--accent-amber)",bg:"var(--accent-amber)"},
    {n:total,l:"Elementlar",em:"📋",c:"var(--accent-indigo)",bg:"var(--accent-indigo)"},
    {n:Math.round(ec/bl*100)+"%",l:"O'sish",em:"📈",c:"var(--accent-jade)",bg:"var(--accent-jade)"}
  ].map(s=>`<div class="stat-card" style="text-align:center"><div class="stat-glow" style="background:${s.bg}"></div><div class="stat-emoji">${s.em}</div><div class="stat-number" style="color:${s.c}">${s.n}</div><div class="stat-label">${s.l}</div></div>`).join('')}</div>

  <!-- Earned Badges Showcase -->
  <div class="glass-card" style="margin-top:20px;position:relative;z-index:1;overflow:hidden">
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,148,58,.03),rgba(91,95,199,.03));pointer-events:none"></div>
    <div class="card-title" style="margin-bottom:16px;position:relative">🏅 Mening yutuqlarim</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;position:relative">${bs.filter(b=>b.check).map(b=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 16px;background:var(--accent-amber-soft);border:1px solid rgba(212,148,58,.15);border-radius:14px">
      <span style="font-size:22px">${b.icon}</span>
      <div><div style="font-size:12px;font-weight:700">${b.title}</div><div style="font-size:10px;color:var(--text-muted)">${b.desc}</div></div>
    </div>`).join('')}${bs.filter(b=>b.check).length===0?'<div style="text-align:center;width:100%;padding:20px;color:var(--text-muted);font-size:13px">Hali badge yo\'q — boshlang! 🚀</div>':''}</div>
    ${ec<bl?`<div style="margin-top:14px;position:relative"><div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">Umumiy progress: ${ec}/${bl} badge</div><div style="height:6px;background:var(--border-subtle);border-radius:4px;overflow:hidden"><div style="width:${ec/bl*100}%;height:100%;background:linear-gradient(90deg,var(--accent-amber),var(--accent-coral));border-radius:4px"></div></div></div>`:''}
  </div>

  <!-- Activity Breakdown -->
  <div class="grid-2" style="margin-top:20px;position:relative;z-index:1">
    <div class="glass-card" style="overflow:hidden;position:relative">
      <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(91,95,199,.08),transparent);pointer-events:none"></div>
      <div class="card-title" style="margin-bottom:16px;position:relative">📊 Faoliyat xulosasi</div>
      ${[
        {l:'Dekonstruksiyalar',n:decon.length,c:'var(--accent-indigo)',max:5},
        {l:'Lug\'at so\'zlari',n:concepts.length,c:'var(--accent-plum)',max:10},
        {l:'Debatlar',n:debates.length,c:'var(--accent-coral)',max:3},
        {l:'COIL muloqotlar',n:coil.length,c:'var(--accent-jade)',max:3},
        {l:'Esselar',n:essays.length,c:'var(--accent-amber)',max:5},
        {l:'Kundalik yozuvlari',n:journal.length,c:'#D4943A',max:7},
      ].map(a=>`<div style="margin-bottom:12px;position:relative">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;font-weight:600">${a.l}</span><span style="font-size:11px;color:var(--text-muted);font-weight:700">${a.n}</span></div>
        <div style="height:5px;background:var(--border-subtle);border-radius:3px;overflow:hidden"><div style="width:${Math.min(100,a.n/a.max*100)}%;height:100%;background:${a.c};border-radius:3px;transition:width .8s var(--ease)"></div></div>
      </div>`).join('')}
    </div>
    <div class="glass-card" style="overflow:hidden;position:relative">
      <div style="position:absolute;bottom:-20px;left:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(58,158,126,.08),transparent);pointer-events:none"></div>
      <div class="card-title" style="margin-bottom:16px;position:relative">🎯 Keyingi maqsadlar</div>
      ${bs.filter(b=>!b.check).slice(0,4).map(b=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border-subtle);position:relative">
        <div style="font-size:24px;opacity:.5;filter:grayscale(1)">${b.icon}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${b.title}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
            <div style="flex:1;max-width:100px;height:4px;background:var(--border-subtle);border-radius:3px;overflow:hidden"><div style="width:${Math.round(b.cur/b.max*100)}%;height:100%;background:var(--accent-amber);border-radius:3px"></div></div>
            <span style="font-size:10px;color:var(--text-muted)">${Math.round(b.cur/b.max*100)}%</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="goTo('${b.page}')" style="font-size:10px;padding:4px 10px">→</button>
      </div>`).join('')}
      ${bs.filter(b=>!b.check).length===0?'<div style="text-align:center;padding:30px;position:relative"><div style="font-size:40px;margin-bottom:8px">🎉</div><div style="font-size:14px;font-weight:600;color:var(--accent-jade)">Barcha badgelar ochildi!</div></div>':''}
    </div>
  </div>

  <!-- Decorative Korean pattern -->
  <div style="margin-top:24px;text-align:center;position:relative;z-index:1;padding:24px">
    <div style="font-family:var(--ff-kr);font-size:28px;font-weight:700;background:linear-gradient(135deg,var(--accent-amber),var(--accent-coral),var(--accent-plum));-webkit-background-clip:text;-webkit-text-fill-color:transparent;opacity:.15;letter-spacing:8px">문화여행일기</div>
    <div style="font-size:10px;color:var(--text-muted);opacity:.4;margin-top:4px">Madaniy sayohat kundaligi</div>
  </div>
</div>`;

document.getElementById('profil-c').innerHTML=h}

/* ══════ BADGE CHECKER ══════ */
let prevBadges=new Set();
function checkBadges(){const bs=getBadges(),earned=new Set(bs.filter(b=>b.check).map(b=>b.id));for(const id of earned){if(!prevBadges.has(id)){const b=bs.find(x=>x.id===id);if(b){showToast(b);notifs.unshift({id:Date.now(),text:`Yangi badge: "${b.title}" ${b.icon}`,time:"Hozir",read:false});renderNotifs()}}}prevBadges=earned;buildNav();if(currentPage==='gamification')renderGamification();if(currentPage==='profil')renderProfil();if(currentPage==='dashboard')renderDashboard()}

/* ══════ INIT ══════ */
document.addEventListener('click',e=>{const nd=document.getElementById('notif-panel');if(nd&&nd.classList.contains('show')&&!e.target.closest('[onclick*="toggleNotifs"]')&&!e.target.closest('.notif-panel'))nd.classList.remove('show')});
setTimeout(()=>{prevBadges=new Set(getBadges().filter(b=>b.check).map(b=>b.id))},100);
renderNotifs();
