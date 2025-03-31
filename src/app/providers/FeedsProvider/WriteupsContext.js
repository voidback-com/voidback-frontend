'use client'
import { createContext, useState, useContext } from "react";
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { AnalyticsContext } from "../AnalyticsProvider";





const WriteUpsContext = () => {


  const { logEvent } = useContext(AnalyticsContext);


  const getTags = async (page) => {
    return fetch(API_URL+`tags?page_size=5&page=${page}`, {
      method: "GET"
    })
  }


  const getWriteUps = async (page, searchQuery) => {
    const q = searchQuery ? `&search=${searchQuery}` : "";

    return fetch(API_URL+`writeup/list?page_size=10&page=${page}${q}`, {
      method: "GET"
    })
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


  const listComments = async (writeup, page) => {
    return fetch(API_URL+`writeup/comments?writeup=${writeup}&&page=${page}&&page_size=5`, {
      method: "GET"
    });
  }


  const getCommentsCount = async (writeup) => {
    return fetch(API_URL+`writeup/comments/count?writeup=${writeup}`, {
      method: "GET"
    });
  }


  const contextData = {
    getTags,

    getWriteUps,
    getWriteUpById,
    getWriteUpImpressions,
    handleWriteUpLike,

    createComment,
    listComments,
    getCommentsCount
  }

  return createContext(contextData);
} 


export default WriteUpsContext;
