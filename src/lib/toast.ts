import { toast } from 'sonner'

export const showToast = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 4000,
    })
  },
  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 5000,
    })
  },
  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 4000,
    })
  },
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string | ((data: T) => string); error: string | ((err: any) => string) }
  ) => {
    return toast.promise(promise, messages)
  },
}
