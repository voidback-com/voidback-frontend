'use client'
import * as tf from "@tensorflow/tfjs";
import * as nsfwjs from "nsfwjs";

tf.enableProdMode();


const checkImage = async (image) => {

  tf.setBackend("cpu");


  const model = await nsfwjs.load("/models/mobilenet_v2/model.json");

  var img = new Image();

  img.src = image.source;
  img.width = 244;
  img.height = 244;


  const p = await model.classify(img);


  if(p[0].className!=="Neutral")
    return false;

  return true;
}


export default checkImage;
