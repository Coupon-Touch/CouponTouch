import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const skeleton = {

  upload: <Skeleton className="w-full h-24 skeleton" />,
  button: <Skeleton className={"w-32 h-10 skeleton"} />,
  totalBias: <Skeleton className="w-60 h-6 skeleton" />,
  input: <Skeleton className="w-full h-10 skeleton" />,
  textArea: <Skeleton className="w-full h-20 skeleton" />,
  label: (className?: string) => <Skeleton className={cn("w-full mb-2 h-4 skeleton", className)} />
}

export default skeleton