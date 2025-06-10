"use client"

import { SWRConfig } from 'swr'

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

export function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        revalidateOnFocus: false,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  )
}
