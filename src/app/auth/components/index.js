'use client';
import styled from "@emotion/styled";
import { pipeline } from "@xenova/transformers";



export const Touchable = styled.button`
  background-color: transparent;
  width: fit-content;
  height: fit-content;
  border-width: 0px;

  &:hover{
    opacity: 70%;
  }
`;



// (Validation functions)

export const isEmailValid = (email) => {
  let r = /^[a-zA-Z0-9]+(.)+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

  if (r.test(email)) return true;

  return false;
}


export const isUsernameValid = async (username) => {


  if(username.length < 3) return false;

  let usernameRegex = /^[a-zA-Z0-9]+([a-zA-Z0-9](_)[a-zA-Z0-9])*[a-zA-Z0-9]+$/;

  if(usernameRegex.test(username)) {

    let toxicity_model = await pipeline("text-classification", "Xenova/toxic-bert");
    const res = await toxicity_model(username, {topk: null}).then((res)=> {
      if(res)
        return res[0].score;
    })


    if(res && res >= 0.05)
      return "nsfw";

    return true;
  }

  return false;
}



export const isFullNameValid = async (fullName) => {
  let fullnameRegex = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;

  if(fullnameRegex.test(fullName)) {

    let toxicity_model = await pipeline("text-classification", "Xenova/toxic-bert");
    const res = await toxicity_model(fullName, {topk: null}).then((res)=> {
      if(res)
        return res[0].score;
    })


    if(res && res >= 0.05)
      return "nsfw";


    return true;
  };

  return false;
}


export const isBioValid = async (bio) => {

  if(bio.length<=300) {

    let toxicity_model = await pipeline("text-classification", "Xenova/toxic-bert");
    const res = await toxicity_model(bio, {topk: null}).then((res)=> {
      if(res)
        return res[0].score;
    })


    if(res && res >= 0.05)
      return "nsfw";

    return true;

  };

  return false;
}



export const isLinkValid = async (link) => {
  let linkrgx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  if(linkrgx.test(link)) {

    let toxicity_model = await pipeline("text-classification", "Xenova/toxic-bert");
    const res = await toxicity_model(link, {topk: null}).then((res)=> {
      if(res)
        return res[0].score;
    })


    if(res && res >= 0.05)
      return "nsfw";

    return true;

  };

  return false;
}


export const isPasswordValid = (password) => {
  if(password.length < 6) return false;
  return true;
}



export const isBirthDateValid = (birthdate) => {
  let birth = new Date(birthdate);

  let n = new Date();

  let age = n.getUTCFullYear()-birth.getUTCFullYear();
  if(age >= 18 && age < 95)
  {
    return 1;
  }

  else if(age < 18)
    return 0;

  else if(age >= 95)
    return 2;
    
}



