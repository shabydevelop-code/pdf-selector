export function makeSelection(element,pageNumber){
 return {type:element.type,page:pageNumber,value:element.value,bounds:element.pageBounds,runIndex:element.index};
}