import { Button } from "@/components/ui/button"
import { Folder } from "lucide-react"
import { useRouter } from "next/navigation"



export const SeriesCard = ({ name }) => {


  const router = useRouter();

  return (
    <Button
      variant="secondary"
      size="sm"
      className="flex flex-row border p-2 rounded-md"
      onClick={() => router.push(`/explore/series/${name}`)}
    >
      <Folder />

      <p
        className="text-xs font-semibold"
      >
        {name}
      </p>
    </Button>

  )
}
