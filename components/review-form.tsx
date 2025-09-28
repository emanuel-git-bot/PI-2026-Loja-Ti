"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StarRating } from "./star-rating"
import { useReviews } from "@/hooks/use-reviews"
import { useToast } from "@/hooks/use-toast"
import { X, Upload } from "lucide-react"

interface ReviewFormProps {
  productId: string
  onReviewAdded?: () => void
}

export function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [userName, setUserName] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { addReview } = useReviews()
  const { toast } = useToast()

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma avaliação de 1 a 5 estrelas.",
        variant: "destructive",
      })
      return
    }

    if (!userName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva um comentário sobre o produto.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      addReview({
        productId,
        userId: crypto.randomUUID(), // Em um app real, viria do contexto de auth
        userName: userName.trim(),
        rating,
        comment: comment.trim(),
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      })

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por avaliar este produto.",
      })

      // Reset form
      setRating(0)
      setComment("")
      setUserName("")
      setImageUrls([])
      setNewImageUrl("")

      onReviewAdded?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userName">Seu Nome</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <Label>Sua Avaliação</Label>
            <div className="mt-2">
              <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Comentário</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência com este produto..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Imagens (opcional)</Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL da imagem"
                />
                <Button type="button" onClick={addImageUrl} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Imagem ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => removeImageUrl(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
