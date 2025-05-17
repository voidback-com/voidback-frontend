import * as nsfwjs from "nsfwjs";




export const getImageClass = async (image) => {

  const img = new Image(400, 400);

  img.src = image;

  const model = await nsfwjs.load("https://media.voidback.com/media/mobilenet_v2/model.json");

  const predictions = await model.classify(img);

  if(predictions[0].className==="Drawing" || predictions[0].className==="Neutral")
  {
    return "sfw";
  }

  return "nsfw";
}

