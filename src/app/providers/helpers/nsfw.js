import { API_URL } from "@/app/configs/api";



export const isTextSafe = async (text) => {
  const response = await fetch(API_URL+"nsfw/text", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({text})
  });

  const data = await response.json();


  if(response.status===200)
  {
    if(data.label==="nsfw" && data.score >= 0.5)
    {
      return false;
    }


    else
      return true;
  }

  return false;
}



export const getTextToxicity = async (text) => {
  const response = await fetch(API_URL+"nsfw/text", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({text})
  });

  const data = await response.json();


  if(response.status===200)
  {
    return data;
  }

  return null;
}


export const getImageClass = async (image) => {

  const formData = new FormData();

    formData.append("image", image.file);

    const response = await fetch(API_URL+"nsfw/image", {
      method: "POST",
      body: formData
    });


  const data = await response.json();


  if(response.status===200)
  {
    return data.label;
  }

  return null;
}

