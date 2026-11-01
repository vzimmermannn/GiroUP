if(!Array.prototype.at){Object.defineProperty(Array.prototype,'at',{value:function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return this[i];},writable:true,configurable:true});}
if(!String.prototype.at){Object.defineProperty(String.prototype,'at',{value:function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return this.charAt(i)||undefined;},writable:true,configurable:true});}
/* Núcleo financeiro independente da interface. Valores em reais; arredondamento nos limites. */
(function(root){
'use strict';
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const date=(offset=0,base=new Date())=>{const d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+offset); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const number=value=>{if(typeof value==='number')return value; let s=String(value??'').trim().replace(/R\$|\s/g,'');if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');return Number(s);};
function seed(demo=true){
 const state={version:1,demo,business:'Meu negócio',initialBalance:demo?600:0,ownerHours:120,tourDone:false,endpoint:'',costs:[
 ['Aluguel / condomínio',900],['Energia elétrica',280],['Água e esgoto',120],['Internet e telefone',100],['Contabilidade',180],['Sistemas e assinaturas',80],['Marketing',100],['Manutenção e limpeza',100],['Seguros e licenças',60],['Pró-labore (seu salário)',1800],['Outros custos fixos',0]
 ].map(([name,amount])=>({id:uid(),name,amount:demo?amount:0})),members:demo?[{id:uid(),name:'Ana Souza',role:'Operação',salary:1800,burden:450,benefits:150,hours:100}]:[],stock:demo?[{id:uid(),name:'Material de uso diário',qty:8,min:10,cost:15,unit:'un'},{id:uid(),name:'Peça de reposição',qty:24,min:5,cost:70,unit:'un'}]:[],quotes:[],records:[],calc:{name:'Serviço personalizado',materials:70,outsourced:0,hours:1,freight:0,tax:4,fee:3,commission:0,margin:20,current:100,volume:20},messages:[]};
 if(demo)state.records=[
 ['in',9500,'Vendas e serviços','Vendas',-8,'paid'],['in',8500,'Recebimentos de clientes','Serviços',-2,'paid'],
 ['out',7600,'Compras de materiais','Materiais',-7,'paid'],['out',4500,'Equipe e operação','Equipe',-5,'paid'],['out',2400,'Despesas do negócio','Estrutura',-1,'paid'],
 ['out',5000,'Fornecedor · reposição','Fornecedores',2,'pending'],['in',2200,'Cliente · serviço entregue','Serviços',8,'pending']
 ].map(([kind,amount,title,cat,offset,status])=>({id:uid(),kind,amount,title,cat,date:date(offset),status}));
 return state;
}
function overhead(s){return round(s.costs.reduce((a,c)=>a+c.amount,0)+s.members.reduce((a,m)=>a+m.salary+m.burden+m.benefits,0));}
function capacity(s){return s.ownerHours+s.members.reduce((a,m)=>a+m.hours,0);}
function price(s,c=s.calc){
 const monthly=overhead(s),cap=capacity(s),rate=cap>0?monthly/cap:0;
 const allocated=rate*c.hours,base=c.materials+c.outsourced+c.freight+allocated;
 const variable=(c.tax+c.fee+c.commission)/100,margin=c.margin/100;
 if(cap<=0 || variable+margin>=1)return {error:cap<=0?'Informe horas produtivas maiores que zero.':'Impostos, taxas, comissão e margem precisam somar menos de 100%.'};
 const suggested=round(base/(1-variable-margin)),floor=round(base/(1-variable));
 const netCurrent=round(c.current*(1-variable)-base);
 return {monthly,cap,rate:round(rate),allocated:round(allocated),base:round(base),variable,suggested,floor,profit:round(suggested*(1-variable)-base),netCurrent,gain:round((suggested-c.current)*(1-variable)*c.volume),taxes:round(suggested*variable)};
}
const paidDate=r=>r.paidDate||r.date;
function summary(s,today=date()){
 const start=date(-29,new Date(today+'T12:00:00'));
 const paid=s.records.filter(r=>r.status==='paid'&&paidDate(r)<=today);
 const period=paid.filter(r=>paidDate(r)>=start);
 const income=round(period.filter(r=>r.kind==='in').reduce((a,r)=>a+r.amount,0));
 const expense=round(period.filter(r=>r.kind==='out').reduce((a,r)=>a+r.amount,0));
 const balance=round(s.initialBalance+paid.reduce((a,r)=>a+(r.kind==='in'?r.amount:-r.amount),0));
 return {income,expense,result:round(income-expense),balance};
}
function forecast(s,days=15,scenario='base',today=date()){
 const factor={base:1,low:0.7,high:1.15}[scenario]??1;
 const until=date(days,new Date(today+'T12:00:00'));
 const pending=s.records.filter(r=>r.status==='pending'&&r.date<=until);
 let balance=summary(s,today).balance,min=balance,first=balance<0?today:null;
 const points=[{date:today,balance}];
 for(let i=0;i<=days;i++){
  const day=date(i,new Date(today+'T12:00:00'));
  const items=pending.filter(r=>i===0?r.date<=day:r.date===day);
  // Saídas primeiro: revela risco intradiário mesmo quando a soma do dia é positiva.
  items.sort((a,b)=>a.kind===b.kind?0:a.kind==='out'?-1:1);
  for(const r of items){balance=round(balance+(r.kind==='in'?r.amount*factor:-r.amount));if(balance<min)min=balance;if(balance<0&&!first)first=day;}
  points.push({date:day,balance});
 }
 const payable=round(pending.filter(r=>r.kind==='out').reduce((a,r)=>a+r.amount,0));
 const receivable=round(pending.filter(r=>r.kind==='in').reduce((a,r)=>a+r.amount*factor,0));
 const nearest=pending.filter(r=>r.kind==='out').sort((a,b)=>a.date.localeCompare(b.date))[0];
 let reserve=0;
 if(nearest){const due=new Date(nearest.date+'T12:00:00'),now=new Date(today+'T12:00:00');const n=Math.max(1,Math.ceil((due-now)/86400000));reserve=round(Math.max(0,nearest.amount-summary(s,today).balance)/n);}
 return {points,balance,min,first,payable,receivable,reserve,factor,until};
}
function monthlyPlan(s){
 const p=price(s);if(p.error)return p;
 const sales=s.calc.volume,revenue=round(p.suggested*sales),direct=(s.calc.materials+s.calc.outsourced+s.calc.freight)*sales;
 const variable=round(revenue*p.variable),contribution=p.suggested*(1-p.variable)-(s.calc.materials+s.calc.outsourced+s.calc.freight);
 return {sales,revenue,direct:round(direct),variable,fixed:p.monthly,result:round(revenue-direct-variable-p.monthly),hours:round(sales*s.calc.hours),capacity:p.cap,breakEven:contribution>0?Math.ceil(p.monthly/contribution):null};
}
function validate(s){
 const num=(n,max=1e10)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=max;
 const str=(v)=>typeof v==='string'&&v.length<=500;
 const validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
 if(!s||s.version!==1||!str(s.business)||!num(s.initialBalance)||!num(s.ownerHours,10000)||typeof s.demo!=='boolean')throw Error('Formato de backup inválido.');
 for(const key of ['costs','members','stock','records','quotes','messages'])if(!Array.isArray(s[key])||s[key].length>5000)throw Error('Arquivo grande ou inválido.');
 const ids=new Set();const id=x=>{if(!str(x.id)||!/^[A-Za-z0-9_-]{1,80}$/.test(x.id)||ids.has(x.id))throw Error('Identificador inválido.');ids.add(x.id);};
 for(const c of s.costs){id(c);if(!str(c.name)||!num(c.amount))throw Error('Custo inválido.');}
 for(const m of s.members){id(m);if(!str(m.name)||!str(m.role)||!['salary','burden','benefits','hours'].every(k=>num(m[k])))throw Error('Equipe inválida.');}
 for(const item of s.stock){id(item);if(!str(item.name)||!str(item.unit)||!['qty','min','cost'].every(k=>num(item[k])))throw Error('Estoque inválido.');}
 for(const r of s.records){id(r);if(!['in','out'].includes(r.kind)||!['paid','pending'].includes(r.status)||!num(r.amount)||r.amount<=0||!str(r.title)||!str(r.cat)||!validDate(r.date)||(r.paidDate&&!validDate(r.paidDate))||(r.status==='paid'&&paidDate(r)>date()))throw Error('Lançamento inválido.');}
 if(!s.calc||!str(s.calc.name)||!['materials','outsourced','hours','freight','tax','fee','commission','margin','current','volume'].every(k=>num(s.calc[k])))throw Error('Calculadora inválida.');
 for(const q of s.quotes){id(q);if(!str(q.name)||!num(q.price)||!num(q.floor)||!validDate(q.date))throw Error('Orçamento inválido.');}
 if(!s.messages.every(m=>['user','assistant'].includes(m.role)&&typeof m.text==='string'&&m.text.length<=20000))throw Error('Conversa inválida.');
 if(typeof s.endpoint!=='string'||s.endpoint.length>2048||(s.endpoint&&!/^https:\/\//.test(s.endpoint)))throw Error('Servidor inválido.');
 return s;
}
const api={round,date,uid,number,seed,overhead,capacity,price,summary,forecast,monthlyPlan,validate,paidDate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Finance=api;
})(typeof window!=='undefined'?window:globalThis);

