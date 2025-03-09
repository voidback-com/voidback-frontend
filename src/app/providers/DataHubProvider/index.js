'use client'
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { useToast } from "@chakra-ui/react";
import { useState, useContext, useEffect, createContext } from "react";
import { getImageClass } from "../helpers/nsfw";
import "filehash";



export const DataHubContext = createContext();



const DataHubContextProvider = ({children}) => {


  const toast = useToast();

  const createDataset = async (name, thumbnail, description, categories, credit_sources) => {

    const data = {
      name: name,
      description: description,
      categories: categories,
      credit_sources: credit_sources
    };


    let form = new FormData(); 
    


    const imgClass = await getImageClass(thumbnail);


    if(imgClass==="nsfw")
    {
      toast({
        title: "The thumbnail image was classified as not safe for work, please respect our terms of service.",
        status: "error",
        duration: 4000
      });
      setPostLoading(false);
      return;
    }

    form.append("thumbnail", thumbnail.file);


    form.append("dataset", JSON.stringify(data));



    return fetch(API_URL+'dataHub/create/dataset', {
      method: "POST",
      headers: toAuthHeaders({}),
      body: form
    });
  }



  const createDatasetFile = async (file, dataset) => {

    const FH = window['Filehash'];


    const hash = await FH.hash(file.file);


    const data = {
      name: file.name,
      dataset: dataset, // id of the dataset
      file_type: file.name.split(".")[1],
      size: file.size,
      hash: hash 
    };

    let form = new FormData();

    form.append("file", file.file);
    form.append("data", JSON.stringify(data));


    return fetch(API_URL+'dataHub/create/dataset/file', {
      method: "POST",
      headers: toAuthHeaders({}),
      body: form
    });
  }



  const getDatasets = async (page) => {
    return fetch(API_URL+`dataHub/datasets?page=${page}&page_size=10`, {
      method: "GET"
    });
  }



  const getDataset = async (dataset) => {
    return fetch(API_URL+`dataHub/dataset?dataset=${dataset}`, {
      method: "GET"
    })
  }



  const getDatasetFiles = async (dataset) => {
    return fetch(API_URL+`dataHub/dataset/files?dataset=${dataset}&page=1&page_size=100`, {
      method: "GET"
    })
  }



  const getDatasetFilesInfo = async (dataset) => {
    return fetch(API_URL+`dataHub/dataset/files/info?dataset=${dataset}`, {
      method: "GET"
    })
  }


  const downloadDataset = async (dataset) => {
    return fetch(API_URL+`dataHub/dataset/download?dataset=${dataset}`, {
      method: "GET"
    });
  }


  const data = {
    createDataset,
    createDatasetFile,

    getDataset,
    getDatasets,
    getDatasetFiles,
    getDatasetFilesInfo,

    downloadDataset
  };


  return (
    <DataHubContext.Provider value={data}>
      {children}
    </DataHubContext.Provider>
  )
}


export default DataHubContextProvider;
