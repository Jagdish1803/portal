"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Download, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "@tanstack/react-query"
import { createSupabaseClient } from "@/lib/supabase"

const supabase = createSupabaseClient()

export default function MyProfilePage() {
  const { user } = useUser()
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoBlobUrl, setProfilePhotoBlobUrl] = useState<string>("")
  const [loadedPhotoUrl, setLoadedPhotoUrl] = useState<string>("")

  // Profile data
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    dateOfBirth: "",
    education: "",
    motherName: "",
    address: ""
  })

  // Documents
  const [documents, setDocuments] = useState<Record<string, File | null>>({
    aadharCard: null,
    panCard: null,
    sscMarksheet: null,
    hscMarksheet: null,
    finalYearMarksheet: null
  })

  // Load profile data
  const { data: existingData } = useQuery({
    queryKey: ['profile-documents'],
    queryFn: async () => {
      const res = await fetch('/api/profile/documents')
      if (!res.ok) throw new Error('Failed to fetch profile')
      return res.json()
    }
  })

  useEffect(() => {
    if (existingData?.profileData) {
      setProfileData(prev => ({
        ...prev,
        phone: existingData.profileData.phone || "",
        dateOfBirth: existingData.profileData.dateOfBirth || "",
        education: existingData.profileData.education || "",
        motherName: existingData.profileData.motherName || "",
        address: existingData.profileData.address || ""
      }))
    }
  }, [existingData])

  // Load profile photo
  useEffect(() => {
    if (existingData?.documents?.passportPhoto) {
      loadProfilePhoto(existingData.documents.passportPhoto)
    }
  }, [existingData])

  const loadProfilePhoto = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .createSignedUrl(filePath, 3600)

      if (error) throw error
      if (data?.signedUrl) {
        setLoadedPhotoUrl(data.signedUrl)
      }
    } catch (error) {
      console.error('Error loading photo:', error)
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const blobUrl = URL.createObjectURL(file)
      setProfilePhotoBlobUrl(blobUrl)
    }
  }

  const removePhoto = () => {
    setProfilePhoto(null)
    setProfilePhotoBlobUrl("")
    if (profilePhotoBlobUrl) {
      URL.revokeObjectURL(profilePhotoBlobUrl)
    }
  }

  const handleDocumentUpload = async (file: File, type: string) => {
    const userId = user?.id
    if (!userId) return null

    const filePath = `${userId}/${type}-${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from('employee-documents')
      .upload(filePath, file)

    if (error) throw error
    return filePath
  }

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const userId = user?.id
      if (!userId) throw new Error('No user ID')

      let photoPath = existingData?.documents?.passportPhoto || null

      // Upload profile photo if new one selected
      if (profilePhoto) {
        photoPath = await handleDocumentUpload(profilePhoto, 'profile-photo')
      }

      // Upload documents
      const documentPaths: Record<string, string | null> = {}
      for (const [type, file] of Object.entries(documents)) {
        if (file) {
          documentPaths[type] = await handleDocumentUpload(file, type)
        }
      }

      // Save to database
      const response = await fetch('/api/profile/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profileData,
          documents: {
            passportPhoto: photoPath,
            ...documentPaths
          }
        })
      })

      if (!response.ok) throw new Error('Failed to save profile')
      return response.json()
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      setDocuments({
        aadharCard: null,
        panCard: null,
        sscMarksheet: null,
        hscMarksheet: null,
        finalYearMarksheet: null
      })
      setProfilePhoto(null)
      setProfilePhotoBlobUrl("")
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`)
    }
  })

  const handleSaveProfile = () => {
    saveProfileMutation.mutate()
  }

  const handleDocumentChange = (type: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }))
  }

  const previewDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .createSignedUrl(filePath, 60)

      if (error) throw error
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (error) {
      toast.error('Failed to preview document')
    }
  }

  const deleteDocument = async (type: string) => {
    try {
      const userId = user?.id
      if (!userId) return

      await fetch('/api/profile/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profileData,
          documents: {
            [type]: null
          }
        })
      })

      toast.success('Document deleted')
    } catch (error) {
      toast.error('Failed to delete document')
    }
  }

  const renderDocumentUpload = (label: string, type: string, existingPath?: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {existingPath ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => previewDocument(existingPath)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => deleteDocument(type)}
          >
            <X className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      ) : documents[type] ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">{documents[type]!.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleDocumentChange(type, null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleDocumentChange(type, e.target.files?.[0] || null)}
        />
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          View and update your personal information
        </p>
      </div>

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload or change your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePhotoBlobUrl || loadedPhotoUrl || user?.imageUrl} />
              <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  {loadedPhotoUrl || profilePhotoBlobUrl ? "Change Photo" : "Add Photo"}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
              </Button>
              {(profilePhoto || loadedPhotoUrl) && (
                <Button variant="ghost" size="sm" onClick={removePhoto}>
                  <X className="mr-1 h-3 w-3" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profileData.fullName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profileData.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education Qualification</Label>
              <Input
                id="education"
                placeholder="e.g., B.Tech, MBA"
                value={profileData.education}
                onChange={(e) => setProfileData({...profileData, education: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                placeholder="Full name"
                value={profileData.motherName}
                onChange={(e) => setProfileData({...profileData, motherName: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Permanent Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your full address"
              rows={3}
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Upload your important documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {renderDocumentUpload("Aadhar Card", "aadharCard", existingData?.documents?.aadharCard)}
            {renderDocumentUpload("PAN Card", "panCard", existingData?.documents?.panCard)}
            {renderDocumentUpload("SSC Marksheet", "sscMarksheet", existingData?.documents?.sscMarksheet)}
            {renderDocumentUpload("HSC Marksheet", "hscMarksheet", existingData?.documents?.hscMarksheet)}
            {renderDocumentUpload("Final Year Marksheet", "finalYearMarksheet", existingData?.documents?.finalYearMarksheet)}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSaveProfile}
          disabled={saveProfileMutation.isPending}
        >
          {saveProfileMutation.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  )
}
