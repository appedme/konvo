// Admin API utilities
export class AdminAPI {
  static async request(endpoint, options = {}) {
    const baseUrl = '/api/admin'
    const url = `${baseUrl}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      return data
    } catch (error) {
      console.error(`Admin API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Dashboard APIs
  static async getDashboard() {
    return this.request('/dashboard')
  }

  // User Management APIs
  static async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/users${query ? `?${query}` : ''}`)
  }

  static async performUserAction(userId, action, reason = '', duration = null) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ action, userId, reason, duration })
    })
  }

  // Space Management APIs
  static async getSpaces(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/spaces${query ? `?${query}` : ''}`)
  }

  static async performSpaceAction(spaceId, action, reason = '') {
    return this.request('/spaces', {
      method: 'POST',
      body: JSON.stringify({ action, spaceId, reason })
    })
  }

  // Verification APIs
  static async getVerificationRequests(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/verification${query ? `?${query}` : ''}`)
  }

  static async performVerificationAction(requestId, action, reason = '') {
    return this.request('/verification', {
      method: 'POST',
      body: JSON.stringify({ action, requestId, reason })
    })
  }

  // Moderation APIs
  static async getReports(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/reports${query ? `?${query}` : ''}`)
  }

  static async performModerationAction(reportId, action, reason = '', actionType = null) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify({ action, reportId, reason, actionType })
    })
  }

  // Analytics APIs
  static async getAnalytics(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/analytics${query ? `?${query}` : ''}`)
  }

  // Settings APIs
  static async getSettings() {
    return this.request('/settings')
  }

  static async updateSettings(settings) {
    return this.request('/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    })
  }
}

// Helper functions for admin operations
export const adminHelpers = {
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  getStatusBadgeVariant: (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'resolved':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'banned':
      case 'rejected':
      case 'dismissed':
        return 'destructive'
      case 'verified':
        return 'success'
      default:
        return 'outline'
    }
  },

  getPriorityColor: (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  },

  truncateText: (text, maxLength = 100) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  },

  formatNumber: (num) => {
    if (!num) return '0'
    return num.toLocaleString()
  },

  calculateGrowthPercentage: (current, previous) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  },

  getUserRoleBadge: (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { variant: 'destructive', label: 'Super Admin' }
      case 'ADMIN':
        return { variant: 'default', label: 'Admin' }
      case 'MODERATOR':
        return { variant: 'secondary', label: 'Moderator' }
      default:
        return { variant: 'outline', label: 'User' }
    }
  },

  getReportTypeIcon: (type) => {
    switch (type?.toLowerCase()) {
      case 'spam':
        return '🚫'
      case 'harassment':
        return '⚠️'
      case 'inappropriate_content':
        return '🔞'
      case 'hate_speech':
        return '😡'
      case 'copyright':
        return '©️'
      case 'violence':
        return '⚔️'
      case 'misinformation':
        return '📰'
      default:
        return '🚩'
    }
  }
}

// Error handling for admin operations
export class AdminError extends Error {
  constructor(message, code = 'ADMIN_ERROR', details = null) {
    super(message)
    this.name = 'AdminError'
    this.code = code
    this.details = details
  }
}

// Toast notifications for admin actions
export const adminToast = {
  success: (message) => {
    // Implement your toast notification here
    console.log('✅', message)
  },
  
  error: (message) => {
    // Implement your toast notification here
    console.error('❌', message)
  },
  
  warning: (message) => {
    // Implement your toast notification here
    console.warn('⚠️', message)
  },
  
  info: (message) => {
    // Implement your toast notification here
    console.info('ℹ️', message)
  }
}

// Permissions helper
export const adminPermissions = {
  canModerateUsers: (userRole) => ['ADMIN', 'SUPER_ADMIN'].includes(userRole),
  canDeleteUsers: (userRole) => userRole === 'SUPER_ADMIN',
  canPromoteUsers: (userRole) => userRole === 'SUPER_ADMIN',
  canModerateSpaces: (userRole) => ['ADMIN', 'SUPER_ADMIN'].includes(userRole),
  canAccessAnalytics: (userRole) => ['ADMIN', 'SUPER_ADMIN'].includes(userRole),
  canChangeSettings: (userRole) => ['ADMIN', 'SUPER_ADMIN'].includes(userRole),
  canBanUsers: (userRole) => ['ADMIN', 'SUPER_ADMIN'].includes(userRole),
  canVerifyUsers: (userRole) => ['ADMIN', 'SUPER_ADMIN'].includes(userRole)
}
