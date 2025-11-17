"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "@/types"
import { toast } from "sonner"

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    const savedProfiles = localStorage.getItem("userProfiles")
    if (savedProfiles) {
      const profiles: UserProfile[] = JSON.parse(savedProfiles)
      const userProfile = profiles.find((p) => p.userId === userId)
      if (userProfile) {
        setProfile(userProfile)
      }
    }
    setIsLoading(false)
  }, [userId])

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!userId) return null

    const savedProfiles = localStorage.getItem("userProfiles")
    const profiles: UserProfile[] = savedProfiles ? JSON.parse(savedProfiles) : []

    const existingProfileIndex = profiles.findIndex((p) => p.userId === userId)

    const updatedProfile: UserProfile = {
      id: profile?.id || `profile-${Date.now()}`,
      userId,
      name: data.name || profile?.name || "",
      email: data.email || profile?.email || "",
      phone: data.phone || profile?.phone || "",
      cpf: data.cpf || profile?.cpf || "",
      address: data.address ||
        profile?.address || {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        },
      createdAt: profile?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (existingProfileIndex >= 0) {
      profiles[existingProfileIndex] = updatedProfile
    } else {
      profiles.push(updatedProfile)
    }

    localStorage.setItem("userProfiles", JSON.stringify(profiles))
    setProfile(updatedProfile)
    toast.success("Perfil atualizado com sucesso!")

    return updatedProfile
  }

  return {
    profile,
    updateProfile,
    isLoading,
  }
}
