
import { useRouter } from "next/navigation";



const MobileAlert = () => {


  const router = useRouter();


  if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) && !window.location.href.includes("/mobile"))
  {
    // do nothing
  }
}



export default MobileAlert;
