'use client'

import useSWR from 'swr'
import { useState, useCallback } from 'react'
import { voteOnPost } from '@/lib/actions/posts'

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

export function usePosts(spaceSlug = null) {
    const url = spaceSlug ? `/api/spaces/${spaceSlug}/posts` : '/api/posts'

    const { data, error, mutate, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 30000, // Refresh every 30 seconds
        dedupingInterval: 5000,
    })

    return {
        posts: data?.posts || [],
        isLoading,
        isError: error,
        mutate,
        refresh: () => mutate()
    }
}

export function usePost(postId) {
    const { data, error, mutate, isLoading } = useSWR(
        postId ? `/api/posts/${postId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
        }
    )

    return {
        post: data?.post,
        isLoading,
        isError: error,
        mutate,
        refresh: () => mutate()
    }
}

export function usePostVote(postId) {
    const [userVote, setUserVote] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Fetch user's current vote
    const { data: voteData } = useSWR(
        postId ? `/api/posts/${postId}/vote` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                setUserVote(data.vote)
            }
        }
    )

    const vote = useCallback(async (voteType) => {
        if (isLoading) return

        setIsLoading(true)
        try {
            const result = await voteOnPost(postId, voteType)
            if (result.success) {
                setUserVote(result.vote)
                return result
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error('Error voting:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [postId, isLoading])

    return {
        userVote,
        vote,
        isLoading
    }
}
