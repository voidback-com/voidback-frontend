


export const TextTrim = (text, maxLen) => {
  let res = "";

  for(let i = 0; i < text.length; i++) {
    res+=text[i]
    if(i+1 == maxLen)
      return res+"...";
  }

  return res;
}
