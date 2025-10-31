"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Link as LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LinkAccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkLinkStatus()
  }, [])

  const checkLinkStatus = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/auth/link-account')
      const data = await response.json()
      
      if (!data.needsLink) {
        // Already linked, redirect based on role
        const role = data.employee?.role
        if (role === 'EMPLOYEE') {
          router.push('/employee-panel')
        } else if (role === 'ADMIN' || role === 'TEAMLEADER') {
          router.push('/dashboard')
        } else {
          router.push('/employee-panel')
        }
      } else {
        setResult(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setChecking(false)
    }
  }

  const handleAutoLink = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({ success: true, employee: data.employee })
        // Redirect based on role after 2 seconds
        setTimeout(() => {
          const role = data.employee?.role
          if (role === 'EMPLOYEE') {
            router.push('/employee-panel')
          } else if (role === 'ADMIN' || role === 'TEAMLEADER') {
            router.push('/dashboard')
          } else {
            router.push('/employee-panel')
          }
          router.refresh()
        }, 2000)
      } else {
        setError(data.error || 'Failed to link account')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Checking account status...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <LinkIcon className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Link Your Account</CardTitle>
          <CardDescription>
            Connect your Clerk account to your employee record
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result?.success ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="font-medium">Successfully linked!</div>
                <div className="text-sm mt-1">
                  Employee Code: {result.employee.employeeCode}
                  <br />
                  Name: {result.employee.name}
                </div>
                <div className="text-sm mt-2">Redirecting to dashboard...</div>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {result?.canAutoLink && result?.employeeFound && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    <div className="font-medium mb-2">Employee Record Found</div>
                    <div className="text-sm space-y-1">
                      <div>Code: {result.employeeFound.employeeCode}</div>
                      <div>Name: {result.employeeFound.name}</div>
                      <div>Email: {result.email}</div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleAutoLink} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Linking Account...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Link My Account
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This will link your Clerk account to your employee record using your email address or username
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
