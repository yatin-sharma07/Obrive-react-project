'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useDashboardData } from '@/app/(dashboard)/dashboard/useDashboardData'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  onlineUsers: number[]
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { me } = useDashboardData('employee') // or generic user hook
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<number[]>([])

  useEffect(() => {
    if (!me?.id) return

    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'https://obrive-backend-q92a.onrender.com', {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token') || localStorage.getItem('accessToken'),
      },
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('Socket connected')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      console.log('Socket disconnected')
    })

    socketInstance.on('user_online', ({ userId }) => {
      setOnlineUsers(prev => Array.from(new Set([...prev, userId])))
    })

    socketInstance.on('user_offline', ({ userId }) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId))
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [me?.id])

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}
