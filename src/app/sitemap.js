

export default async function sitemap({results}) {

  if(!results)
  {
    return {
    };
  }
  

  const writeupsUrls = results.map(({id})=> {
    return {
        "url": `https://voidback.com/apps/${id}`,
        'lastModified': new Date(),
        'changeFrequency': "daily",
        'priority': 1 
    }
  });

  return writeupsUrls;
}


 

export async function getServerSideProps() {

  const writeUpsRes = await fetch("https://api.voidback.com/api/apps?page_size=50000");

  const response = await writeUpsRes.json();


  const results = response?.results;

 
  return {
    props: { results },
  }
}


export const dynamic = "force-dynamic"
