'use client'

import { accountCacheDelete, API_URL, toAuthHeaders } from "@/app/utils/api";



export const updateAccount = async (data) => {


  accountCacheDelete();


  return await fetch(API_URL + `account`, {
    method: "PATCH",
    headers: toAuthHeaders({}),
    body: data
  }).catch((err) => {
  })
}


export const deleteAccount = async () => {

  return await fetch(API_URL + `account`, {
    method: "DELETE",
    headers: toAuthHeaders({})
  }).catch((err) => {
  })

}




export const getUsernameFollowers = async (username, skip, limit) => {
  return await fetch(API_URL + `account/followers/${username}?skip=${skip}&limit=${limit}`, {
    method: "GET"
  }).catch((err) => {
  })

}


// people you follow and they followed back
export const getFriends = async (username) => {
  return await fetch(API_URL + `account/friends/${username}`, {
    method: "GET"
  }).catch((err) => {
  })

}




export const getUsernameFollowing = async (username, skip, limit) => {
  return await fetch(API_URL + `account/following/${username}?skip=${skip}&limit=${limit}`, {
    method: "GET"
  }).catch((err) => {
  })

}


// all the accounts that follow this username
export const getFollowingUsernameCount = async (username) => {
  return await fetch(API_URL + `account/followingUsername/count/${username}`, {
    method: "GET"
  }).catch((err) => {
  })

}



// all the accounts that this username follows
export const getUsernameFollowsCount = async (username) => {
  return await fetch(API_URL + `account/usernameFollows/count/${username}`, {
    method: "GET"
  }).catch((err) => {
  })

}




export const isFollowed = async (username) => {
  return await fetch(API_URL + `account/isFollowed?username=${username}`, {
    method: "GET",
    headers: toAuthHeaders({ "Content-Type": "application/json" })
  }).then((res) => {
    if (res.status === 200) {
      return true;
    }
    else {
      return false;
    }

  }).catch((err) => {
  })

}


export const isFollowingBack = async (username) => {
  return await fetch(API_URL + `account/isFollowingBack?username=${username}`, {
    method: "GET",
    headers: toAuthHeaders({ "Content-Type": "application/json" })
  }).catch((err) => {
  })

}


export const getAccountByUsername = async (username) => {
  return await fetch(API_URL + `account/getAccount/${username}`, {
    method: "GET"
  }).catch((err) => {
  })

}


export const getAccountWriteUps = async (username, nextPage) => {

  if (nextPage)
    return await fetch(nextPage);

  return await fetch(API_URL + `account/writeups?author=${username}&page=1&page_size=5`);
}


export const getAccountLikedWriteUps = async (username, nextPage) => {

  if (nextPage)
    return await fetch(nextPage);
  return await fetch(API_URL + `writeup/list/liked?account=${username}&page=1&page_size=5`);
}



export const getAccountMutuals = async (username) => {
  if (!isAuthenticated()) return;

  return await fetch(API_URL + `account/getMutuals/${username}`, {
    method: "GET",
    headers: toAuthHeaders({})
  }).catch((err) => {
  })

}



// send an otp
export const sendOtp = async () => {

  return fetch(API_URL + "account/sendOtp", {
    method: "POST",
    headers: toAuthHeaders({})
  }).catch(() => {

  })
}



export const verifyOtp = async (token) => {

  return fetch(API_URL + "account/verifyOtp", {
    method: "POST",
    headers: toAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ otp: token })
  }).then(async (r) => {
    if (r.ok)
      accountCacheDelete();
    return r;
  })
    .catch(() => {

    })
}



export const resetPassword = async (email, password) => {
  return fetch(API_URL + "account/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
}



export const fetchUserSeries = async (username) => {
  const response = await fetch(API_URL + `account/series?author=${username}`, {
    method: "GET"
  });

  if (response.ok)
    return await response.json();
}



