// PDF.js returns text runs, not guaranteed words or semantic paragraphs.
// Bounds are normalized to the unscaled PDF page viewport (scale=1).
export async function detectTextRuns(page,viewport,pdfjsLib){
 const content=await page.getTextContent(),results=[];
 for(const [index,item] of content.items.entries()){
  if(!item.str?.trim() || !item.width || !item.height)continue;
  const transform=pdfjsLib.Util.transform(viewport.transform,item.transform);
  const fontHeight=Math.hypot(transform[2],transform[3]);
  const x=transform[4],y=transform[5]-fontHeight;
  const width=Math.abs(item.width*viewport.scale),height=Math.max(fontHeight,1);
  results.push({type:"text",index,value:item.str,pageBounds:{x:x/viewport.scale,y:y/viewport.scale,width:width/viewport.scale,height:height/viewport.scale},screenBounds:{x,y,width,height}});
 }
 return results;
}