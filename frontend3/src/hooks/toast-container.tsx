// src/components/ui/toast-container.tsx
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-lg p-4 shadow-md",
            t.variant === "destructive" ? "bg-red-500 text-white" : "bg-gray-800 text-white"
          )}
        >
          <div className="font-semibold">{t.title}</div>
          {t.description && <div className="text-sm">{t.description}</div>}
        </div>
      ))}
    </div>
  )
}
