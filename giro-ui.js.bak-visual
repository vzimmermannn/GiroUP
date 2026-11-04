'use strict';
paths.scan='M4 8V4h4m8 0h4v4M4 16v4h4m8 0h4v-4M7 9h10v7H7zM9 12h6';
let account=null,scanMode='boleto',scanKind='out',scanText='',scanCodes=[],scanResult=null,scanBusy=false,payMethod='pix',payParts='once';
function loadAccount(){try{return JSON.parse(localStorage.getItem(sessionStorage.getItem('giroup-mode')==='demo'?'giroup-demo-account':'giroup-account')||'null');}catch(e){return null;}}
account=loadAccount();
function loadBusiness(){try{const key=sessionStorage.getItem('giroup-mode')==='demo'?'giroup-demo-data-v2':'giroup-data-v2';const raw=localStorage.getItem(key)||(key==='giroup-data-v2'?localStorage.getItem('contafacil-v1'):null);return raw?F.validate(JSON.parse(raw)):F.seed();}catch(e){return F.seed(false);}}
state=loadBusiness();
function accountSave(){localStorage.setItem(sessionStorage.getItem('giroup-mode')==='demo'?'giroup-demo-account':'giroup-account',JSON.stringify(account));}
function isAuthenticated(){return sessionStorage.getItem('giroup-session')==='yes';}
function planLabel(){return account?.subscription?.simulated?'Pro · demonstração':'Teste grátis · '+Giro.trial(account).days+' dias';}
function applyTheme(theme){
 const selected=theme||localStorage.getItem('giroup-theme')||'light';document.documentElement.dataset.theme=selected;localStorage.setItem('giroup-theme',selected);
 const dark=selected==='dark'||(selected==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);
 document.documentElement.dataset.theme=dark?'dark':'light';
 if(window.Android?.setTheme)Android.setTheme(dark);
}
async function pinHash(pin,salt){
 if(!crypto.subtle)throw Error('O armazenamento seguro do PIN exige um navegador atualizado. No navegador, use localhost; no Android, atualize o WebView.');
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:Uint8Array.from(salt),iterations:120000,hash:'SHA-256'},key,256);
 return Array.from(new Uint8Array(bits),b=>b.toString(16).padStart(2,'0')).join('');
}
function loginView(){
 const returning=Boolean(account?.hash);
 return '<main class="loginpage"><section class="loginintro">'+brand()+'<div><span class="eyebrow">Menos papel. Mais direção.</span><h1>Seu negócio<br>pronto para<br><em>dar um giro.</em></h1><p>Do preço certo ao próximo vencimento.<br>Clareza para crescer, no seu ritmo.</p></div><div class="loginmini">'+icon('shield')+'<span>7 dias grátis · sem cartão<br><small>Seus números ficam neste aparelho.</small></span></div></section><section class="loginbox"><div class="mobileloginbrand">'+brand()+'</div><span class="eyebrow">'+(returning?'Bom ter você de volta':'Vamos começar?')+'</span><h2>'+(returning?'Olá, '+esc(account.name.split(' ')[0])+'.':'Seu próximo passo é simples.')+'</h2><p>'+(returning?'Digite seu PIN para acessar este aparelho.':'Crie seu acesso local em poucos segundos.')+'</p><form id="login-form"><div class="fields">'+(returning?'':field('Seu nome','name','','text','',true)+field('Nome do negócio','business','','text','',true))+'<label class="field full">PIN de 4 números<input name="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="'+(returning?'current-password':'new-password')+'" required><small>'+(returning?'O PIN foi criado neste dispositivo.':'Escolha um PIN exclusivo para esta demonstração.')+'</small></label></div><div id="login-error" class="formerror" role="alert"></div><button class="btn wide gap" type="submit">'+(returning?'Entrar no GiroUp':'Criar acesso e testar grátis')+icon('arrow')+'</button></form><div class="loginseparator"><span>ou conheça primeiro</span></div>'+button('Explorar demonstração','demo-login','spark','secondary wide')+'<p class="fineprint">Acesso local do MVP: sem autenticação em nuvem ou recuperação de senha. O PIN não criptografa os dados financeiros. Não use um PIN bancário.</p></section></main>';
}
function loginDone(demo=false){
 if(demo){sessionStorage.setItem('giroup-mode','demo');account=loadAccount();state=loadBusiness();}
 sessionStorage.setItem('giroup-session','yes');if(!account){account={name:'Empreendedor',trialStarted:Date.now(),demo:true};accountSave();}
 if(demo)toast('Conta de demonstração · sem dados reais.');
 render();if(!state.tourDone)showTour();
}
function accountView(){
 return subTitle('Minha conta','Uma experiência que combina com você.')+'<div class="grid cols2"><section class="card"><div class="cardhead"><h3>'+esc(account?.name||'Empreendedor')+'</h3><span class="badge">Acesso local</span></div><p style="font-size:13px">'+esc(state.business)+'</p><div class="division"></div><h3>Seu plano</h3><p style="margin:8px 0 16px">'+planLabel()+'</p>'+button('Conhecer o GiroUp Pro','show-plans','shield','secondary wide')+'<div class="division"></div>'+button('Configurar meu negócio e backup','go-settings','settings','ghost wide')+button('Sair deste acesso','logout','back','ghost wide gap')+'<p class="fineprint">Sair encerra a sessão local, sem apagar seus lançamentos. A conta de demonstração pode ser acessada novamente pelo botão da tela inicial.</p></section><section class="card"><h3>Do seu jeito, de dia ou de noite.</h3><p style="font-size:13px;margin:10px 0 20px">Escolha uma aparência confortável. A preferência fica salva neste aparelho.</p><div class="thememenu">'+[['light','☀','Tema claro'],['dark','☾','Tema escuro'],['system','◐','Seguir o aparelho']].map(([k,i,l])=>'<button data-theme-select="'+k+'" class="'+((localStorage.getItem('giroup-theme')||'light')===k?'selected':'')+'"><span>'+i+'</span>'+l+'</button>').join('')+'</div>'+alertText('A assinatura e o pagamento desta versão são simulados. Nenhuma cobrança é realizada.','','shield')+'</section></div>';
}
function plansView(){
 const trial=Giro.trial(account),sub=account?.subscription;
 return title('Dê o próximo giro.','Uma gestão simples também precisa caber no bolso.')+'<div class="planlayout"><section class="card planpitch"><span class="eyebrow">GiroUp Pro</span><h2>Mais clareza.<br>Menos sustos.<br>Todos os dias.</h2><p>Um preço acessível para quem cuida de tudo no negócio.</p><div class="planfeatures">'+[['calc','Preço que considera os custos escondidos'],['scan','Documentos e caderno, direto para revisão'],['future','Previsão de caixa e alertas de vencimento'],['users','Equipe, estoque e orçamentos'],['book','Conteúdos do Sebrae para crescer']].map(([i,t])=>'<div>'+icon(i)+'<span>'+t+'</span>'+icon('check')+'</div>').join('')+'</div><p class="fineprint">Os cursos ficam no site do Sebrae e têm condições próprias. A integração de IA generativa depende de servidor e chave de API, não fornecidos pela assinatura simulada.</p></section><section class="card subscription"><span class="pill">'+(sub?'Plano anual · simulação':trial.active?'Você tem '+trial.days+' dias de teste':'Teste demonstrativo encerrado')+'</span><h3 style="margin-top:20px">Um ano para organizar o seu negócio</h3><div class="planprice">R$ 29,99<span>/ano</span></div><p style="font-size:12px">Valor total anual · sem renovação automática neste MVP</p><div class="segmented gap"><button data-payparts="once" class="'+(payParts==='once'?'active':'')+'">À vista</button><button data-payparts="12" class="'+(payParts==='12'?'active':'')+'">Em 12 vezes</button></div><div class="priceexplain">'+(payParts==='12'?'<b>11 × R$ 2,50 + 1 × R$ 2,49</b><small>Total: R$ 29,99 · sem juros na simulação</small>':'<b>R$ 29,99 à vista</b><small>Pix de demonstração ou cartão de teste</small>')+'</div>'+button(sub?'Simular outra compra':'Simular assinatura anual','checkout','arrow','wide')+'<button class="linkbutton" data-nav="home" style="margin:12px auto">Continuar explorando o aplicativo</button>'+alertText('Ambiente de demonstração. Não informe cartão, CPF, senha bancária ou comprovante real.','','shield')+(sub?'<div class="division"></div><h3 class="moneyin">Assinatura simulada ativa</h3><p class="fineprint">Pedido '+esc(sub.id)+'<br>'+money(sub.amount/100)+' · '+(sub.parts===12?'12 parcelas':'à vista')+'<br>Validade demonstrativa até '+new Date(sub.until).toLocaleDateString('pt-BR')+'</p>':'<p class="fineprint">Teste de 7 dias sem cartão. Ao terminar, você mantém acesso aos seus dados e ao backup. Este MVP demonstra a oferta comercial e não aplica bloqueio de cobrança.</p>')+'</section></div>';
}
function checkoutView(){
 modal('Seu próximo giro','<div class="paymentdemo">'+icon('shield')+'<div><b>Pagamento 100% simulado</b><small>Nenhuma cobrança será feita.</small></div></div><div class="checkoutsummary"><span>GiroUp Pro · 1 ano</span><b>R$ 29,99</b></div><div class="segmented"><button type="button" data-paymethod="pix" class="'+(payMethod==='pix'?'active':'')+'">Pix demonstrativo</button><button type="button" data-paymethod="card" class="'+(payMethod==='card'?'active':'')+'">Cartão de teste</button></div><div class="paymentbody">'+(payMethod==='pix'?'<div class="demoqr">'+icon('more')+'</div><b>Pix fictício para apresentação</b><p>Este desenho não é um QR Code de pagamento. Nenhuma chave Pix foi gerada.</p>':'<div class="testcard"><span>GIROUP · CARTÃO DE TESTE</span><strong>•••• •••• •••• 4242</strong><small>CLIENTE DEMONSTRAÇÃO · 12/30</small></div><p>Usamos um cartão fictício. Nenhum dado bancário é solicitado.</p>')+'</div><p class="fineprint">'+(payParts==='12'&&payMethod==='card'?'Parcelamento demonstrativo: 11 × R$ 2,50 + 1 × R$ 2,49. Total R$ 29,99.':payMethod==='pix'?'Pix é à vista: R$ 29,99.':'Cartão à vista: R$ 29,99.')+'</p><label class="paymentaccept"><input type="checkbox" name="simulation" required> Entendi que este pagamento é uma simulação.</label>','Confirmar simulação','payment-form');
 $('#payment-form').onsubmit=e=>{e.preventDefault();if(!new FormData(e.target).get('simulation'))return;
 const until=new Date();until.setFullYear(until.getFullYear()+1);
 account=account||{name:'Empreendedor',trialStarted:Date.now(),demo:true};
 account.subscription={simulated:true,id:'DEMO-'+Date.now().toString(36).toUpperCase(),amount:Giro.cents,parts:payMethod==='card'&&payParts==='12'?12:1,method:payMethod,createdAt:Date.now(),until:until.getTime()};
 accountSave();closeModal();render();
 modal('Tudo pronto para o próximo giro!','<div class="paymentsuccess">'+icon('check')+'<h3>Assinatura ativada na demonstração</h3><p>GiroUp Pro · '+money(Giro.cents/100)+' por ano</p><span class="badge">Pagamento fictício · nenhuma cobrança</span><p class="fineprint">Pedido '+esc(account.subscription.id)+'. A compra não é lançada no caixa da empresa.</p></div>','Voltar ao aplicativo','success-form');
 $('#success-form [data-action="close"]').textContent='Fechar';
 $('#success-form').onsubmit=e=>{e.preventDefault();closeModal();nav('home');toast('GiroUp Pro · assinatura simulada.');};
 };
}
function scanView(){
 const modes=[['boleto','Boletos'],['caderno','Caderno'],['recibo','Notas e recibos'],['estoque','Estoque']];
 return subTitle('Do papel para o GiroUp.','Fotografe, confira e transforme em controle.')+'<div class="segmented calctabs">'+modes.map(([k,l])=>'<button data-scan-mode="'+k+'" class="'+(scanMode===k?'active':'')+'">'+l+'</button>').join('')+'</div><div class="grid cols2"><section class="card"><div class="scanframe">'+icon('scan')+'<h3>'+(scanMode==='caderno'?'Seu caderno também tem espaço aqui.':'Enquadre. Capture. Confira.')+'</h3><p>Use boa luz e mantenha a câmera paralela ao papel.</p><span class="scanbracket tl"></span><span class="scanbracket tr"></span><span class="scanbracket bl"></span><span class="scanbracket br"></span></div><div class="settingsbuttons">'+button(scanBusy?'Lendo documento…':'Abrir câmera','capture','scan','wide')+button('Escolher foto','scan-gallery','box','ghost wide')+'</div>'+(!window.Android?'<p class="caption">A leitura automática da imagem funciona no APK Android. Na prévia, use o exemplo ou cole o texto abaixo.</p><input id="web-scan-file" type="file" accept="image/*" capture="environment" hidden><img id="web-scan-preview" alt="Documento escolhido para revisão" style="display:none;width:100%;border-radius:14px;margin-top:14px">':'')+'<div class="division"></div>'+button('Testar com exemplo fictício','scan-example','spark','secondary wide')+'<p class="fineprint">O OCR reconhece melhor texto impresso e letra de forma. Manuscritos, fotos desfocadas e códigos incompletos podem falhar. Fotos não são enviadas ao servidor de IA.</p></section><section class="card"><h3>Confira o que foi lido</h3><label class="field full gap">Texto do documento<textarea id="scan-text" rows="7" maxlength="18000" placeholder="O texto reconhecido aparece aqui. Você pode corrigir ou colar suas anotações.">'+esc(scanText)+'</textarea></label><div class="gap">'+selectField('Sem indicação no texto, considerar','scanKind',[['out','Saída / gasto'],['in','Entrada / recebimento']],scanKind,true)+'</div>'+button('Encontrar lançamentos','parse-scan','arrow','secondary wide gap')+'<div id="scan-error" class="caption gap"></div>'+alertText('Revise valor, data, tipo de movimento e beneficiário. Um código válido não garante que um boleto seja legítimo. Nada é pago pelo aplicativo.','','shield')+'</section></div>'+(scanResult?scanResultsView():'');
}
function scanResultsView(){
 return '<section class="card gap"><div class="cardhead"><h3>Revise antes de salvar</h3><span class="badge">'+scanResult.rows.length+' sugestões</span></div>'+scanResult.warnings.map(w=>alertText(esc(w),'','warn')).join('')+
 (scanResult.rows.length?scanResult.rows.map((r,i)=>'<div class="row"><div class="rowicon '+r.kind+'">'+icon(scanMode==='estoque'?'box':r.kind==='in'?'down':'up')+'</div><div class="details"><b>'+esc(r.title)+'</b><small>'+money(r.amount)+' · '+(r.date?dateLabel(r.date):'Informe o vencimento')+' · '+(scanMode==='estoque'?'Custo unitário sugerido':r.kind==='in'?'Entrada':'Saída')+'</small></div><button class="btn small '+(r.saved?'ghost':'secondary')+'" data-review-scan="'+i+'" '+(r.saved?'disabled':'')+'>'+(r.saved?'Salvo':'Revisar')+'</button></div>').join(''):empty('Não identificamos valores','Corrija o texto acima ou registre manualmente.'))+
 (scanResult.codes.length?'<div class="division"></div><details><summary style="font-size:12px">Códigos encontrados · não abrimos links automaticamente</summary><p class="fineprint" style="overflow-wrap:anywhere">'+scanResult.codes.map(c=>esc(c.slice(0,250))).join('<br>')+'</p></details>':'')+'</section>';
}
function parseScanText(){scanText=$('#scan-text')?.value||scanText;scanResult=Giro.parseScan(scanText,scanCodes,scanMode,F.date(),scanKind);render();}
window.receiveScan=result=>{
 scanBusy=false;
 if(result.error){toast(result.error);if(page==='scan')render();return;}
 scanText=String(result.text||'').slice(0,18000);scanCodes=Array.isArray(result.codes)?result.codes.map(String):[];
 scanResult=Giro.parseScan(scanText,scanCodes,scanMode,F.date(),scanKind);page='scan';render();toast('Leitura concluída. Revise as sugestões.');
};
function openCamera(gallery=false){
 if(scanBusy)return;scanBusy=true;
 if(window.Android){render();if(gallery)Android.selectDocumentImage();else Android.captureDocument();}
 else{scanBusy=false;$('#web-scan-file')?.click();toast('Prévia: escolha uma foto e cole o texto; o OCR automático fica no Android.');}
}
function reviewScan(index){
 const r=scanResult.rows[index];if(r.saved)return;
 if(scanMode==='estoque'){stockForm();$('#modal-form [name="name"]').value=r.title;$('#modal-form [name="cost"]').value=dec(r.amount);}
 else{
  const existing=state.records.some(x=>x.title===r.title&&x.amount===r.amount&&x.date===r.date&&x.kind===r.kind);
  recordForm(null,r.kind,r.status,{name:r.title,price:r.amount});
  $('#modal-form [name="date"]').value=r.date;
  if(existing){const hint=$('.formerror');hint.textContent='Já existe um lançamento com estes dados. Confirme se não está duplicando.';hint.style.display='block';}
 }
 const form=$('#modal-form'),original=form.onsubmit,previous=scanMode==='estoque'?state.stock.length:state.records.length;
 form.onsubmit=e=>{original(e);const count=scanMode==='estoque'?state.stock.length:state.records.length;if(count>previous){r.saved=true;render();toast('Documento convertido em registro.');}};
}
document.addEventListener('submit',async e=>{
 if(e.target.id!=='login-form')return;e.preventDefault();
 const error=$('#login-error'),btn=e.target.querySelector('button[type="submit"]');error.style.display='none';
 try{
  const d=new FormData(e.target),pin=String(d.get('pin'));if(!/^\d{4}$/.test(pin))throw Error('Digite um PIN de exatamente 4 números.');
  const failures=Number(sessionStorage.getItem('giroup-attempts')||0),until=Number(sessionStorage.getItem('giroup-lock')||0);
  if(Date.now()<until)throw Error('Aguarde um minuto para tentar novamente.');
  btn.disabled=true;
  if(account?.hash){if(await pinHash(pin,account.salt)!==account.hash){sessionStorage.setItem('giroup-attempts',String(failures+1));if(failures>=4){sessionStorage.setItem('giroup-lock',String(Date.now()+60000));sessionStorage.setItem('giroup-attempts','0');}throw Error('PIN incorreto. Confira e tente novamente.');}}
  else{const name=textValue(d,'name'),business=textValue(d,'business'),salt=Array.from(crypto.getRandomValues(new Uint8Array(16)));account={name,business,salt,hash:await pinHash(pin,salt),trialStarted:Date.now()};accountSave();if(!localStorage.getItem('giroup-data-v2')&&!localStorage.getItem('contafacil-v1'))state=F.seed(true);state.business=business;save();}
  sessionStorage.setItem('giroup-attempts','0');loginDone();
 }catch(err){error.textContent=err.message;error.style.display='block';}finally{btn.disabled=false;}
});
document.addEventListener('click',e=>{
 const el=e.target.closest('button');if(!el)return;
 if(el.dataset.themeSelect){applyTheme(el.dataset.themeSelect);render();return;}
 if(el.dataset.payparts){payParts=el.dataset.payparts;if(payParts==='12')payMethod='card';render();return;}
 if(el.dataset.paymethod){payMethod=el.dataset.paymethod;checkoutView();return;}
 if(el.dataset.scanMode){if($('#scan-text'))scanText=$('#scan-text').value;scanMode=el.dataset.scanMode;scanResult=null;render();return;}
 if(el.dataset.reviewScan!==undefined){reviewScan(Number(el.dataset.reviewScan));return;}
 switch(el.dataset.action){
 case 'demo-login':loginDone(true);break;
 case 'logout':sessionStorage.removeItem('giroup-session');sessionStorage.removeItem('giroup-mode');account=loadAccount();state=loadBusiness();closeModal();$('#tour-root').innerHTML='';page='home';render();break;
 case 'show-plans':nav('plans');break;
 case 'go-settings':nav('settings');break;
 case 'checkout':checkoutView();break;
 case 'capture':openCamera();break;
 case 'scan-gallery':openCamera(true);break;
 case 'parse-scan':parseScanText();break;
 case 'scan-example':
  scanCodes=[];scanText=scanMode==='boleto'?'FORNECEDOR DEMONSTRAÇÃO\nValor do documento R$ 480,00\nVencimento '+new Date(F.date(7)+'T12:00:00').toLocaleDateString('pt-BR'):scanMode==='caderno'?'Venda de serviço R$ 150,00\nCompra de material R$ 70,00\nEnergia R$ 80,00\nTotal R$ 300,00':scanMode==='estoque'?'Material de limpeza R$ 18,90\nPeça de reposição R$ 70,00':'RECIBO DE COMPRA\nLoja de materiais (fictícia)\nValor total R$ 85,90\n'+new Date().toLocaleDateString('pt-BR');
  scanResult=Giro.parseScan(scanText,scanCodes,scanMode,F.date(),scanKind);render();toast('Exemplo fictício para demonstrar a revisão.');break;
 }
});
document.addEventListener('change',e=>{
 if(e.target.name==='scanKind')scanKind=e.target.value;
 if(e.target.id==='web-scan-file'){const file=e.target.files[0];if(file){const image=$('#web-scan-preview');if(image.dataset.url)URL.revokeObjectURL(image.dataset.url);const url=URL.createObjectURL(file);image.dataset.url=url;image.src=url;image.style.display='block';}}
});
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{if(localStorage.getItem('giroup-theme')==='system')applyTheme('system');});
applyTheme();startGiroUp();

