import { useState } from "react"

// Toast type for creating a toast
type Toast = {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

// Toast type for toasts that already have an ID
type ToastWithId = Toast & {
  id: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastWithId[]>([])

  function toast({ title, description, variant = "default" }: Toast) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return { toast, toasts }
}
