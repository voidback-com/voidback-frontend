'use client'
import { env, pipeline } from "@xenova/transformers";




const checkImage = async (image) => {

  env.allowLocalModels = false;

const classifier = await pipeline('image-classification', 'AdamCodd/vit-base-nsfw-detector');


  var img = new Image();

  img.src = image.source;
  img.width = 244;
  img.height = 244;


  const res = await classifier([img.src]);


  if(res[0].label==="sfw" && res[0].score>=0.90) // 90% minimum
    return true;
  else
    return false;

}


export default checkImage;
