// Simple subscription system for product updates
type Listener = () => void

let listeners: Listener[] = []

export function subscribeToProducts(listener: Listener): () => void {
  listeners.push(listener)

  // Return unsubscribe function
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function notifyProductListeners(): void {
  listeners.forEach((listener) => listener())
}
