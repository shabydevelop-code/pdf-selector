import {openPdf,renderPage} from "../core/pdf-engine.js";
import {detectTextRuns} from "../core/element-detector.js";
import {makeSelection} from "../core/element-selector.js";
const $=id=>document.getElementById(id);
let pdf=null,pageNumber=1,scale=1.25,selection=null,revision=0;
const controls=["previous","next","minus","plus"];
function updateControls(){for(const id of controls)$(id).disabled=!pdf; $("previous").disabled=!pdf||pageNumber===1;$("next").disabled=!pdf||pageNumber===pdf.numPages;$("page-label").textContent=pdf?`${pageNumber} / ${pdf.numPages}`:"—";$("zoom-label").textContent=Math.round(scale*100)+"%";}
async function draw(){
 if(!pdf)return;
 const current=++revision;
 $("overlay").replaceChildren();$("page").style.display="none";$("hint").textContent="טוען עמוד...";
 try{
  const {page,viewport,pdfjsLib}=await renderPage(pdf,pageNumber,scale,$("canvas"));
  if(current!==revision)return;
  const elements=await detectTextRuns(page,viewport,pdfjsLib);
  if(current!==revision)return;
  $("page").style.width=viewport.width+"px";$("page").style.height=viewport.height+"px";
  for(const element of elements){
   const b=element.screenBounds,hit=document.createElement("div");
   hit.className="hit";hit.title=element.value;
   Object.assign(hit.style,{left:b.x+"px",top:b.y+"px",width:b.width+"px",height:b.height+"px"});
   hit.addEventListener("click",()=>{document.querySelector(".hit.selected")?.classList.remove("selected");hit.classList.add("selected");selection=makeSelection(element,pageNumber);$("details").textContent=JSON.stringify(selection,null,2);$("copy").disabled=false;});
   $("overlay").append(hit);
  }
  $("page").style.display="block";$("hint").textContent=elements.length?`זוהו ${elements.length} מקטעי טקסט. העבר את העכבר מעליהם ולחץ לבחירה.`:"לא נמצאה שכבת טקסט בעמוד.";
 }catch(error){if(current===revision)$("hint").textContent="שגיאה בטעינת העמוד: "+error.message;}
 updateControls();
}
$("file").addEventListener("change",async event=>{
 const file=event.target.files?.[0];if(!file)return;
 ++revision;pdf=null;selection=null;$("details").textContent="טרם נבחר רכיב";$("copy").disabled=true;updateControls();$("page").style.display="none";$("hint").textContent="פותח PDF...";
 try{pdf=await openPdf(new Uint8Array(await file.arrayBuffer()));pageNumber=1;await draw();}
 catch(error){$("hint").textContent="לא ניתן לפתוח PDF: "+error.message;}
});
$("previous").onclick=()=>{if(pageNumber>1){pageNumber--;draw();}};
$("next").onclick=()=>{if(pdf&&pageNumber<pdf.numPages){pageNumber++;draw();}};
$("plus").onclick=()=>{scale=Math.min(3,+(scale+.25).toFixed(2));draw();};
$("minus").onclick=()=>{scale=Math.max(.5,+(scale-.25).toFixed(2));draw();};
$("copy").onclick=async()=>{if(selection)await navigator.clipboard.writeText(JSON.stringify(selection,null,2));};
updateControls();