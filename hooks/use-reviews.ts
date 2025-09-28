"use client"

import { useState } from "react"
import type { Review, ReviewStats } from "@/types"
import { useLocalStorage } from "./use-local-storage"

export function useReviews() {
  const [reviews, setReviews] = useLocalStorage<Review[]>("reviews", [])
  const [isLoading, setIsLoading] = useState(false)

  const addReview = (review: Omit<Review, "id" | "createdAt" | "updatedAt">) => {
    const newReview: Review = {
      ...review,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setReviews([...reviews, newReview])
  }

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter((review) => review.productId === productId)
  }

  const getReviewStats = (productId: string): ReviewStats => {
    const productReviews = getProductReviews(productId)

    if (productReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / productReviews.length

    const ratingDistribution = productReviews.reduce(
      (dist, review) => {
        dist[review.rating as keyof typeof dist]++
        return dist
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    )

    return {
      averageRating,
      totalReviews: productReviews.length,
      ratingDistribution,
    }
  }

  const deleteReview = (reviewId: string) => {
    setReviews(reviews.filter((review) => review.id !== reviewId))
  }

  return {
    reviews,
    addReview,
    getProductReviews,
    getReviewStats,
    deleteReview,
    isLoading,
  }
}
