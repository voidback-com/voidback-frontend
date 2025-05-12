

export const API_URL = process.env.API_URL;


export const errorToReadable = (errorObj) => {
  let messages = [];

  if(!errorObj)
    return "An unknown error occurred!";

  Object.keys(errorObj).map((key)=> {
    let v = errorObj[key];
    if(typeof v === Array)
      v = v[0];
    
    messages.push(`${key}: ${v}`);
  })

  let res = "";

  messages.forEach((f)=> {
    res+=f+'\n';
  })

  return res;
}



export const isError = (obj) => {
  if(obj === null || obj === undefined)
    return false;

  if("details" in obj){
    return true;
  }

  else if("message" in obj){
    return true;
  }

  else if(!obj){
    return true;
  }

  else{
    return false;
  }
}
