
export const API_URL = process.env.API_URL;
export const WS_NOTIFICATIONS_COUNT = process.env.WS_NOTIFICATIONS_COUNT;



export const toAuthHeaders = (headers, authTok) => {
  try{

    const tok = JSON.parse(authTok);
  
    if(tok)
    {
      if(tok)
      {
        headers["Authorization"] = `Token ${tok.token}`
        return headers;
      }
    }

  } catch(err){

  }

  return headers;
}


