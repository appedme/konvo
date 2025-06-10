'use client'

import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  return res.json()
}

export function useSpaces() {
  const { data, error, mutate, isLoading } = useSWR('/api/spaces', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 60000, // Refresh every minute
    dedupingInterval: 10000,
  })

  return {
    spaces: data?.spaces || [],
    isLoading,
    isError: error,
    mutate,
    refresh: () => mutate()
  }
}

export function useSpace(slug) {
  const { data, error, mutate, isLoading } = useSWR(
    slug ? `/api/spaces/by-slug/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  )

  return {
    space: data?.space,
    isLoading,
    isError: error,
    mutate,
    refresh: () => mutate()
  }
}

export function useComments(postId) {
  const { data, error, mutate, isLoading } = useSWR(
    postId ? `/api/posts/${postId}/comments` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 15000, // Refresh every 15 seconds for active discussions
    }
  )

  const addComment = async (content) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const result = await response.json()
        // Optimistically update the cache
        mutate()
        return result
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  return {
    comments: data?.comments || [],
    isLoading,
    isError: error,
    addComment,
    refresh: () => mutate()
  }
}
