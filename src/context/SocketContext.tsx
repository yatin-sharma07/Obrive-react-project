'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { API_BASE_URL } from '@/lib/api'

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
  const { me } = useCurrentUser()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<number[]>([])

  useEffect(() => {
    if (!me?.id) return

    const socketUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      API_BASE_URL?.replace(/\/api\/?$/, '') ||
      'http://localhost:5000'

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token') || localStorage.getItem('accessToken'),
        userId: me.id,
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

    socketInstance.on('connect_error', (error) => {
      setIsConnected(false)
      console.error('Socket connection error', error.message)
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
