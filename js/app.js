(function(){
"use strict";
const KEY="pmle.study.v1";
const $app=document.getElementById("app");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const D=window.DOMAINS,Q=window.QUESTIONS,C=window.CARDS;
const dn=id=>D.find(d=>d.id==id);
const CARD_ID=c=>"c:"+c.f;

/* ---------- storage ---------- */
let S;
const obj=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
function clean(d){d=obj(d);return{done:obj(d.done),ans:obj(d.ans),cards:obj(d.cards),
  notes:(Array.isArray(d.notes)?d.notes:[]).filter(n=>n&&n.id).map(n=>({id:String(n.id),title:String(n.title||""),tag:String(n.tag||""),body:String(n.body||""),t:+n.t||Date.now()})),
  mock:(Array.isArray(d.mock)?d.mock:[]).map(m=>({t:+m.t||0,ok:+m.ok||0,n:+m.n||0}))}}
function load(){let d;try{d=JSON.parse(localStorage.getItem(KEY))}catch(e){}S=clean(d)}
let memOnly=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){memOnly=true}}
load();

/* ---------- helpers ---------- */
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const same=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
const pct=(a,b)=>b?Math.round(a/b*100):0;
const bar=p=>`<div class="bar"><i style="width:${p}%"></i></div>`;
function download(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"application/json"}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function domStats(){return D.map(d=>{const qs=Q.filter(q=>q.d==d.id);let n=0,ok=0;
  qs.forEach(q=>{const a=S.ans[q.id];if(a){n++;if(a.last)ok++}});
  return{d,total:qs.length,n,ok}})}
function known(){return C.filter(c=>S.cards[CARD_ID(c)]==="known").length}
function isWrong(q){const a=S.ans[q.id];return a&&!a.last}
function record(q,correct){const a=S.ans[q.id]||(S.ans[q.id]={c:0,w:0});correct?a.c++:a.w++;a.last=correct;save()}

/* ---------- router ---------- */
let timer=null;
function go(){
  if(timer){clearInterval(timer);timer=null}
  const h=location.hash.replace(/^#\/?/,"");const [path,qs]=h.split("?");const p=path.split("/");
  const params=new URLSearchParams(qs||"");
  document.querySelectorAll("#nav a").forEach(a=>a.classList.toggle("on",a.dataset.r===(p[0]||"")));
  ({"":home,learn:learn,quiz:quiz,cards:cards,notes:notes,progress:progress}[p[0]||""]||home)(p,params);
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",go);

/* ---------- home ---------- */
function home(){
  const st=domStats();const totalQ=Q.length,ans=st.reduce((a,s)=>a+s.n,0),ok=st.reduce((a,s)=>a+s.ok,0);
  const done=Object.keys(S.done).length;
  $app.innerHTML=`
  <h1>Google Cloud Professional ML Engineer 学習ツール</h1>
  ${memOnly?'<div class="card ng-t">ブラウザの保存が使えません。進捗とメモはこのタブを閉じると消えます。</div>':""}
  <div class="card"><h2>試験の概要（公式ページより）</h2>
  <ul><li>時間：2時間 / 問題数：50〜60問（択一・複数選択）</li><li>言語：英語・日本語 / 受験料：US$200</li>
  <li>受験形式：オンライン監督 または テストセンター / 前提資格：なし</li>
  <li>推奨：業界経験3年以上（うちGoogle Cloudでの設計・運用1年以上）</li>
  <li>コーディングは直接問われないが、PythonとSQLのコード断片を読める程度の力は必要</li></ul>
  <div class="tip"><b>最近の改訂：</b>Vertex AI から Gemini Enterprise Agent Platform への移行、データ/分析スタックの更新、Google Cloudネイティブなソリューション優先の方針が反映されています。本ツール内のサービス名は従来の「Vertex AI」表記を使っています。最新の範囲は<a target="_blank" rel="noopener" href="https://cloud.google.com/learn/certification/machine-learning-engineer">公式ページ</a>の試験ガイドPDFで必ず確認してください。</div>
  <p class="muted">※ 各領域の出題比率は公式ガイドで確認できていないため、本ツールには記載していません。</p></div>
  <div class="grid">
    <div class="card"><b>学習ページ</b><p class="muted">${done}/${D.length} 領域 完了</p>${bar(pct(done,D.length))}<p><a class="btn" href="#/learn">学習する</a></p></div>
    <div class="card"><b>問題集</b><p class="muted">${ans}/${totalQ} 問 回答済み・正答率 ${pct(ok,ans)}%</p>${bar(pct(ok,ans))}<p><a class="btn pri" href="#/quiz">問題を解く</a></p></div>
    <div class="card"><b>暗記カード</b><p class="muted">${known()}/${C.length} 枚 覚えた</p>${bar(pct(known(),C.length))}<p><a class="btn" href="#/cards">めくる</a></p></div>
    <div class="card"><b>メモ帳</b><p class="muted">${S.notes.length} 件</p><p><a class="btn" href="#/notes">開く</a></p></div>
  </div>
  <div class="card"><h2>おすすめの進め方</h2><ol>
  <li>領域ごとに「学習」ページを読み、分からない点を「メモ帳」に書く</li>
  <li>領域別に「問題集」を解き、解説を読む（間違えた問題は「進捗」から再挑戦）</li>
  <li>「暗記カード」で用語・使い分けを反復</li>
  <li>直前期に「模擬試験」を本番と同じ時間配分で解く</li>
  <li>公式の<a target="_blank" rel="noopener" href="https://www.cloudskillsboost.google/paths/17">Learning Path</a>とサンプル問題、公式ドキュメントで補完</li></ol></div>`;
}

/* ---------- learn ---------- */
function learn(p){
  if(p[1]){const d=dn(p[1]);if(!d){location.hash="#/learn";return}
    const i=D.indexOf(d);
    $app.innerHTML=`<p><a href="#/learn">← 学習一覧</a></p><h1>領域${d.id}：${esc(d.short)}</h1><p class="muted">${esc(d.title)}</p>
    <div class="card lesson">${d.html}</div>
    <div class="row"><button class="btn ${S.done[d.id]?"ok":""}" data-act="done" data-id="${d.id}">${S.done[d.id]?"✓ 学習済み（クリックで解除）":"学習済みにする"}</button>
    <a class="btn pri" href="#/quiz?d=${d.id}">この領域の問題へ</a><a class="btn" href="#/notes?new=1&d=${d.id}">メモを書く</a>
    ${i>0?`<a class="btn" href="#/learn/${D[i-1].id}">← 前</a>`:""}${i<D.length-1?`<a class="btn" href="#/learn/${D[i+1].id}">次 →</a>`:""}</div>`;
    return}
  $app.innerHTML=`<h1>学習</h1><p class="muted">試験の6つの評価領域ごとに要点をまとめています。内容は公式ドキュメントで必ず裏取りしてください。</p>
  <div class="grid">${D.map(d=>`<a class="card" style="text-decoration:none;color:inherit" href="#/learn/${d.id}">
  <span class="tag">領域${d.id}</span>${S.done[d.id]?'<span class="tag ok-t">学習済み</span>':""}<h2>${esc(d.short)}</h2><p class="muted">${esc(d.summary)}</p></a>`).join("")}</div>`;
}

/* ---------- quiz ---------- */
let Z=null; // session
function quiz(p,params){
  if(p[1]==="run"&&Z){return runQuiz()}
  const pre=params.get("d")||"all";
  const wrong=Q.filter(isWrong).length,unans=Q.filter(q=>!S.ans[q.id]).length;
  $app.innerHTML=`<h1>問題集</h1>
  <div class="card"><h2>練習モード</h2>
  <p class="muted">1問ずつ回答し、すぐに解説を確認できます。選択肢は毎回シャッフルされます。</p>
  <label>領域</label><select id="qd"><option value="all">すべて</option>${D.map(d=>`<option value="${d.id}" ${pre==d.id?"selected":""}>領域${d.id}：${esc(d.short)}</option>`).join("")}</select>
  <label>対象</label><select id="qf"><option value="all">すべて</option><option value="unans">未回答のみ（${unans}）</option><option value="wrong">前回間違えたもののみ（${wrong}）</option></select>
  <label>問題数</label><select id="qn"><option value="10">10問</option><option value="20">20問</option><option value="all">すべて</option></select>
  <p><button class="btn pri" data-act="startq">開始</button></p></div>
  <div class="card"><h2>模擬試験モード</h2><p class="muted">全${Q.length}問をランダム順で出題。制限時間は本番の配分（2時間/50問）に合わせて${Math.round(Q.length*2.4)}分。終了まで正誤は表示されません。</p>
  <p><button class="btn" data-act="startmock">模擬試験を始める</button></p></div>`;
}
function newSession(list,mock){
  Z={mock,i:0,checked:false,qs:shuffle(list).map(q=>({q,order:shuffle(q.c.map((_,i)=>i)),sel:[],done:false,ok:null})),
     deadline:mock?Date.now()+Math.round(list.length*2.4)*60000:0,finished:false};
  location.hash="#/quiz/run";
}
function runQuiz(){
  if(Z.finished)return result();
  const it=Z.qs[Z.i],q=it.q,multi=q.a.length>1,n=Z.qs.length;
  const shown=Z.mock?false:it.done;
  $app.innerHTML=`<div class="row" style="justify-content:space-between"><span class="muted">${Z.mock?"模擬試験":"練習"} ${Z.i+1} / ${n}　<span class="tag">領域${q.d}</span></span>
   ${Z.mock?'<span class="timer" id="tm"></span>':""}</div>${bar(pct(Z.i+1,n))}
  <div class="card"><p><b>${esc(q.q)}</b></p>${multi?`<p class="muted">※ ${q.a.length}つ選択してください</p>`:""}
  ${it.order.map((oi,k)=>{let cls="";if(it.sel.includes(oi))cls="sel";
    if(shown){if(q.a.includes(oi))cls="right";else if(it.sel.includes(oi))cls="wrong"}
    return `<button class="choice ${cls}" data-act="pick" data-oi="${oi}" ${shown?"disabled":""}><b>${"ABCDEFG"[k]}.</b><span>${esc(q.c[oi])}</span></button>`}).join("")}
  ${shown?`<div class="exp"><b class="${it.ok?"ok-t":"ng-t"}">${it.ok?"正解":"不正解"}</b><p>${esc(q.e)}</p>
   <button class="btn" data-act="qnote">この問題をメモに追加</button></div>`:""}</div>
  <div class="row">
   ${Z.mock?`<button class="btn" data-act="prev" ${Z.i==0?"disabled":""}>← 前</button>
     <button class="btn" data-act="next" ${Z.i==n-1?"disabled":""}>次 →</button>
     <button class="btn pri" data-act="finish">採点して終了</button>`
   :`${!it.done?`<button class="btn pri" data-act="check" ${it.sel.length?"":"disabled"}>回答する</button>`
     :`<button class="btn pri" data-act="next">${Z.i==n-1?"結果を見る":"次の問題 →"}</button>`}
     <button class="btn" data-act="quit">中断</button>`}
  </div>${Z.mock?`<p class="muted">未回答：${Z.qs.filter(x=>!x.sel.length).length}問</p>`:""}`;
  if(timer){clearInterval(timer);timer=null}
  if(Z.mock){const tick=()=>{const t=Math.max(0,Z.deadline-Date.now()),el=document.getElementById("tm");
      if(el)el.textContent="残り "+String(Math.floor(t/60000)).padStart(2,"0")+":"+String(Math.floor(t/1000)%60).padStart(2,"0");
      if(t<=0){clearInterval(timer);timer=null;finish()}};tick();timer=setInterval(tick,1000)}
}
function finish(){
  if(Z.finished)return;
  if(timer){clearInterval(timer);timer=null}
  Z.qs.forEach(it=>{if(it.ok===null){it.ok=same(it.sel.slice().sort(),it.q.a.slice().sort());record(it.q,it.ok)}});
  Z.finished=true;
  if(Z.mock){const ok=Z.qs.filter(x=>x.ok).length;S.mock.push({t:Date.now(),ok,n:Z.qs.length});save()}
  runQuiz();
}
function result(){
  const n=Z.qs.length,ok=Z.qs.filter(x=>x.ok).length;
  const byD=D.map(d=>{const a=Z.qs.filter(x=>x.q.d==d.id);return{d,n:a.length,ok:a.filter(x=>x.ok).length}}).filter(x=>x.n);
  const bad=Z.qs.filter(x=>!x.ok);
  $app.innerHTML=`<h1>結果：${ok} / ${n}（${pct(ok,n)}%）</h1>
  <div class="card"><h2>領域別</h2>${byD.map(x=>`<p>領域${x.d.id}：${esc(x.d.short)}　${x.ok}/${x.n}${bar(pct(x.ok,x.n))}</p>`).join("")}</div>
  <div class="card"><h2>間違えた問題（${bad.length}）</h2>${bad.length?bad.map(x=>{const q=x.q;return `<div class="exp"><p><span class="tag">領域${q.d}</span><b>${esc(q.q)}</b></p>
   <p class="ng-t">あなたの回答：${x.sel.length?x.sel.map(i=>esc(q.c[i])).join(" / "):"未回答"}</p>
   <p class="ok-t">正解：${q.a.map(i=>esc(q.c[i])).join(" / ")}</p><p>${esc(q.e)}</p></div>`}).join(""):"<p>全問正解です。</p>"}</div>
  <div class="row"><a class="btn pri" href="#/quiz">問題集に戻る</a><a class="btn" href="#/progress">進捗を見る</a></div>`;
}

/* ---------- cards ---------- */
let K=null;
function cards(p,params){
  if(p[1]==="run"&&K)return runCards();
  const pre=params.get("d")||"all";
  $app.innerHTML=`<h1>暗記カード</h1><div class="card">
  <label>領域</label><select id="cd"><option value="all">すべて</option>${D.map(d=>`<option value="${d.id}" ${pre==d.id?"selected":""}>領域${d.id}：${esc(d.short)}</option>`).join("")}</select>
  <label>対象</label><select id="cf"><option value="all">すべて</option><option value="rest">まだ覚えていないもの</option></select>
  <p><button class="btn pri" data-act="startc">開始</button></p></div>`;
}
function runCards(){
  if(K.i>=K.list.length){$app.innerHTML=`<h1>おつかれさまでした</h1><p>${K.list.length}枚を確認しました。</p><a class="btn pri" href="#/cards">戻る</a>`;return}
  const c=K.list[K.i].c;
  $app.innerHTML=`<p class="muted">${K.i+1} / ${K.list.length}　<span class="tag">領域${c.d}</span></p>
  <div class="card flip" data-act="flip"><div>${K.back?`<div class="muted">答え</div>${esc(c.b)}`:`<b>${esc(c.f)}</b><div class="muted">（タップして答えを表示）</div>`}</div></div>
  <div class="row"><button class="btn ok" data-act="known">覚えた</button><button class="btn ng" data-act="unknown">まだ</button><a class="btn" href="#/cards">終了</a></div>`;
}

/* ---------- notes ---------- */
let editing=null;
function notes(p,params){
  if(params.get("new")){editing={id:"n"+Date.now(),title:"",body:"",tag:params.get("d")?"領域"+params.get("d"):"",t:Date.now(),isNew:true};
    if(params.get("q")){const q=Q.find(x=>x.id===params.get("q"));if(q){editing.title="問題メモ："+q.q.slice(0,30);editing.body=q.q+"\n\n正解："+q.a.map(i=>q.c[i]).join(" / ")+"\n"+q.e+"\n\n"; editing.tag="領域"+q.d}}
    history.replaceState(null,"","#/notes");}
  if(editing)return editor();
  $app.innerHTML=`<h1>メモ帳</h1><div class="row"><button class="btn pri" data-act="newnote">＋ 新規メモ</button>
  <input type="text" id="nq" placeholder="検索（タイトル・本文・タグ）" value="${esc(window.__nq||"")}" style="flex:1;min-width:180px">
  <button class="btn" data-act="exp">エクスポート</button><label class="btn">インポート<input type="file" id="imp" accept=".json" hidden></label></div>
  <p class="muted">メモはこのブラウザ内（localStorage）にのみ保存されます。端末を変える際はエクスポート/インポートを使ってください。</p>
  <div id="nl"></div>`;
  renderNoteList();
}
function renderNoteList(){
  const el=document.getElementById("nl");if(!el)return;
  const f=(window.__nq||"").toLowerCase();
  const list=S.notes.filter(n=>!f||(n.title+n.body+n.tag).toLowerCase().includes(f)).sort((a,b)=>b.t-a.t);
  el.innerHTML=`${list.length?list.map(n=>`<div class="card"><div class="row" style="justify-content:space-between"><b>${esc(n.title||"（無題）")}</b>
   <span>${n.tag?`<span class="tag">${esc(n.tag)}</span>`:""}<span class="muted">${new Date(n.t).toLocaleDateString("ja-JP")}</span></span></div>
   <p style="white-space:pre-wrap">${esc(n.body)}</p><div class="row"><button class="btn" data-act="editnote" data-id="${n.id}">編集</button><button class="btn ng" data-act="delnote" data-id="${n.id}">削除</button></div></div>`).join(""):(f?'<div class="card muted">該当するメモはありません。</div>':'<div class="card muted">メモはまだありません。</div>')}`;
}
function editor(){
  $app.innerHTML=`<h1>${editing.isNew?"新規メモ":"メモを編集"}</h1><div class="card">
  <label>タイトル</label><input type="text" id="et" value="${esc(editing.title)}">
  <label>タグ（例：領域3、要復習）</label><input type="text" id="eg" value="${esc(editing.tag)}">
  <label>本文</label><textarea id="eb">${esc(editing.body)}</textarea>
  <div class="row" style="margin-top:10px"><button class="btn pri" data-act="savenote">保存</button><button class="btn" data-act="cancelnote">キャンセル</button></div></div>`;
}

/* ---------- progress ---------- */
function progress(){
  const st=domStats();
  const wrong=Q.filter(isWrong);
  $app.innerHTML=`<h1>進捗</h1><div class="card"><h2>領域別 正答率（直近の回答ベース）</h2>
  ${st.map(s=>`<p><a href="#/learn/${s.d.id}">領域${s.d.id}：${esc(s.d.short)}</a>　回答 ${s.n}/${s.total}・正答 ${s.ok}（${pct(s.ok,s.n)}%）${bar(pct(s.ok,s.n))}</p>`).join("")}</div>
  <div class="card"><h2>間違えた問題（${wrong.length}）</h2>${wrong.length?`<ul>${wrong.map(q=>`<li><span class="tag">領域${q.d}</span>${esc(q.q.slice(0,60))}…</li>`).join("")}</ul><button class="btn pri" data-act="retrywrong">間違えた問題だけ解く</button>`:"<p class='muted'>なし</p>"}</div>
  <div class="card"><h2>模擬試験の履歴</h2>${S.mock.length?`<table><tr><th>日時</th><th>得点</th></tr>${S.mock.slice().reverse().map(m=>`<tr><td>${new Date(m.t).toLocaleString("ja-JP")}</td><td>${m.ok}/${m.n}（${pct(m.ok,m.n)}%）</td></tr>`).join("")}</table>`:"<p class='muted'>まだありません</p>"}</div>
  <div class="card"><h2>データ管理</h2><div class="row"><button class="btn" data-act="expall">全データをエクスポート</button>
  <label class="btn">インポート<input type="file" id="impall" accept=".json" hidden></label><button class="btn ng" data-act="reset">すべて削除</button></div></div>`;
}

/* ---------- events ---------- */
$app.addEventListener("click",e=>{
  const t=e.target.closest("[data-act]");if(!t)return;const a=t.dataset.act,v=id=>document.getElementById(id);
  switch(a){
  case"done":S.done[t.dataset.id]?delete S.done[t.dataset.id]:S.done[t.dataset.id]=true;save();go();break;
  case"startq":{let l=Q.slice();const d=v("qd").value,f=v("qf").value,n=v("qn").value;
    if(d!=="all")l=l.filter(q=>q.d==d);if(f==="unans")l=l.filter(q=>!S.ans[q.id]);if(f==="wrong")l=l.filter(isWrong);
    if(!l.length){alert("該当する問題がありません");break}
    l=shuffle(l);if(n!=="all")l=l.slice(0,+n);newSession(l,false);break}
  case"startmock":newSession(Q,true);break;
  case"pick":{const it=Z.qs[Z.i];if(it.done)break;const oi=+t.dataset.oi,multi=it.q.a.length>1;
    if(multi)it.sel=it.sel.includes(oi)?it.sel.filter(x=>x!==oi):it.sel.concat(oi);else it.sel=[oi];runQuiz();break}
  case"check":{const it=Z.qs[Z.i];it.done=true;it.ok=same(it.sel.slice().sort(),it.q.a.slice().sort());record(it.q,it.ok);runQuiz();break}
  case"next":if(!Z.mock&&Z.i==Z.qs.length-1){finish();break}Z.i++;runQuiz();break;
  case"prev":Z.i--;runQuiz();break;
  case"finish":if(confirm("採点して終了しますか？"))finish();break;
  case"quit":if(confirm("中断しますか？（回答済みの記録は保存されています）")){Z=null;location.hash="#/quiz"}break;
  case"qnote":location.hash="#/notes?new=1&q="+Z.qs[Z.i].q.id;break;
  case"retrywrong":newSession(Q.filter(isWrong),false);break;
  case"startc":{const d=v("cd").value,f=v("cf").value;
    let l=C.map(c=>({c,id:CARD_ID(c)})).filter(x=>(d==="all"||x.c.d==d)&&(f==="all"||S.cards[x.id]!=="known"));
    if(!l.length){alert("該当するカードがありません");break}K={list:shuffle(l),i:0,back:false};location.hash="#/cards/run";break}
  case"flip":K.back=!K.back;runCards();break;
  case"known":case"unknown":S.cards[K.list[K.i].id]=a==="known"?"known":"unknown";save();K.i++;K.back=false;runCards();break;
  case"newnote":location.hash="#/notes?new=1";break;
  case"editnote":editing={...S.notes.find(n=>n.id===t.dataset.id)};go();break;
  case"delnote":if(confirm("削除しますか？")){S.notes=S.notes.filter(n=>n.id!==t.dataset.id);save();go()}break;
  case"savenote":{const n={id:editing.id,title:v("et").value.trim(),tag:v("eg").value.trim(),body:v("eb").value,t:Date.now()};
    if(!n.title&&!n.body){alert("内容を入力してください");break}
    const i=S.notes.findIndex(x=>x.id===n.id);i>=0?S.notes[i]=n:S.notes.push(n);save();editing=null;go();break}
  case"cancelnote":editing=null;go();break;
  case"exp":download("pmle-notes.json",JSON.stringify(S.notes,null,2));break;
  case"expall":download("pmle-study-data.json",JSON.stringify(S,null,2));break;
  case"reset":if(confirm("進捗・メモ・カードの記録をすべて削除します。よろしいですか？")){S={};try{localStorage.removeItem(KEY)}catch(e){}load();go()}break;
  }
});
$app.addEventListener("input",e=>{if(e.target.id==="nq"){window.__nq=e.target.value;renderNoteList()}});
$app.addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);
    if(e.target.id==="imp"){if(!Array.isArray(d))throw 0;const ids=new Set(S.notes.map(n=>n.id));clean({notes:d}).notes.forEach(n=>{if(!ids.has(n.id))S.notes.push(n)})}
    else{if(typeof d!=="object"||Array.isArray(d)||!d)throw 0;S=clean(d)}
    save();go();alert("インポートしました")}catch(x){alert("ファイルの形式が正しくありません")}};
  r.readAsText(f);e.target.value="";
});
go();
})();
