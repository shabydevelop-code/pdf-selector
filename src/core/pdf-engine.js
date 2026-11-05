import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";
export async function openPdf(bytes){return pdfjsLib.getDocument({data:bytes}).promise;}
export async function renderPage(pdf,pageNumber,scale,canvas){
 const page=await pdf.getPage(pageNumber),viewport=page.getViewport({scale});
 canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
 canvas.style.width=viewport.width+"px";canvas.style.height=viewport.height+"px";
 await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
 return {page,viewport,pdfjsLib};
}