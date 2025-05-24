import { API_URL } from "./utils/api-server";



export default async function sitemap() {

  const results = await getResults();
  const accounts = await getAccounts();

  const staticPages = [
    {
      url: `https://voidback.com/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `https://voidback.com/threads`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `https://voidback.com/voidback/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    {
      url: `https://voidback.com/voidback/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },


    {
      url: `https://voidback.com/voidback/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    {
      url: `https://voidback.com/voidback/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },


    {
      url: `https://voidback.com/voidback/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },

  ]; 



  if(!results || !results.length || !accounts || !accounts.length)
  {
    return staticPages;
  }



  const writeups = results.map(({id, updated_at})=> {
    return {
        "url": `https://voidback.com/view/writeup/${id}`,
        'lastModified': new Date(updated_at),
        'changeFrequency': "weekly",
        'priority': 0.8
    }
  });


  const accs = accounts.map(({username})=> {
    return {
        "url": `https://voidback.com/view/account/${username}`,
        'lastModified': new Date(),
        'changeFrequency': "daily",
        'priority': 0.8
    }
  });



  return [...staticPages, ...writeups, ...accs];
}


 

async function getResults() {

  const writeUpsRes = await fetch(API_URL+"writeup/list?page_size=25000");

  const response = await writeUpsRes.json();


  const results = response?.results;

 
  return results;
}


async function getAccounts() {

  const accRes = await fetch(API_URL+"account/list?page_size=24090");
  const response = await accRes.json();


  const results = response?.results;

 
  return results;
}

export const dynamic = "force-dynamic"
