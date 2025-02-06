
import { useRouter } from "next/navigation";



const MobileAlert = () => {


  const router = useRouter();


  if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i) && !window.location.href.includes("/mobile"))
  {
    return router.replace("/mobile");
  }
}



export default MobileAlert;
