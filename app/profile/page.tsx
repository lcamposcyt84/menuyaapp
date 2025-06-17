"use client"

import { useRouter } from "next/navigation"
import { useCustomerAuth } from "@/hooks/use-customer-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Award, Gem, Star, User, Mail, Phone, MapPin, Edit } from "lucide-react"
import { useEffect } from "react"

const levelIcons = {
  Bronce: <Award className="w-5 h-5 text-yellow-600" />,
  Plata: <Star className="w-5 h-5 text-gray-400" />,
  Oro: <Gem className="w-5 h-5 text-yellow-400" />,
  Platino: <Gem className="w-5 h-5 text-cyan-400" />,
}

export default function ProfilePage() {
  const router = useRouter()
  const { customer } = useCustomerAuth()

  useEffect(() => {
    if (!customer) {
      router.push("/")
    }
  }, [customer, router])

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Redirigiendo...</p>
      </div>
    )
  }

  const { name, email, phone, address, rewards } = customer

  return (
    <div className="bg-muted/20 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2 text-lg">
              {levelIcons[rewards.level]}
              <span>Nivel {rewards.level}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rewards Section */}
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-sm text-primary font-semibold">Puntos de Recompensa</p>
              <p className="text-4xl font-bold text-primary">{rewards.points.toLocaleString()}</p>
            </div>

            <Separator />

            {/* Profile Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Detalles del Perfil</h3>
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{email}</span>
              </div>
              {phone && (
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-medium">{phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Dirección:</span>
                  <span className="font-medium">{address}</span>
                </div>
              )}
            </div>

            <div className="text-center pt-4">
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
