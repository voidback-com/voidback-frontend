import { API_URL } from "@/app/configs/api";
import * as nsfwjs from "nsfwjs";




export const getImageClass = async (image) => {

  const img = new Image(400, 400);

  img.src = image.source;

  const model = await nsfwjs.load();

  const predictions = await model.classify(img);

  if(predictions[0].className==="Drawing" || predictions[0].className==="Neutral")
  {
    return "sfw";
  }

  return "nsfw";
}

