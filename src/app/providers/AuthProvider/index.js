'use client'
import { createContext, useState, useEffect, useContext } from "react";
import { deleteCookie } from "cookies-next";
import { accountCacheDelete, accountCacheGet, accountCacheStore, API_URL, isAuthenticated, toAuthHeaders } from "@/app/configs/api";


export const AuthContext = createContext();



const AuthContextProvider = ({ children }) => {

  const [account, setAccount] = useState(null);





  const auth_signup = async (username, email, password, full_name, birth_date) => {


    const body = {
      full_name: full_name,
      username: username,
      email: email,
      password: password,
      birth_date: birth_date
    };


    return fetch(API_URL+"signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }) .catch(()=> {

      });
  }


  const auth_reset = async (data) => {


    return fetch(API_URL+"account/reset", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).catch(()=> {

      })
  }


  const getAccountStatus = async (username) => {
    return await fetch(API_URL+`account/status?account=${username}`, {
      method: "GET",
      headers: await toAuthHeaders({})
    }).catch((err)=> {
      })
  }


  const auth_sendOtp = async () => {


    return fetch(API_URL+"account/sendOtp", {
      method: "POST",
      headers: toAuthHeaders({})
    }).catch(()=> {

      })
  }




  const refetchAccount = async () => {
    const headers = toAuthHeaders({});

    fetch(API_URL+"account", {
      method: "GET",
      headers: headers
    })
    .then((res)=> {
      if(res.status===200)
        return res.json();
      else{
        refreshToken();
      }
    }).then((acc)=> {
      if(acc)
      {
          accountCacheStore(acc);
          setAccount(acc);
      }
      }).catch((err)=> {
        //
      })
  }





  const refreshAccount = async () => {

    const acc = accountCacheGet();

    if(acc)
    {
      setAccount(acc);
      return;
    }

    const headers = toAuthHeaders({});

    fetch(API_URL+"account", {
      method: "GET",
      headers: headers
    })
    .then((res)=> {
      if(res.status===200)
        return res.json();
      else{
        refreshToken();
      }
    }).then((acc)=> {
      if(acc)
      {
          accountCacheStore(acc);
          setAccount(acc);
      }
      }).catch((err)=> {
        //
      })
  }



  const auth_verifyOtp = async (token) => {


    return fetch(API_URL+"account/verifyOtp", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({otp: token})
    }).then( async (r)=> {
        setAccount(null);
        await refreshAccount(); // get the updated email_verified field
        return r;
      })
      .catch(()=> {

      })
  }


  const auth_login = async (email, password) => {


    const body = {
      username: email,
      password: password
    };


    return fetch(API_URL+"login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    }).catch(()=> {

      })
  }



  const logoutUser = async () => {
    deleteCookie("authTok");
    accountCacheDelete();

    await fetch(API_URL+"logout", {
      method: "GET",
      headers: toAuthHeaders({})
    });
  }




  const updateAccount = async (data) => {


    accountCacheDelete();

    return await fetch(API_URL+`account`, {
      method: "PATCH",
      headers: toAuthHeaders({}),
      body: data
    }).catch((err)=> {
    })
  }


  const deleteAccount = async (otp) => {


    return await fetch(API_URL+`account`, {
      method: "DELETE",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({"otp": otp})
    }).catch((err)=> {
      })

  }




  const follow = async (username) => {


    return await fetch(API_URL+`account/follow?username=${username}`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"})
    }).then((res)=> {
        return res;
      }).catch((err)=> {
      })

  }

 
  const unfollow = async (username) => {

    return await fetch(API_URL+`account/unfollow?username=${username}`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"})
    }).then((res)=> {
        return res;
      }).catch((err)=> {
      })

  }

 
  const getUsernameFollowers = async (username, skip, limit) => {
    return await fetch(API_URL+`account/followers/${username}?skip=${skip}&limit=${limit}`, {
      method: "GET"
    }).catch((err)=> {
      })

  }
 
 
  // people you follow and they followed back
  const getFriends = async (username) => {
    return await fetch(API_URL+`account/friends/${username}`, {
      method: "GET"
    }).catch((err)=> {
      })

  }
 



  const getUsernameFollowing = async (username, skip, limit) => {
    return await fetch(API_URL+`account/following/${username}?skip=${skip}&limit=${limit}`, {
      method: "GET"
    }).catch((err)=> {
      })

  }
 

  const getUsernameFollowingCount = async (username) => {
    return await fetch(API_URL+`account/following/count/${username}`, {
      method: "GET"
    }).catch((err)=> {
      })

  }



  const isFollowed = async (username) => {
      return await fetch(API_URL+`account/isFollowed?username=${username}`, {
        method: "GET",
        headers: toAuthHeaders({"Content-Type": "application/json"})
      }).then((res)=> {
          if(res.status===200)
          {
            return true;
          }
          else{
            return false;
          }

        }).catch((err)=> {
      })
    
  }


  const isFollowingBack = async (username) => {
     return await fetch(API_URL+`account/isFollowingBack?username=${username}`, {
      method: "GET",
      headers: toAuthHeaders({"Content-Type": "application/json"})
    }).catch((err)=> {
      })

  }


  const getAccountByUsername = async (username) => {
    return await fetch(API_URL+`account/getAccount/${username}`, {
      method: "GET"
    }).catch((err)=> {
      })

  }




  const getAccountMutuals = async (username) => {
    if(!isAuthenticated()) return;

    return await fetch(API_URL+`account/getMutuals/${username}`, {
      method: "GET",
      headers: toAuthHeaders({})
    }).catch((err)=> {
      })

  }



  useEffect(()=> {
    if(isAuthenticated())
    {
      refreshAccount();
    }
  }, [!account])


  const submitAccountReport = async (uid, description, priority, disturbance) => {


    return fetch(API_URL+"report", {
      method: "POST",
      headers: toAuthHeaders({"Content-Type": "application/json"}),
      body: JSON.stringify({
        object_uuid: uid,
        object_type: "account",
        description: description,
        reporter: account.username,
        priority: priority,
        disturbance: disturbance
      })
    }).catch((err)=> {
      })



  }



  const value = {

    account,

    auth_signup,

    auth_verifyOtp,
    auth_sendOtp,
    auth_reset,

    auth_login,


    updateAccount,
    deleteAccount,
    refreshAccount,


    getAccountByUsername,

    getUsernameFollowers,
    getUsernameFollowing,

    getUsernameFollowingCount,

    getAccountMutuals,

    follow,
    unfollow,
    isFollowed,
    isFollowingBack,


    submitAccountReport,

    getAccountStatus,
    getFriends,

    logoutUser,
    refetchAccount

  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


export default AuthContextProvider;
