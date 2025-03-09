'use client'
import { VStack } from "@chakra-ui/react";
import { useSvgRef } from "@mui/x-charts";
import { useContext, useEffect, useState } from "react";
import { DataHubContext } from "../providers/DataHubProvider";
import { DatasetList } from "./components/datasetList";
import { Topbar } from "./components/topbar";


const Page = () => {

  document.title = "Data-Hub";

  const { getDatasets } = useContext(DataHubContext);

  const [datasets, setDatasets] = useState(null);
  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchCurrent = async () => {
    setLoading(true);


    const response = await getDatasets(page);

    const data = await response.json();


    if(response.status==200)
    {
      setDatasets(data.results);

      if(!data.next)
        setEnd(true);
    }


    setLoading(false);

  }


  const nextPage = () => {
    if(end) return;

    setPage(p=>p+1);
    fetchCurrent();
  }


  const previousPage = () => {
    if(page==1) return;

    setPage(p=>p-1);
    fetchCurrent();
  }



  useEffect(()=> {
    if(!datasets)
      fetchCurrent();
  }, [!datasets])



  return (
    <VStack
      className="w-full h-full bg-background"
    >
      <Topbar />

      <DatasetList loading={loading} pagesEnd={end} nextPage={nextPage} previousPage={previousPage} page={page} datasets={datasets} />

    </VStack>
  )

  }


export default Page;
