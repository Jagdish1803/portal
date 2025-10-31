"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MyLeavesPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/employee-panel/my-leaves/apply")
  }, [router])

  return null
}
