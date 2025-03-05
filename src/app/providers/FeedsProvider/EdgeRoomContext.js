'use client'
import { createContext, useState, useContext } from "react";
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { AnalyticsContext } from "../AnalyticsProvider";





const EdgeRoomContext = () => {



  const { logEvent } = useContext(AnalyticsContext);


  //
  // const deleteRoom = async (id) => {
  //
  //   await logEvent("delete-room", window.location.href, {"id": id});
  //
  //   return fetch(API_URL+"edgeRoom/delete",
  //     {
  //     method: "DELETE",
  //     headers: toAuthHeaders({"Content-Type": "application/json"}),
  //     body: JSON.stringify({"id": id}),
  //   })
  //     .then((res)=> {
  //       if(res.status===200)
  //         return res.json();
  //     })
  // }
  //


  const createRoom = async (name, description, categories, config) => {

    await logEvent("new-room", window.location.href, {"name": name, "categories": categories, "description": description});

    return await fetch(API_URL+"edgeRoom/create", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({name: name, description: description, categories: categories, config: config})
    });
  }


  // get rooms am a member of
  const getMyRooms = async (page) => {

    return await fetch(API_URL+`edgeRoom/list?page=${page}&page_size=5`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
    });
  }


  // get rooms i created / am an admin of
  const getCreatedRooms = async (page) => {

    return await fetch(API_URL+`edgeRoom/list/admin?page=${page}&page_size=5`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
    });
  }




  // get room posts
  const getRoomPosts = async (page, roomName) => {

    return await fetch(API_URL+`edgeRoom/list/posts?page=${page}&page_size=5&room=${roomName}`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
    });
  }



  // get top ranking rooms
  const getTopRankingRooms = async () => {
    return await fetch(API_URL+`edgeRoom/topRanking`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"})
    });
  }



  const getTopRoomsSearchQueries = async () => {
    const data = await fetch(API_URL+"searchQuery?object=explore", {
      method: "GET"
    }).then((res)=> {
      if(res.status===200)
        return res.json();
    });

    return data;
  }



  const getSimialRoomsQueries = async (query) => {
    const data = await fetch(API_URL+`searchQuery?query=${query}&object=explore`, {
      method: "GET"
    }).then((res)=> {
      if(res.status===200)
        return res.json();
    });

    return data;
  }



  const insertRoomsSearchQuery = async (query) => {

    await logEvent("rooms-search-query", window.location.href, {"query": query});


    const data = await fetch(API_URL+'searchQuery', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"query": query, "object_name": "explore"})
    }).then((res)=> {
      if(res.status===200)
        return res.json();
    });

    return data;
  }



  const joinEdgeRoom = async (data) => {
    return fetch(API_URL+"edgeRoom/join", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify(data)
    });
  }



  const getMembership = async (room) => {
    return fetch(API_URL+`edgeRoom/membership?room=${room}`, {
      method: "GET",
      headers: toAuthHeaders({}),
    });
  }



  const context = {
    createRoom,

    getMyRooms,
    getCreatedRooms,
    getRoomPosts,

    getTopRankingRooms,

    insertRoomsSearchQuery,
    getTopRoomsSearchQueries,
    getSimialRoomsQueries,

    joinEdgeRoom,
    getMembership
  };

  return createContext(context);
} 


export default EdgeRoomContext;
