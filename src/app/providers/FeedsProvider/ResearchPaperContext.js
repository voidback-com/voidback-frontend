'use client'
import { API_URL, toAuthHeaders } from "@/app/configs/api";
import { AnalyticsContext } from "../AnalyticsProvider";
import { useContext } from "react";
 



const researchPaperContext = () => {


  const { logEvent } = useContext(AnalyticsContext);




  const getTopSearchQueries = async () => {
    return await fetch(API_URL+"searchQuery?object=research", {
      method: "GET"
    });
  }



  const getSimilarQueries = async (query) => {

    return await fetch(API_URL+`searchQuery?query=${query}&object=research`, {
      method: "GET"
    });
  }



  const insertSearchQuery = async (query) => {

    logEvent("search-query", window.location.href, {"query": query});

    const data = await fetch(API_URL+'searchQuery', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"query": query, "object_name": "research"})
    }).then((res)=> {
      if(res.status===200)
        return res.json();
    });

    return data;
  }

  const searchPapers = async (query) => {

    logEvent("search-papers", window.location.href, {"query": query});

    return await fetch(API_URL+`researchPaper/search?query=${query}`, {
      method: "GET"
    });
  }


  const loadTopPapers = async (page) => {
    return await fetch(API_URL+`researchPaper/topResearch?page=${page}&page_size=10`, {
      method: "GET"
    })
  }


 

  const publishResearch = async (title, thumbnail, research_pdf) => {

    logEvent("publish-research-paper", window.location.href, {"title": title});

    let data = new FormData();

    data.append("data", JSON.stringify({
      title: title
    }));

    data.append("pdf", research_pdf.file);

    data.append("thumbnail", thumbnail.file);


    return await fetch(API_URL+"researchPaper/myResearch", {
      method: "POST",
      headers: toAuthHeaders({}),
      body: data 
    });
  }



  const myResearch = async (skip, limit) => {

    logEvent("view-myresearch", window.location.href, null);

    return await fetch(API_URL+`researchPaper/myResearch?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: toAuthHeaders({})
    })
  }


  const accountResearch = async (username, skip, limit) => {

    logEvent("view-account-research", window.location.href, {"account": username});

    return await fetch(API_URL+`researchPaper/accountResearch?username=${username}&skip=${skip}&limit=${limit}`, {
      method: "GET"
    })
  }


  const deleteResearchPaper = async (id) => {

    logEvent("delete-research-paper", window.location.href, {"paper": id});

    return await fetch(API_URL+`researchPaper/myResearch`, {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"paper": id})
    })
  }



  const getResearchImpressions = async (paperId) => {
    return await fetch(API_URL+`researchPaper/allImpressions/${paperId}`, {
      method: "GET"
    })
  }


  // my impression on a research paper
  const getMyResearchImpression = async (paperId) => {
    return await fetch(API_URL+`researchPaper/myImpression/${paperId}`, {
      method: "GET",
      headers: toAuthHeaders({})
    })
  }




  const makeImpression = async (paperId, impression) => {

    logEvent("make-research-impression", window.location.href, {"paper": paperId, "impression": impression});

    return await fetch(API_URL+`researchPaper/makeImpression/${paperId}`, {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({impression: impression})
    })
  }




  const getPaperById = async (paper_id) => {

    logEvent("view-research-paper", window.location.href, {"paper": paper_id});

    return await fetch(API_URL+`researchPaper/getPaper/${paper_id}`, {
      method: "GET"
    })
  }
 

  const submitResearchReport = async (research_id, description, priority, disturbance, username) => {


    logEvent("submit-research-report", window.location.href, {"paper": research_id});

    return fetch(API_URL+"report", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        object_id: research_id,
        object_type: "research",
        description: description,
        reporter: username,
        priority: priority,
        disturbance: disturbance
      })
    });
  }


  const value = {
    getPaperById,
    insertSearchQuery,
    getTopSearchQueries,
    getSimilarQueries,

    searchPapers,
    loadTopPapers,

    publishResearch,

    myResearch,

    getResearchImpressions,
    getMyResearchImpression,

    makeImpression,

    deleteResearchPaper,

    accountResearch,

    submitResearchReport

  };


  return value;

}


export default researchPaperContext;
