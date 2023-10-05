export interface NotificationProps {
  id: string
  description: string
  type: 'friend_request' | 'appointment'
  date: Date
  asRead: boolean
}
