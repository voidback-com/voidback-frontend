'use client'
import { createContext, useState, useContext } from "react";
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { AnalyticsContext } from "../AnalyticsProvider";





const PostsContext = () => {



  const { logEvent } = useContext(AnalyticsContext);



  const deletePost = async (id) => {

    await logEvent("delete-post", window.location.href, {"id": id});

    return fetch(API_URL+"post",
      {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"id": id}),
    })
      .then((res)=> {
        if(res.status===200)
          return res.json();
      })
  }



  // view a post
  const viewPost = async (post_id) => {


    await logEvent("view-post", window.location.href, {"id": post_id});

    return fetch(
      API_URL+`post/account/impression/${post_id}`, 
      {
      method: "POST", 
      headers: toAuthHeaders({"Content-Type": "application/json"}), 
      body: JSON.stringify({impression: 0})
      }
    );

  };



  const likePost = async (post_id) => {

    await logEvent("like-post", window.location.href, {"id": post_id});

    return fetch(
      API_URL+`post/account/impression/${post_id}`, 
      {
      method: "POST", 
      headers: toAuthHeaders({"Content-Type": "application/json"}), 
      body: JSON.stringify({impression: 1})
      }
    );


  }


  const deleteLikePost = async (post_id) => {

    await logEvent("unlike-post", window.location.href, {"id": post_id});

    return fetch(
      API_URL+`post/account/impression/${post_id}`, 
      {
      method: "POST", 
      headers: toAuthHeaders({"Content-Type": "application/json"}), 
      body: JSON.stringify({impression: 0})
      }
    );

  }


  const dislikePost = async (post_id) => {

    await logEvent("dislike-post", window.location.href, {"id": post_id});

    return fetch(
      API_URL+`post/account/impression/${post_id}`, 
      {
      method: "POST", 
      headers: toAuthHeaders({"Content-Type": "application/json"}), 
      body: JSON.stringify({impression: -1})
      }
    );

  }


  const deleteDislikePost = async (post_id) => {

    await logEvent("undislike-post", window.location.href, {"id": post_id});

    return fetch(
      API_URL+`post/account/impression/${post_id}`, 
      {
      method: "POST", 
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({impression: 0})
      }
    );

  }



  const postImpressions = async (post_id) => {
    return fetch(API_URL+`post/impressions/${post_id}`, {method: "GET"}).then((res)=>res.json());
  }


  const submitPostReport = async (post_id, description, priority, disturbance, username) => {

    await logEvent("submit-post-report", window.location.href, {"id": post_id});

    return fetch(
      API_URL+"report",
        {
        method: "POST",
        headers: toAuthHeaders({"Content-Type": "application/json"}),
        body: JSON.stringify({
          object_id: post_id,
          object_type: "post",
          description: description,
          reporter: username,
          priority: priority,
          disturbance: disturbance
        })
      });
  }



  // get all account posts
  const getAccountPosts = async (username, page, post_type) => {

    // viewed another account's posts
    await logEvent("view-account-posts", window.location.href, {"account": username});

    return await fetch(
      API_URL+`post/author?username=${username}&page=${page}&page_size=5&type=${post_type}`,
      {
        method: "GET"
      }
    );

  }



  // all the liked post by this username
  const getAccountLikedPosts = async (username, skip, limit) => {

    await logEvent("view-account-liked-posts", window.location.href, {"account": username});

    return await fetch(
      API_URL+`post/account/liked?username=${username}&skip=${skip}&limit=${limit}`,
      {
        method: "GET"
      }
    );
  }


  // my impression on a certain post
  const postAccountImpression = async (post_id) => {

    return fetch(
      API_URL+`post/account/impression/${post_id}`,
      {
        method: "GET",
      headers: toAuthHeaders({})
      }
    ).then((res)=> {
        if(res)
          return res;
      })

  }


  // get the "for-you" posts
  const getForYouPosts = async (exclude) => {

    return fetch(
      API_URL+`foryou`,
      {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"exclude": exclude})
      }
    ).then((res)=>res.json());

  }



  // get post by id
  const getPostById = async (post_id) => {
    return fetch(
      API_URL+`post/get/${post_id}`,
      {
        method: "GET"
      }
    ).then((res)=>res.json());
  }



  // post replies count
  const getPostRepliesCount = async (parent_post) => {
    return fetch(
      API_URL+`post/repliesCount/${parent_post}`,
      {
        method: "GET"
      }
    ).then((res)=>res.json())
  }




  // post replies
  const getPostReplies = async (parent_post, page) => {
    return fetch(API_URL+`post/replies?parent_post=${parent_post}&page=${page}&page_size=5`,
      {method: "GET"}
    )
  }


  // posts symbol
  const getSymbolPosts = async (symbol, skip, limit) => {
    await logEvent("view-symbol-posts", window.location.href, {"symbol": symbol});

    return fetch(
      API_URL+`symbol/${symbol}?skip=${skip}&limit=${limit}`,
      {
        method: "GET"
      }
    )
  }


  // posts hashtag
  const getHashtagPosts = async (hashtag, skip, limit) => {

    await logEvent("view-hashtag-posts", window.location.href, {"hashtag": hashtag});


    return fetch(
      API_URL+`hashtag/${hashtag}?skip=${skip}&limit=${limit}`,
      {
        method: "GET"
      }
    )
  }


  const context = {

    deletePost,


    // insert: like, deleteLike, dislike, deleteDislike, viewPost
    likePost,
    deleteLikePost,
    dislikePost,
    deleteDislikePost,
    viewPost,


    // my impression on a post and all the impressions on a post
    postAccountImpression,
    postImpressions, // get the impressions of one specific post via it's id


    // insert: report
    submitPostReport,

    // user related (profile feature)
    getAccountPosts,
    getAccountLikedPosts,

    getForYouPosts,

    getPostById,

    getPostRepliesCount,
    getPostReplies,


    // SYMBOL
    getSymbolPosts,


    // HASHTAG
    getHashtagPosts
  };

  return createContext(context);
} 


export default PostsContext;
