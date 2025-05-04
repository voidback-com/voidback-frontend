'use client'
import { createContext, useState, useContext } from "react";
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { deviceIsMobile } from "@/app/configs/isMobile";





const WriteUpsContext = () => {



  const isMobile = deviceIsMobile();

  const getTags = async (page, size) => {
    return fetch(API_URL+`tags?page_size=${size}&page=${page}`, {
      method: "GET"
    })
  }


  const getWriteUps = async (page, searchQuery) => {
    const q = searchQuery ? `&search=${searchQuery}` : "";

    return fetch(API_URL+`writeup/list?page_size=5&page=${page}${q}`, {
      method: "GET"
    });
  }


  const getWriteUpById = async (id) => {
    return fetch(API_URL+`getWriteUp?id=${id}`, {
        method: "GET",
        headers: toAuthHeaders({})
    });
  }


  const getWriteUpImpressions = async (id) => {
    return fetch(API_URL+`writeup/impressions?writeup=${id}`, {
      method: "GET",
      headers: toAuthHeaders({})
    })
  }


  const handleWriteUpLike = async (id) => {
    return fetch(API_URL+`writeup/like?writeup=${id}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });
  }


  const createComment = async (writeup, comment, parent) => {
    const dat = {
      "writeup": writeup,
      "comment": comment,
      "parent": parent
    };


    return fetch(API_URL+`writeup/comment`, {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify(dat)
    });

  }


  const listComments = async (writeup, page, parent, sortby) => {
    return fetch(API_URL+`writeup/comments?writeup=${writeup}${parent ? "&parent=" : ""}${parent ? parent : ""}&page=${page}&page_size=5${sortby ? "&&sortby=" : ""}${sortby ? sortby : ""}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });
  }


  const getCommentsCount = async (writeup, parent) => {
    return fetch(API_URL+`writeup/comments/count?writeup=${writeup}${parent ? "&parent=" : ''}${parent ? parent : ''}`, {
      method: "GET"
    });
  }


  const handleCommentLike = async (id) => {
    return fetch(API_URL+`writeup/comment/like?comment=${id}`, {
      method: "GET",
      headers: toAuthHeaders({})
    });
  }


  const getCommentImpressions = async (id) => {
    return fetch(API_URL+`writeup/comment/impressions?comment=${id}`, {
      method: "GET",
      headers: toAuthHeaders({})
    })
  }


  const submitCommentReport = async (account, commentID, description, priority, disturbance) => {

    return fetch(API_URL+"report", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        object_id: commentID,
        object_type: "comment",
        description: description,
        reporter: account.username,
        priority: priority,
        disturbance: disturbance
      })
    }).catch((err)=> {
    })
  }



  const submitWriteupReport = async (account, writeup_id, description, priority, disturbance) => {

    return fetch(API_URL+"report", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        object_id: writeup_id,
        object_type: "writeup",
        description: description,
        reporter: account.username,
        priority: priority,
        disturbance: disturbance
      })
    }).catch((err)=> {
    })
  }



  const getAccountWriteups = async (username, page) => {
    return fetch(API_URL+`account/writeups?author=${username}&page_size=5&page=${page}`, {
      method: "GET"
    });
  }




  const getAccountSeries = async (username) => {
    return fetch(API_URL+`account/series?author=${username}`, {
      method: "GET"
    });
  }


  const getSeriesWriteups = async (series, page) => {
    return fetch(API_URL+`writeup/list?series=${series}&page_size=5&page=${page}`, {
      method: "GET"
    });
  }


  const getAccountLikedWriteups = async (username, page) => {
    return fetch(API_URL+`writeup/list/liked?account=${username}&page_size=5&page=${page}`, {
      method: "GET"
    });
  }



  const autocompleteQuery = async (query) => {
    return fetch(API_URL+`searchQuery?query=${query}&object=writeup`, {
      method: "GET"
    });
  }


  const newQuery = async (query) => {
    return fetch(API_URL+`searchQuery`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"object_name": "writeup", "query": query})
    });
  }


  const handleDeleteWriteUp = async (writeupId) => {
    return fetch(API_URL+"writeup", {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"id": writeupId})
    });
  }


  const handleDeleteComment = async (commentId) => {
    return fetch(API_URL+"writeup/comment", {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"id": commentId})
    });
  }



  const deleteSeries = async (sid) => {
    const response = await fetch(API_URL+"writeup/series/delete", {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"id": sid})
    });

    return response;
  }




  const contextData = {

    isMobile,

    autocompleteQuery,
    newQuery,

    getTags,

    deleteSeries,

    getWriteUps,
    handleDeleteWriteUp,
    handleDeleteComment,
    getWriteUpById,
    getWriteUpImpressions,
    handleWriteUpLike,

    createComment,
    listComments,

    getSeriesWriteups,
    getAccountSeries,
    getAccountWriteups,
    getAccountLikedWriteups,

    getCommentsCount,
    handleCommentLike,
    getCommentImpressions,
    submitCommentReport,
    submitWriteupReport,

  }

  return createContext(contextData);
} 


export default WriteUpsContext;
