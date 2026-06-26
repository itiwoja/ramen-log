// 麺帳 トロフィー定義（index.html と trophy.html で共用）
(function(){
  const GENRES=['ラーメン','つけ麺','油そば','担々麺','ちゃんぽん','うどん','そば','沖縄そば','そうめん','焼きそば','パスタ','パッタイ','フォー','ビーフン','冷やし中華','冷麺']

  // デビュー(1杯)・マニア(10杯)・極み(30杯) の称号名（無ければ自動生成）
  const DEBUT={
    'ラーメン':'ラーメン一杯目','つけ麺':'つけ麺デビュー','油そば':'混ぜそばデビュー','担々麺':'痺れデビュー',
    'ちゃんぽん':'ちゃんぽんデビュー','うどん':'うどん開眼','そば':'蕎麦入門','沖縄そば':'めんそーれ',
    'そうめん':'夏の始まり','焼きそば':'祭りの主役','パスタ':'ボナペティ','パッタイ':'タイ屋台デビュー',
    'フォー':'フォー入門','ビーフン':'ビーフンデビュー','冷やし中華':'始めました','冷麺':'冷麺デビュー'
  }
  const MANIA={
    'ラーメン':'ラーメンマニア','つけ麺':'つけ麺の求道者','油そば':'タレ職人','担々麺':'痺れ中毒',
    'ちゃんぽん':'長崎の魂','うどん':'うどん職人','そば':'蕎麦通','沖縄そば':'島の常連',
    'そうめん':'流し職人','焼きそば':'鉄板マスター','パスタ':'パスタイオーロ','パッタイ':'パッタイ通',
    'フォー':'フォー賢者','ビーフン':'米麺の探求者','冷やし中華':'冷やし中華の達人','冷麺':'弾力の虜'
  }
  const MASTER={ 'ラーメン':'ラーメン仙人','うどん':'うどんの神','そば':'蕎麦の鬼','パスタ':'マンマの味' }

  // 連続記録(ストリーク)を計算: {current, longest, days}
  function streakInfo(records){
    const set=new Set(records.map(r=>r.date).filter(Boolean))
    const toISO=dt=>`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
    const add=(d,n)=>{const z=new Date(d+'T00:00:00');z.setDate(z.getDate()+n);return toISO(z)}
    const sorted=[...set].sort()
    let longest=0,run=0,prev=null
    for(const d of sorted){ run=(prev&&add(prev,1)===d)?run+1:1; longest=Math.max(longest,run); prev=d }
    const today=toISO(new Date())
    let c = set.has(today)?today : (set.has(add(today,-1))?add(today,-1):null)
    let cur=0
    while(c && set.has(c)){cur++; c=add(c,-1)}
    return {current:cur,longest,days:set.size}
  }

  function computeAchievements(records){
    const list=[]
    const gc=g=>records.filter(r=>r.type===g).length
    const add=(id,group,title,desc,have,target)=>list.push({
      id,group,title,desc,raw:have,have:Math.min(have,target),target,
      earned:have>=target, pct:Math.max(0,Math.min(1,target?have/target:0))
    })
    GENRES.forEach(g=>{
      const c=gc(g)
      add('debut:'+g,'ジャンル', DEBUT[g]||(g+'デビュー'), g+'を1杯', c,1)
      add('mania:'+g,'ジャンル', MANIA[g]||(g+'マニア'), g+'を10杯', c,10)
      add('master:'+g,'ジャンル', MASTER[g]||(g+'の極み'), g+'を30杯', c,30)
    })
    const total=records.length
    add('total10','総合','麺活はじめ','合計10杯',total,10)
    add('total50','総合','麺の道','合計50杯',total,50)
    add('total100','総合','百杯の極み','合計100杯',total,100)
    const variety=new Set(records.map(r=>r.type).filter(Boolean)).size
    add('var5','総合','いろいろ麺食い','5ジャンル制覇',variety,5)
    add('var10','総合','麺の探求者','10ジャンル制覇',variety,10)
    add('var16','総合','全国麺制覇','全16ジャンル制覇',variety,GENRES.length)
    add('star3','総合','殿堂コレクター','★5を3杯',records.filter(r=>r.stars===5).length,3)
    add('photo10','総合','麺フォトグラファー','写真つき10件',records.filter(r=>(r.photos||0)>0||r.photo).length,10)
    const byday={}; records.forEach(r=>{if(r.date)byday[r.date]=(byday[r.date]||0)+1})
    add('double','総合','ダブル麺','1日に2杯',Math.max(0,...Object.values(byday),0),2)
    const st=streakInfo(records)
    add('streak3','総合','3日連続 麺活','3日連続で記録',st.longest,3)
    add('streak7','総合','一週間 麺活','7日連続で記録',st.longest,7)
    add('streak30','総合','麺活マスター','30日連続で記録',st.longest,30)
    return list
  }
  window.computeAchievements=computeAchievements
  window.computeStreak=streakInfo
  window.MENCHO_GENRES=GENRES
})();
