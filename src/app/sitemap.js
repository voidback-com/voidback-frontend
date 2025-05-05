

export default async function sitemap({results}) {

  if(!results)
  {
    return {
    };
  }
  

  const writeupsUrls = results.map(({id})=> {
    return {
        "url": `https://voidback.com/view/writeup/${id}`,
        'lastModified': new Date(),
        'changeFrequency': "daily",
        'priority': 1 
    }
  });

  return writeupsUrls;
}


 

export async function getServerSideProps() {

  const writeUpsRes = await fetch("https://api.voidback.com/api/writeup/list?page_size=50000")
    .from("Model") 
    .select("id")
    .limit(10000);


  const response = await writeUpsRes.json();


  const results = response?.results;

 
  return {
    props: { results },
  }
}


export const dynamic = "force-dynamic"
