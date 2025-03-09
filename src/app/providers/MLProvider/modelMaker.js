'use client'
import { useState, useContext, useEffect, createContext } from "react";
import * as tf from "@tensorflow/tfjs";



export const MODEL_TYPES = {
  "Sequential": new tf.Sequential(),
};


export const LOSS_TYPES = [
  "meanSquaredError",
];


export const OPTIMIZER_TYPES = [
  "sgd"
];



const ModelMakerContext = () => {



  // returns the json of a model
  const createModel = async (modelType, layers, lossType, optimizerType) => {
    const model = modelType;

    for(let i = 0; i < layers.length; i++)
    {
      model.add(layers[i]);
    }

    model.compile({loss: lossType, optimizer: optimizerType});


    return model;
  }


  const data = {
    createModel
  };


  const ModelMakerContext = createContext(data);

  return ModelMakerContext;
}



export default ModelMakerContext;
