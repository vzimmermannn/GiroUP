package br.com.giroup;
import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.ClipData;
import android.graphics.Color;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.*;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import org.json.JSONObject;
import org.json.JSONArray;
import java.io.*;
import java.net.*;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
 private WebView web; private String exportData; private Uri captureUri;
 private boolean pageReady=false; private JSONObject queuedScan;
 private final java.util.concurrent.ExecutorService aiExecutor=Executors.newSingleThreadExecutor();
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  if(state!=null && state.getString("captureUri")!=null)captureUri=Uri.parse(state.getString("captureUri"));
  web=new WebView(this);setContentView(web);
  // Only local bundled assets are rendered. External navigation leaves this WebView.
  web.getSettings().setJavaScriptEnabled(true);web.getSettings().setDomStorageEnabled(true);
  web.getSettings().setAllowFileAccess(true);web.getSettings().setAllowContentAccess(false);
  web.getSettings().setAllowFileAccessFromFileURLs(false);web.getSettings().setAllowUniversalAccessFromFileURLs(false);
  web.addJavascriptInterface(new Bridge(),"Android");
  web.setWebViewClient(new WebViewClient(){
   @Override public void onPageFinished(WebView v,String url){pageReady=true;if(queuedScan!=null){deliverScan(queuedScan);queuedScan=null;}}
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest request){
    Uri uri=request.getUrl();
    if("https".equals(uri.getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,uri));}catch(Exception e){Toast.makeText(MainActivity.this,"Nenhum navegador disponível",Toast.LENGTH_SHORT).show();}}
    return true;
   }
  });
  web.loadUrl("file:///android_asset/index.html");
 }
 @Override public void onSaveInstanceState(Bundle out){super.onSaveInstanceState(out);if(captureUri!=null)out.putString("captureUri",captureUri.toString());}
 private static byte[] readLimited(InputStream in,int max)throws IOException{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] buffer=new byte[4096];int n;while((n=in.read(buffer))!=-1){if(out.size()+n>max)throw new IOException("Arquivo grande");out.write(buffer,0,n);}return out.toByteArray();}
 @Override protected void onDestroy(){aiExecutor.shutdownNow();web.destroy();super.onDestroy();}
 private void js(String code){runOnUiThread(()->{if(!isFinishing()&&!isDestroyed())web.evaluateJavascript(code,null);});}
 private void deliverScan(JSONObject result){if(!pageReady){queuedScan=result;return;}js("window.receiveScan("+result.toString()+")");}
 private void scanError(String message){try{deliverScan(new JSONObject().put("error",message));}catch(Exception ignored){}}
 private void recognize(Uri uri){
  try{
   InputImage input=InputImage.fromFilePath(this,uri);
   TextRecognizer recognizer=TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
   BarcodeScanner scanner=BarcodeScanning.getClient();
   Task<Text> textTask=recognizer.process(input);
   Task<List<Barcode>> codeTask=scanner.process(input);
   Tasks.whenAllComplete(textTask,codeTask).addOnCompleteListener(this,completed->{
    try{
     JSONObject result=new JSONObject();result.put("text",textTask.isSuccessful()?textTask.getResult().getText():"");
     JSONArray codes=new JSONArray();if(codeTask.isSuccessful())for(Barcode b:codeTask.getResult())if(b.getRawValue()!=null)codes.put(b.getRawValue());
     result.put("codes",codes);result.put("source","device");
     if(result.optString("text").isEmpty()&&codes.length()==0)result.put("error","Não encontramos texto ou código legível. Aproxime a câmera, melhore a luz ou escolha outra foto.");
     deliverScan(result);
    }catch(Exception e){scanError("Não foi possível ler esta imagem.");}
    finally{recognizer.close();scanner.close();}
   });
  }catch(Exception e){scanError("Não foi possível abrir a imagem. Tente uma foto menor ou em JPEG/PNG.");}
 }
 public class Bridge {
  @JavascriptInterface public void setTheme(boolean dark){runOnUiThread(()->{
   getWindow().setStatusBarColor(Color.parseColor(dark?"#17131F":"#F8F7FC"));
   getWindow().setNavigationBarColor(Color.parseColor(dark?"#17131F":android.os.Build.VERSION.SDK_INT>=27?"#FFFFFF":"#38215E"));
   int flags=dark?0:View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
   if(!dark&&android.os.Build.VERSION.SDK_INT>=27)flags|=View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
   web.setSystemUiVisibility(flags);
  });}
  @JavascriptInterface public void captureDocument(){runOnUiThread(()->{
   try{
    File dir=new File(getCacheDir(),"scans");if(!dir.exists()&&!dir.mkdirs())throw new IOException();
    File photo=new File(dir,"document.jpg");captureUri=FileProvider.getUriForFile(MainActivity.this,getPackageName()+".files",photo);
    Intent intent=new Intent(MediaStore.ACTION_IMAGE_CAPTURE);intent.putExtra(MediaStore.EXTRA_OUTPUT,captureUri);intent.setClipData(ClipData.newRawUri("Documento",captureUri));intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION|Intent.FLAG_GRANT_READ_URI_PERMISSION);
    if(intent.resolveActivity(getPackageManager())==null){scanError("Câmera não encontrada. Escolha uma imagem da galeria.");return;}
    startActivityForResult(intent,20);
   }catch(Exception e){scanError("Não foi possível abrir a câmera. Tente escolher uma imagem.");}
  });}
  @JavascriptInterface public void selectDocumentImage(){runOnUiThread(()->{try{Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);i.setType("image/*");i.addCategory(Intent.CATEGORY_OPENABLE);startActivityForResult(i,21);}catch(Exception e){scanError("Seletor de imagens indisponível.");}});}
  @JavascriptInterface public void exportBackup(String data){
   if(data.length()>2000000)return;exportData=data;
   runOnUiThread(()->{Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);intent.setType("application/json");intent.addCategory(Intent.CATEGORY_OPENABLE);intent.putExtra(Intent.EXTRA_TITLE,"giroup-backup.json");startActivityForResult(intent,10);});
  }
  @JavascriptInterface public void importBackup(){runOnUiThread(()->{Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);i.setType("*/*");i.addCategory(Intent.CATEGORY_OPENABLE);startActivityForResult(i,11);});}
  @JavascriptInterface public void askAI(String endpoint,String body){
   aiExecutor.execute(()->{
    HttpURLConnection connection=null;
    try{
     URL url=new URL(endpoint);if(!url.getProtocol().equals("https")||url.getUserInfo()!=null)throw new Exception();
     connection=(HttpURLConnection)url.openConnection();connection.setInstanceFollowRedirects(false);connection.setRequestMethod("POST");connection.setConnectTimeout(15000);connection.setReadTimeout(40000);connection.setDoOutput(true);connection.setRequestProperty("Content-Type","application/json");
     try(OutputStream out=connection.getOutputStream()){out.write(body.getBytes(StandardCharsets.UTF_8));}
     if(connection.getResponseCode()!=200)throw new Exception();
     String raw=new String(readLimited(connection.getInputStream(),100000),StandardCharsets.UTF_8);
     js("window.receiveAI("+JSONObject.quote(new JSONObject(raw).getString("answer"))+",false)");
    }catch(Exception e){js("window.receiveAI("+JSONObject.quote("Não foi possível consultar a IA. Confira a conexão e o servidor configurado.")+",true)");}
    finally{if(connection!=null)connection.disconnect();}
   });
  }
 }
 @Override protected void onActivityResult(int request,int result,Intent data){
  super.onActivityResult(request,result,data);
  if(request==20||request==21){
   if(result!=RESULT_OK){scanError("Leitura cancelada. Você pode tentar novamente.");return;}
   Uri uri=request==20?captureUri:data==null?null:data.getData();
   if(uri!=null)recognize(uri);else scanError("A imagem não foi recebida.");return;
  }
  if(result!=RESULT_OK||data==null)return;
  try{
   if(request==10){try(OutputStream out=getContentResolver().openOutputStream(data.getData())){out.write(exportData.getBytes(StandardCharsets.UTF_8));}Toast.makeText(this,"Backup salvo",Toast.LENGTH_SHORT).show();}
   if(request==11){try(InputStream in=getContentResolver().openInputStream(data.getData())){js("window.importBackupText("+JSONObject.quote(new String(readLimited(in,2000000),StandardCharsets.UTF_8))+")");}}
  }catch(Exception e){Toast.makeText(this,"Não foi possível abrir ou salvar o arquivo",Toast.LENGTH_LONG).show();}
 }
 @Override public void onBackPressed(){js("window.handleBack()");}
}

