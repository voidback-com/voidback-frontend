import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { createContext } from "react";



export const DirectMessageContext = createContext();


const DirectMessageContextProvider = ({children}) => {


  const createSession = async (friend) => {

    return fetch(API_URL+'dm/create/session', {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        friend: friend
      }),
    });

  }


  const getSessions = async () => {
    return fetch(API_URL+'dm/get/sessions', {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
    });
  }


  const viewSession = async (sessionID, page) => {
    return fetch(API_URL+`dm/view/session?session=${sessionID}&page=${page}&page_size=15`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"})
    });
  }


  const deleteSession = async (sessionID) => {
    return fetch(API_URL+'dm/delete/session', {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        "session": sessionID
      })
    });
  }


  const archiveSession = async (sessionID) => {
    return fetch(API_URL+'dm/archive/session', {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        "session": sessionID
      })
    });
  }
  

  const unarchiveSession = async (sessionID) => {
    return fetch(API_URL+'dm/unarchive/session', {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        "session": sessionID
      })
    });
  }
  


  const getArchivedSessions = async () => {
    return fetch(API_URL+'dm/get/archives', {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
    });
  }



  const sendDM = async (sessionID, message, post, image) => {

    const formData = new FormData();

    formData.append("data", JSON.stringify({session: sessionID, message: message, post: post}));

    if(image)
    {
      formData.append("image", image.file);
    }


    return fetch(API_URL+`dm/send/message`, {
      method: "POST",
      headers: toAuthHeaders({}),
      body: formData,
    });
  }


  const deleteDM = async (dm_id) => {
    return fetch(API_URL+`dm/delete/message`, {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({message: dm_id})
    });
  }

  const data = {
    // DM Session
    createSession,
    getSessions,
    viewSession,
    deleteSession,

    // archives
    archiveSession,
    unarchiveSession,
    getArchivedSessions,

    // DM Messages
    sendDM,
    deleteDM
    
  }

  return (
    <DirectMessageContext.Provider
      value={data}
    >
      {children}
    </DirectMessageContext.Provider>
  )
}



export default DirectMessageContextProvider;
