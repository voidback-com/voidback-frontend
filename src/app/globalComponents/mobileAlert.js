
import { useRouter } from "next/navigation";



const MobileAlert = () => {


  const router = useRouter();

  if(typeof window !== 'undefined')
  {
    if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) && !window.location.href.includes("/mobile"))
    {
      return router.replace("/mobile");
    }
  }
}



export default MobileAlert;
