'use client'
import { API_URL, toAuthHeaders } from "@/app/configs/api";






const inboxContext = () => {



  const sendToInbox = async (post_id, to, caption) => {

    return fetch(API_URL+"inbox/forward", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({post: post_id, to_account: to, caption: caption})
    })
  }


  const getInbox = async (page) => {
     return fetch(API_URL+`inbox/get?page=${page}&page_size=5`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"})
    })
  }


  const deleteFromInbox = async (id) => {
    return fetch(API_URL+`inbox/delete/${id}`, {
        method: "DELETE",
        headers: toAuthHeaders({"Content-Type": "application/json"})
      });
  }



  const value = {
    // inbox functions
    sendToInbox,

    getInbox,

    deleteFromInbox

  };

  return value;

};



export default inboxContext;

