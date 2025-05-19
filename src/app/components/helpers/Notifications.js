'use client'

import { API_URL, toAuthHeaders } from "@/app/utils/api"



export const readNotifications = async () => {
  await fetch(API_URL+`notifications/read`, {
    method: "GET",
    headers: toAuthHeaders({})
  })
}


export const getNotifications = async (skip, limit, read=true) => {
  const response = await fetch(API_URL+`notifications?skip=${skip}&limit=${limit}`, {
    method: "GET",
    headers: toAuthHeaders({}),
  })

  const data = await response.json();

  if(response.status===200)
  {
    if(data && data.length && read)
      await readNotifications();
    return data;
  }
  
}


export const deleteNotification = async (pk) => {
  return await fetch(API_URL+`notifications/delete/${pk}`, {
    method: "GET",
    headers: toAuthHeaders({})
  })
}


export const deleteAllNotifications = async () => {
  return await fetch(API_URL+`notifications/delete/all`, {
    method: "GET",
    headers: toAuthHeaders({})
  })
}

