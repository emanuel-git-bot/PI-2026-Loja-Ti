"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { ReviewForm } from "./review-form"
import { useReviews } from "@/hooks/use-reviews"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MessageSquare, Plus } from "lucide-react"

interface ReviewsSectionProps {
  productId: string
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { getProductReviews, getReviewStats } = useReviews()

  const reviews = getProductReviews(productId)
  const stats = getReviewStats(productId)

  const handleReviewAdded = () => {
    setShowReviewForm(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Avaliações dos Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.totalReviews > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                  <StarRating rating={stats.averageRating} />
                  <div className="text-sm text-gray-600 mt-1">
                    {stats.totalReviews} avaliação{stats.totalReviews !== 1 ? "ões" : ""}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-3">{star}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[star as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {stats.ratingDistribution[star as keyof typeof stats.ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Ainda não há avaliações para este produto.</p>
              <p className="text-sm text-gray-500">Seja o primeiro a avaliar!</p>
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant={showReviewForm ? "outline" : "default"}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showReviewForm ? "Cancelar" : "Escrever Avaliação"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showReviewForm && <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />}

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium">{review.userName}</div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                {review.imageUrls && review.imageUrls.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {review.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url || "/placeholder.svg"}
                        alt={`Imagem da avaliação ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
