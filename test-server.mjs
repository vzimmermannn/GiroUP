import assert from 'node:assert/strict';
import {createApp} from './server.mjs';
let count=0;
async function run(name,options,body,status,check){
 const server=createApp(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:typeof body==='string'?body:JSON.stringify(body)});assert.equal(response.status,status);if(check)check(await response.json());console.log('OK '+name);count++;}finally{await new Promise(r=>server.close(r));}
}
const payload={question:'Vou ter dinheiro para pagar?',summary:{cash:{balance:4100},forecast15:{min:-900,balance:1300}}};
await run('sem credenciais, falha explícita sem resposta simulada',{apiKey:'',model:''},payload,503);
await run('JSON inválido é rejeitado',{},'{',400);
await run('pergunta vazia é rejeitada',{}, {question:'',summary:{}},400);
let sent;
await run('integração Responses analisa output message / output_text',{apiKey:'fake-test-key',model:'configured-model',fetchImpl:async(url,opts)=>{assert.equal(url,'https://api.openai.com/v1/responses');sent=JSON.parse(opts.body);assert.equal(sent.store,false);return {ok:true,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:'Há risco de faltar R$ 900 antes do recebimento.'}]}]})};}},payload,200,data=>assert.match(data.answer,/900/));
assert.equal(sent.model,'configured-model');
await run('falha do provedor é tratada',{apiKey:'fake-test-key',model:'configured-model',fetchImpl:async()=>({ok:false})},payload,502);
await run('resposta vazia não vira sucesso',{apiKey:'fake-test-key',model:'configured-model',fetchImpl:async()=>({ok:true,json:async()=>({output:[]})})},payload,502);
console.log(count+' testes do servidor passaram. Nenhuma chamada real ao provedor.');

