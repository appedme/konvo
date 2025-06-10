import { toast } from 'react-hot-toast'

export function showSuccess(message) {
  toast.success(message, {
    duration: 3000,
    style: {
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
    },
  })
}

export function showError(message) {
  toast.error(message, {
    duration: 4000,
    style: {
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--destructive))',
      borderRadius: '8px',
    },
  })
}

export function showLoading(message) {
  return toast.loading(message, {
    style: {
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
    },
  })
}

export function dismissToast(toastId) {
  toast.dismiss(toastId)
}
