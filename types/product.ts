export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  isPopular?: boolean
  preparationTime?: number
  sides?: Array<{
    category: string
    options: Array<{
      name: string
      price: number
    }>
  }>
  available?: boolean
  stock?: number
}
