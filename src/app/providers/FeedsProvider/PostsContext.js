'use client'
import { createContext, useState, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { GreedyFetchContext } from "../greedyFetch";
import { AnalyticsContext } from "../AnalyticsProvider";





const PostsContext = () => {


  const { gfetch, gRequest, gfetches } = useContext(GreedyFetchContext);


  const { logEvent } = useContext(AnalyticsContext);



  const deletePost = async (id) => {

    logEvent("delete-post", window.location.href, {"id": id});

    return gfetch(
      "/api/post",
      "DELETE",
      toAuthHeaders({"Content-Type": "application/json"}),
      {"id": id},
    )
      .then((res)=> {
        if(res)
          return res;
      })
  }



  // view a post
  const viewPost = async (post_id) => {


    logEvent("view-post", window.location.href, {"id": post_id});

    return gfetch(
      `/api/post/account/impression/${post_id}`, 
      "POST", 
      toAuthHeaders({"Content-Type": "application/json"}), 
      {impression: 0}
    );

  };



  const likePost = async (post_id) => {

    logEvent("like-post", window.location.href, {"id": post_id});

    return gfetch(
      `/api/post/account/impression/${post_id}`, 
      "POST", 
      toAuthHeaders({"Content-Type": "application/json"}), 
      {impression: 1}
    );


  }


  const deleteLikePost = async (post_id) => {

    logEvent("unlike-post", window.location.href, {"id": post_id});

    return gfetch(
      `/api/post/account/impression/${post_id}`, 
      "POST", 
      toAuthHeaders({"Content-Type": "application/json"}), 
      {impression: 0}
    );

  }


  const dislikePost = async (post_id) => {

    logEvent("dislike-post", window.location.href, {"id": post_id});

    return gfetch(
      `/api/post/account/impression/${post_id}`, 
      "POST", 
      toAuthHeaders({"Content-Type": "application/json"}), 
      {impression: -1}
    );

  }


  const deleteDislikePost = async (post_id) => {

    logEvent("undislike-post", window.location.href, {"id": post_id});
    return gfetch(
      `/api/post/account/impression/${post_id}`, 
      "POST", 
      toAuthHeaders({"Content-Type": "application/json"}),
      {impression: 0}
    );

  }


  
  // get impressions of an array of posts
  const postsImpressions = async (posts) => {

    let requests = [];
    let endpoints = [];

    for(let j = 0; j < posts.length; j++)
    {
      let k = `/api/post/impressions/${posts[j].id}`;

      requests.push(gRequest(k, "GET"));

      endpoints.push(k);

    }

    const responses = await gfetches(requests);

    let data = [];

    for(let i = 0; i < endpoints.length; i++)
    {
      data.push(responses[endpoints[i]]);
    }

    return data;
  }


  const postImpressions = async (post_id) => {
    return gfetch(`/api/post/impressions/${post_id}`, "GET");
  }


  const submitPostReport = async (post_id, description, priority, disturbance, username) => {
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
    logEvent("view-account-posts", window.location.href, {"account": username});

    return await fetch(
      API_URL+`post/author?username=${username}&page=${page}&page_size=5&type=${post_type}`,
      {
        method: "GET"
      }
    );

  }



  // all the liked post by this username
  const getAccountLikedPosts = async (username, skip, limit) => {

    logEvent("view-account-liked-posts", window.location.href, {"account": username});

    return await fetch(
      API_URL+`post/account/liked?username=${username}&skip=${skip}&limit=${limit}`,
      {
        method: "GET"
      }
    );
  }


  // my impression on a certain post
  const postAccountImpression = async (post_id) => {

    return gfetch(
      `/api/post/account/impression/${post_id}`,
      "GET",
      toAuthHeaders({})
    ).then((res)=> {
        if(res)
          return res;
      })

  }


  // get the "for-you" posts
  const getForYouPosts = async (exclude) => {

    return gfetch(
      `/api/foryou`,
      "POST",
      toAuthHeaders({"Content-Type": "application/json"}),
      {"exclude": exclude}
    );

  }



  // get post by id
  const getPostById = async (post_id) => {
    return gfetch(
      `/api/post/get/${post_id}`,
      "GET"
    );
  }



  // post replies count
  const getPostRepliesCount = async (parent_post) => {
    return gfetch(
      `/api/post/repliesCount/${parent_post}`,
      "GET"
    )
  }


  // an array of post replies
  const getPostsRepliesCount = async (posts) => {

    let requests = [];
    let endpoints = [];

    for(let j = 0; j < posts.length; j++)
    {
      let k = `/api/post/repliesCount/${posts[j].id}`;

      requests.push(gRequest(k, "GET"));

      endpoints.push(k);

    }

    const responses = await gfetches(requests);

    let data = [];

    for(let i = 0; i < endpoints.length; i++)
    {
      data.push(responses[endpoints[i]]);
    }

    return data;
  }



  // post replies
  const getPostReplies = async (parent_post, page) => {
    return fetch(API_URL+`post/replies?parent_post=${parent_post}&page=${page}&page_size=5`,
      {method: "GET"}
    )
  }


  // posts symbol
  const getSymbolPosts = async (symbol, skip, limit) => {
    logEvent("view-symbol-posts", window.location.href, {"symbol": symbol});

    return fetch(
      API_URL+`symbol/${symbol}?skip=${skip}&limit=${limit}`,
      {
        method: "GET"
      }
    )
  }


  // posts hashtag
  const getHashtagPosts = async (hashtag, skip, limit) => {

    logEvent("view-hashtag-posts", window.location.href, {"hashtag": hashtag});


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
    postsImpressions, // get the impressions of the all the fetched posts
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
    getPostsRepliesCount,


    // SYMBOL
    getSymbolPosts,


    // HASHTAG
    getHashtagPosts
  };

  return createContext(context);
} 


export default PostsContext;
