export const VALIDATION_RULES = {
  post: {
    content: {
      minLength: 1,
      maxLength: 5000,
    },
    title: {
      minLength: 1,
      maxLength: 200,
    }
  },
  space: {
    name: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_-]+$/,
    },
    description: {
      maxLength: 500,
    }
  },
  comment: {
    content: {
      minLength: 1,
      maxLength: 2000,
    }
  }
}

export function validatePostContent(content) {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Content is required' }
  }
  
  const trimmed = content.trim()
  
  if (trimmed.length < VALIDATION_RULES.post.content.minLength) {
    return { isValid: false, error: 'Post content cannot be empty' }
  }
  
  if (trimmed.length > VALIDATION_RULES.post.content.maxLength) {
    return { isValid: false, error: `Post content must be ${VALIDATION_RULES.post.content.maxLength} characters or less` }
  }
  
  return { isValid: true, content: trimmed }
}

export function validateSpaceName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Space name is required' }
  }
  
  const trimmed = name.trim()
  
  if (trimmed.length < VALIDATION_RULES.space.name.minLength) {
    return { isValid: false, error: `Space name must be at least ${VALIDATION_RULES.space.name.minLength} characters` }
  }
  
  if (trimmed.length > VALIDATION_RULES.space.name.maxLength) {
    return { isValid: false, error: `Space name must be ${VALIDATION_RULES.space.name.maxLength} characters or less` }
  }
  
  if (!VALIDATION_RULES.space.name.pattern.test(trimmed)) {
    return { isValid: false, error: 'Space name can only contain letters, numbers, hyphens, and underscores' }
  }
  
  return { isValid: true, name: trimmed }
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUsername(username) {
  if (!username || typeof username !== 'string') return false
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username)
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
