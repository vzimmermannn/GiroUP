/* Plano demonstrativo e interpretação conservadora de documentos. Não executa pagamentos. */
(function(root){
 const cents=2999;
 function trial(account,now=Date.now()){const end=(account?.trialStarted||now)+7*86400000;return {end,days:Math.max(0,Math.ceil((end-now)/86400000)),active:now<end};}
 function installments(total=cents,n=12){const base=Math.floor(total/n),extra=total%n;return Array.from({length:n},(_,i)=>base+(i<extra?1:0));}
 function mod10(s){let sum=0,w=2;for(let i=s.length-1;i>=0;i--){let n=Number(s[i])*w;sum+=n>9?n-9:n;w=w===2?1:2;}return(10-sum%10)%10;}
 function bankDV(s){let sum=0,w=2;for(let i=s.length-1;i>=0;i--){sum+=Number(s[i])*w;w=w===9?2:w+1;}let d=11-sum%11;return d===0||d===10||d===11?1:d;}
 function bankCode(digits){
  let code=digits;
  if(digits.length===47){
   const d=digits;
   if(mod10(d.slice(0,9))!==+d[9]||mod10(d.slice(10,20))!==+d[20]||mod10(d.slice(21,31))!==+d[31])return {valid:false,error:'Os dígitos verificadores da linha digitável não conferem. Confira o código na foto.'};
   code=d.slice(0,4)+d[32]+d.slice(33,47)+d.slice(4,9)+d.slice(10,20)+d.slice(21,31);
  }
  if(code.length!==44||code[0]==='8'||code[3]!=='9')return {valid:false,error:'Formato não reconhecido como boleto bancário em reais. Preencha valor e vencimento manualmente.'};
  if(bankDV(code.slice(0,4)+code.slice(5))!==+code[4])return {valid:false,error:'O dígito verificador do boleto não confere. Confira o código na foto.'};
  const factor=Number(code.slice(5,9));let date=null;
  if(factor>=1000){const d=new Date(Date.UTC(2025,1,22));d.setUTCDate(d.getUTCDate()+factor-1000);date=d.toISOString().slice(0,10);}
  return {valid:true,code,amount:Number(code.slice(9,19))/100,date,dateWarning:'Data calculada pelo ciclo de boletos iniciado em 22/02/2025. Confira o vencimento impresso; boletos antigos podem usar outro ciclo.'};
 }
 function parseDate(text){
  const a=text.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/),b=text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  const date=a?a[3]+'-'+a[2]+'-'+a[1]:b?b[0]:null;
  if(!date)return null;const d=new Date(date+'T12:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===date?date:null;
 }
 function moneyValues(text){return [...text.matchAll(/(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})(?!\d)/g)].map(m=>Number(m[1].replace(/\./g,'').replace(',','.'))).filter(Number.isFinite);}
 function parseScan(text,codes=[],mode='boleto',today=new Date().toISOString().slice(0,10),defaultKind='out'){
  text=String(text||'').slice(0,18000);
  const warnings=[],rows=[],all=[...codes.map(String),...text.split(/\n/)];let bank=null;
  // Só considera sequências isoladas de 44/47/48 dígitos; não junta campos não relacionados.
  for(const line of all){
   const trimmed=line.trim();const digits=trimmed.replace(/[.\s-]/g,'');
   if(!/^\d{44}$|^\d{47}$|^\d{48}$/.test(digits))continue;
   if(digits.length===48||digits[0]==='8'){warnings.push('Conta de consumo detectada. Neste MVP, confira e preencha o valor e a data impressos; não validamos o código de arrecadação.');continue;}
   const parsed=bankCode(digits);
   if(parsed.valid){bank={...parsed,line:digits};break;}warnings.push(parsed.error);
  }
  const dueLine=text.split(/\n/).find(l=>/vencimento|vencer/i.test(l)),explicitDate=parseDate(dueLine||'')||parseDate(text);
  if(bank){rows.push({title:'Boleto bancário',amount:bank.amount||0,date:explicitDate||bank.date||'',kind:'out',status:'pending',barcode:bank.line});if(!explicitDate&&bank.date)warnings.push(bank.dateWarning);}
  else if(mode==='caderno'||mode==='estoque'){
   for(const line of text.split(/\n/)){
    if(/^\s*(total|saldo|subtotal)\b/i.test(line))continue;
    const amounts=moneyValues(line);if(!amounts.length)continue;
    const title=line.replace(/(?:R\$\s*)?\d[\d.]*,\d{2}/g,'').replace(/\b\d{2}\/\d{2}\/\d{4}\b/g,'').replace(/^[\s\-–:]+|[\s\-–:]+$/g,'').trim().slice(0,100)||'Anotação do caderno';
    const kind=/\b(entrada|recebi|venda|recebido|receita)\b/i.test(line)?'in':/\b(sa[ií]da|paguei|gasto|despesa|compra)\b/i.test(line)?'out':defaultKind;
    rows.push({title,amount:amounts.at(-1),date:parseDate(line)||explicitDate||today,kind,status:mode==='estoque'?'stock':'paid'});
   }
   warnings.push(mode==='estoque'?'A foto não faz inventário automático: revise nome, custo, unidade e quantidade no cadastro.':'Confira se cada linha é uma entrada ou uma saída. Linhas com “total” ou “saldo” não são importadas para evitar duplicidade.');
  }else{
   const amounts=moneyValues(text),valueLine=text.split(/\n/).find(l=>/valor\s*(do documento|a pagar|total|cobrado)|total\s*R?\$?/i.test(l));
   const selected=moneyValues(valueLine||'');
   const title=text.split(/\n/).find(l=>/[a-zà-ú]{3}/i.test(l))||'Documento digitalizado';
   rows.push({title:title.slice(0,100),amount:selected.at(-1)??amounts.at(-1)??0,date:explicitDate|| (mode==='boleto'?'':today),kind:defaultKind,status:mode==='boleto'?'pending':'paid'});
   if(mode==='boleto')warnings.push('Valor sugerido pelo texto, sem validação bancária. Confirme valor, beneficiário e vencimento antes de salvar.');
  }
  const unique=rows.slice(0,30);if(rows.length>30)warnings.push('Mostramos as primeiras 30 sugestões. Digitalize o restante em outra página.');
  const keys=unique.map(r=>[r.title,r.amount,r.date,r.kind].join('|'));if(new Set(keys).size<keys.length)warnings.push('Há linhas iguais. Confira se são operações diferentes ou texto duplicado pelo OCR antes de salvar.');
  return {rows:unique,warnings:[...new Set(warnings)],codes:codes.map(String).slice(0,5),text};
 }
 const api={cents,trial,installments,mod10,bankDV,bankCode,parseDate,moneyValues,parseScan};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Giro=api;
})(typeof window!=='undefined'?window:globalThis);

