import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-control border border-frame/10 bg-parchment-200/70",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
