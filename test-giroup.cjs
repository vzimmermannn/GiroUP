const assert=require('node:assert/strict'),G=require('./app/src/main/assets/giro-core.js');
let count=0;const test=(n,fn)=>{fn();console.log('OK '+n);count++;};
test('12 parcelas fecham 2999 centavos sem centavo perdido',()=>{const p=G.installments();assert.equal(p.length,12);assert.equal(p.reduce((a,b)=>a+b,0),2999);assert.equal(p[0],250);assert.equal(p[11],249);});
test('teste de sete dias expira sem datas artificiais',()=>{const start=1700000000000;assert.equal(G.trial({trialStarted:start},start).days,7);assert.equal(G.trial({trialStarted:start},start+7*86400000).active,false);});
test('data inválida no OCR não passa',()=>{assert.equal(G.parseDate('31/02/2026'),null);assert.equal(G.parseDate('vencimento 18/11/2026'),'2026-11-18');});
test('caderno separa entradas e saídas sem importar o total',()=>{const r=G.parseScan('Venda de serviço R$ 150,00\nCompra de peça R$ 70,00\nTotal R$ 220,00',[],'caderno','2026-11-01');assert.equal(r.rows.length,2);assert.equal(r.rows[0].kind,'in');assert.equal(r.rows[1].kind,'out');assert.equal(r.rows[1].amount,70);});
test('boleto sem vencimento pede revisão em vez de inventar data',()=>{const r=G.parseScan('Fornecedor\nValor total R$ 120,00',[],'boleto','2026-11-01');assert.equal(r.rows[0].date,'');assert.equal(r.rows[0].status,'pending');assert.equal(r.rows[0].amount,120);});
function sampleCode(){let code='0019'+'0'+'1000'+'0000048000'+'1234567890123456789012345';code=code.slice(0,4)+G.bankDV(code.slice(0,4)+code.slice(5))+code.slice(5);return code;}
function lineFromCode(c){const a=c.slice(0,4)+c.slice(19,24),b=c.slice(24,34),d=c.slice(34,44);return a+G.mod10(a)+b+G.mod10(b)+d+G.mod10(d)+c[4]+c.slice(5,19);}
test('código bancário confere dígito e extrai valor e fator novo',()=>{const c=sampleCode(),r=G.bankCode(c);assert.equal(c.length,44);assert.equal(r.valid,true);assert.equal(r.amount,480);assert.equal(r.date,'2025-02-22');});
test('linha de 47 dígitos confere campos e dígito geral',()=>{const code=sampleCode(),line=lineFromCode(code),r=G.bankCode(line);assert.equal(line.length,47);assert.equal(r.code,code);assert.equal(r.valid,true);});
test('alteração de um dígito impede validação',()=>{const c=lineFromCode(sampleCode());assert.equal(G.bankCode(c.slice(0,9)+(c[9]==='0'?'1':'0')+c.slice(10)).valid,false);});
test('foto de boleto cadastra pendência mesmo com QR não navegável',()=>{const r=G.parseScan('Documento', [sampleCode(),'https://example.invalid/nao-abrir'],'boleto','2026-11-01');assert.equal(r.rows[0].amount,480);assert.equal(r.rows[0].status,'pending');assert.equal(r.codes.length,2);});
test('conta de consumo não é declarada validada como boleto bancário',()=>{const r=G.parseScan('Conta de água\nValor total R$ 90,00',['8'.repeat(48)],'boleto');assert.ok(r.warnings.some(x=>x.includes('consumo')));assert.equal(r.rows[0].date,'');});
test('leitura do estoque mantém custo e requer quantidade manual',()=>{const r=G.parseScan('Peça R$ 70,00',[],'estoque','2026-11-01');assert.equal(r.rows[0].status,'stock');assert.equal(r.rows[0].amount,70);});
test('preserva vendas iguais e avisa para revisar duplicidade',()=>{const r=G.parseScan('Compra peça R$ 20,00\nCompra peça R$ 20,00',[],'caderno','2026-11-01');assert.equal(r.rows.length,2);assert.ok(r.warnings.some(x=>x.includes('linhas iguais')));});
console.log(count+' testes de plano e digitalização passaram.');

