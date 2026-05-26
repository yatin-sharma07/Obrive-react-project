'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, Plus, MoreHorizontal, Paperclip, Link2, AtSign, Smile, Send, Pin, Phone, Video, X, UserPlus, UserMinus, Check, Loader2, MessageSquare, ChevronDown, Info, Users, Image as ImageIcon, FileText, XCircle, Trash2, ArrowDown } from 'lucide-react'
import { useSocket } from '@/context/SocketContext'
import { apiFetch } from '@/lib/api'
import { format } from 'date-fns'
import { useDashboardData } from '@/app/(dashboard)/dashboard/useDashboardData'
import ConfirmationAlert from '@/components/ConfirmationAlert'

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: number | null
  sender_name: string
  type?: 'text' | 'system'
}

interface Participant {
  id: number
  name: string
  status: string
  job_title: string
  is_admin?: boolean
}

interface Conversation {
  id: number
  type: 'direct' | 'group'
  name: string | null
  created_by: number
  participants: Participant[]
  last_message: {
    content: string
    created_at: string
    type?: 'text' | 'system'
  } | null
  unread_count: number
}

export default function Messenger() {
  const { me, loading: dashboardLoading } = useDashboardData('employee')
  const { socket, onlineUsers, isConnected } = useSocket()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const notificationSound = useRef<HTMLAudioElement | null>(null)

  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [alert, setAlert] = useState<{ 
    isOpen: boolean; 
    title: string; 
    description?: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onConfirm?: () => void;
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    type: 'info'
  })

  const [memberToRemove, setMemberToRemove] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    notificationSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3')
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setIsLoading(true)
    await Promise.all([fetchConversations(), fetchAllUsers()])
    setIsLoading(false)
  }

  useEffect(() => {
    if (activeConversation?.id) {
      const convId = Number(activeConversation.id)
      fetchMessages(convId)
      socket?.emit('join_conversation', convId)
      markAsRead(convId)
    }
    return () => {
      if (activeConversation?.id) {
        socket?.emit('leave_conversation', Number(activeConversation.id))
      }
    }
  }, [activeConversation?.id, socket])

  useEffect(() => {
    if (!socket) return

    socket.on('message_received', (message: Message & { conversation_id: number }) => {
      if (Number(activeConversation?.id) === Number(message.conversation_id)) {
        setMessages(prev => [...prev, message])
        scrollToBottom()
      } else {
        notificationSound.current?.play().catch(() => {})
      }
      
      setConversations(prev => (prev || []).map(c => 
        Number(c.id) === Number(message.conversation_id) 
          ? { ...c, last_message: { content: message.content, created_at: message.created_at }, unread_count: Number(activeConversation?.id) === Number(message.conversation_id) ? 0 : c.unread_count + 1 }
          : c
      ))
    })

    socket.on('typing_started', ({ userId, userName, conversationId }) => {
      if (activeConversation?.id === conversationId) {
        setTypingUsers(prev => ({ ...prev, [userId]: userName }))
      }
    })

    socket.on('typing_stopped', ({ userId, conversationId }) => {
      if (Number(activeConversation?.id) === Number(conversationId)) {
        setTypingUsers(prev => {
          const next = { ...prev }
          delete next[userId]
          return next
        })
      }
    })

    socket.on('removed_from_group', ({ conversationId }) => {
      setConversations(prev => (prev || []).filter(c => Number(c.id) !== Number(conversationId)))
      if (Number(activeConversation?.id) === Number(conversationId)) {
        setActiveConversation(null)
        setAlert({
          isOpen: true,
          title: 'Removed from Group',
          description: 'You have been removed from this group by the admin.',
          type: 'info'
        })
      }
    })

    return () => {
      socket.off('message_received')
      socket.off('typing_started')
      socket.off('typing_stopped')
    }
  }, [socket, activeConversation])

  const fetchConversations = async () => {
    try {
      const response = await apiFetch('/chat/conversations')
      if (response.ok) {
        const res = await response.json()
        setConversations(Array.isArray(res.data) ? res.data : [])
      } else {
        setConversations([])
      }
    } catch (error) {
      console.error('Failed to fetch conversations', error)
      setConversations([])
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await apiFetch('/auth/users')
      if (response.ok) {
        const res = await response.json()
        setAllUsers(Array.isArray(res.data) ? res.data : [])
      } else {
        setAllUsers([])
      }
    } catch (error) {
      console.error('Failed to fetch users', error)
      setAllUsers([])
    }
  }

  const fetchMessages = async (convId: number) => {
    try {
      const response = await apiFetch(`/chat/conversations/${convId}/messages`)
      if (response.ok) {
        const res = await response.json()
        setMessages(Array.isArray(res.data) ? res.data : [])
        scrollToBottom()
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to fetch messages', error)
      setMessages([])
    }
  }

  const markAsRead = async (convId: number) => {
    try {
      await apiFetch(`/chat/conversations/${convId}/read`, { method: 'POST' })
      setConversations(prev => (prev || []).map(c => c.id === convId ? { ...c, unread_count: 0 } : c))
    } catch (error) {
      console.error('Failed to mark as read', error)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation?.id) return
    
    if (!socket || !isConnected) {
      setAlert({
        isOpen: true,
        title: 'Connection Error',
        description: 'Messenger is not connected. Please wait or refresh.',
        type: 'error'
      })
      return
    }

    const convId = Number(activeConversation.id)
    if (isNaN(convId)) {
      console.error('Invalid conversation ID:', activeConversation.id)
      return
    }

    socket.emit('send_message', {
      conversationId: convId,
      content: newMessage
    })

    setNewMessage('')
    stopTyping()
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    if (!isTyping && activeConversation && socket) {
      setIsTyping(true)
      socket.emit('typing_start', activeConversation.id)
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(stopTyping, 3000)
  }

  const stopTyping = () => {
    if (isTyping && activeConversation && socket) {
      setIsTyping(false)
      socket.emit('typing_stop', activeConversation.id)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleStartDirectMessage = async (userId: number) => {
    try {
      const response = await apiFetch('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({
          type: 'direct',
          participantIds: [userId]
        })
      })
      if (response.ok) {
        const res = await response.json()
        // Check if conversation already exists in our list
        const exists = conversations.find(c => Number(c.id) === Number(res.data.id))
        if (!exists) {
          setConversations(prev => [res.data, ...(prev || [])])
        }
        setActiveConversation(res.data)
        setShowUserSearch(false)
        setSearchQuery('')
      }
    } catch (error) {
      console.error('Failed to start direct message', error)
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return
    try {
      const response = await apiFetch('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({
          type: 'group',
          name: groupName,
          participantIds: selectedUsers
        })
      })
      if (response.ok) {
        const res = await response.json()
        setConversations(prev => [res.data, ...(prev || [])])
        setShowCreateGroup(false)
        setGroupName('')
        setSelectedUsers([])
        setActiveConversation(res.data)
        setAlert({ isOpen: true, title: 'Group created successfully!', type: 'success' })
      }
    } catch (error) {
      console.error('Failed to create group', error)
    }
  }

  const handleAddMembers = async () => {
    if (!activeConversation || selectedUsers.length === 0) return
    try {
      await apiFetch(`/chat/conversations/${activeConversation.id}/participants`, {
        method: 'POST',
        body: JSON.stringify({ participantIds: selectedUsers })
      })
      fetchConversations()
      setShowAddMember(false)
      setSelectedUsers([])
    } catch (error) {
      console.error('Failed to add members', error)
    }
  }

  const handleRemoveMember = (userId: number, userName: string) => {
    setAlert({
      isOpen: true,
      title: 'Remove Member',
      description: `Are you sure you want to remove ${userName} from this group?`,
      type: 'warning',
      confirmLabel: 'Remove',
      onConfirm: () => confirmRemoveMember(userId, userName)
    })
  }

  const confirmRemoveMember = async (userId: number, userName: string) => {
    if (!activeConversation) return
    try {
      await apiFetch(`/chat/conversations/${activeConversation.id}/participants/${userId}`, {
        method: 'DELETE'
      })
      
      // Update local state for active conversation participants immediately
      setActiveConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.filter(p => Number(p.id) !== Number(userId))
        }
      })

      fetchConversations()
      
      setAlert({
        isOpen: true,
        title: 'Member Removed',
        description: `${userName} has been removed from the group.`,
        type: 'success'
      })

      if (userId === me?.id) setActiveConversation(null)
    } catch (error) {
      console.error('Failed to remove member', error)
      setAlert({
        isOpen: true,
        title: 'Error',
        description: 'Failed to remove member. Please try again.',
        type: 'error'
      })
    }
  }

  const handleDeleteConversation = (type: 'self' | 'permanent') => {
    if (!activeConversation) return
    
    const isGroup = activeConversation.type === 'group'
    const title = type === 'permanent' ? 'Delete Group Permanently' : (isGroup ? 'Leave Group' : 'Delete Chat')
    const description = type === 'permanent' 
      ? 'Are you sure? This will delete the group and all messages for EVERYONE.' 
      : `Are you sure you want to ${isGroup ? 'leave' : 'delete'} this ${isGroup ? 'group' : 'chat'}? This will clear your chat history.`

    setAlert({
      isOpen: true,
      title,
      description,
      type: type === 'permanent' ? 'error' : 'warning',
      confirmLabel: type === 'permanent' ? 'Delete for All' : 'Delete for Me',
      onConfirm: () => confirmDeleteConversation(type)
    })
  }

  const confirmDeleteConversation = async (type: 'self' | 'permanent') => {
    if (!activeConversation) return
    try {
      await apiFetch(`/chat/conversations/${activeConversation.id}?type=${type}`, {
        method: 'DELETE'
      })
      
      setConversations(prev => (prev || []).filter(c => Number(c.id) !== Number(activeConversation.id)))
      setActiveConversation(null)
      setShowDetails(false)
      
      setAlert({
        isOpen: true,
        title: 'Success',
        description: `Conversation ${type === 'permanent' ? 'deleted for everyone' : 'removed from your end'}.`,
        type: 'success'
      })
    } catch (error) {
      console.error('Failed to delete conversation', error)
      setAlert({
        isOpen: true,
        title: 'Error',
        description: 'Failed to delete conversation. Please try again.',
        type: 'error'
      })
    }
  }

  const filteredUsers = (allUsers || []).filter(u => 
    u.id !== me?.id && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId])
  }

  const groups = (conversations || []).filter(c => c.type === 'group')
  const directMessages = (conversations || []).filter(c => c.type === 'direct')

  if (dashboardLoading || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-50 border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Messenger...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-[#F8FAFC] overflow-hidden rounded-2xl border border-gray-100 shadow-sm relative">
      {!isConnected && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[110] bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-bold border border-red-200 shadow-sm">
          Connecting to real-time server...
        </div>
      )}
      {/* Sidebar - Conversations */}
      <div className="w-80 flex flex-col border-r border-b-2 border-gray-100 bg-white">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">Conversations</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowUserSearch(true)}
              className="p-3 hover:bg-gray-200 bg-gray-100  rounded-lg  transition-colors text-black"
              title="Start direct message"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => setShowCreateGroup(true)}
              className="p-3 bg-blue-500 hover:bg-blue-600 rounded-lg  text-white transition-colors"
              title="Create group"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {/* Groups Section */}
          <div className="mb-4">
            <button className="flex items-center gap-1 text-[12px] font-semibold text-[#3F8CFF] px-2 mb-2">
              <span className="transform rotate-0"><ArrowDown /></span> Groups
            </button>
            <div className="space-y-1">
              {groups.map(conv => (
                <ConversationItem 
                  key={conv.id} 
                  conversation={conv} 
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => setActiveConversation(conv)}
                  isOnline={false}
                  currentUserId={me?.id ? Number(me.id) : undefined}
                />
              ))}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div>
            <button className="flex items-center gap-1 text-[12px] font-semibold text-[#3F8CFF] px-2 mb-2">
              <span className="transform rotate-0"><ArrowDown/></span> Direct Messages
            </button>
            <div className="space-y-1">
              {directMessages.map(conv => {
                const participants = conv.participants || []
                const otherUser = participants.find(p => Number(p.id) !== Number(me?.id))
                return (
                  <ConversationItem 
                    key={conv.id} 
                    conversation={conv} 
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => setActiveConversation(conv)}
                    isOnline={otherUser ? onlineUsers.includes(Number(otherUser.id)) : false}
                    currentUserId={Number(me?.id)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (() => {
          const participants = activeConversation.participants || []
          const otherParticipant = participants.find(p => Number(p.id) !== Number(me?.id))
          const displayName = activeConversation.type === 'group' ? activeConversation.name : otherParticipant?.name
          const displayJob = activeConversation.type === 'group' ? `${participants.length} members` : otherParticipant?.job_title

          return (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} alt="" />
                  </div>
                  {activeConversation.type === 'direct' && otherParticipant && onlineUsers.includes(Number(otherParticipant.id)) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-gray-800">
                    {displayName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {displayJob}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeConversation.type === 'group' && Number(activeConversation.created_by) === Number(me?.id) && (
                  <button 
                    onClick={() => setShowAddMember(true)}
                    className="p-3 hover:bg-blue-50 bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    title="Add members"
                  >
                    <UserPlus size={18} />
                  </button>
                )}
                <button className="p-3 hover:bg-gray-100 rounded-lg bg-gray-100  text-gray-500"><Search size={18} /></button>
                
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${showDetails ? 'bg-blue-50 text-blue-500' : 'text-gray-500'}`}
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Today, {format(new Date(), 'MMMM d')}</span>
              </div>

              {messages.map((msg, index) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isMe={msg.sender_id === me?.id} 
                  showAvatar={index === 0 || messages[index-1].sender_id !== msg.sender_id}
                />
              ))}
              
              {/* Typing Indicator */}
              {Object.keys(typingUsers).length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse mt-4">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span>{Object.values(typingUsers).join(', ')} typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="flex gap-1 px-2">
                  <button type="button" className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"><Paperclip size={18} /></button>
                  <button type="button" className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"><Link2 size={18} /></button>
                  <button type="button" className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"><AtSign size={18} /></button>
                </div>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
                <div className="flex items-center gap-2">
                  <button type="button" className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"><Smile size={18} /></button>
                  <button type="submit" className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100" disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </>
          )
        })() : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Send size={40} className="ml-1" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your Messenger</h3>
            <p className="max-w-xs">Connect with your colleagues, share files, and collaborate in real-time.</p>
          </div>
        )}
      </div>

      {/* Details Sidebar */}
      {showDetails && activeConversation && (
        <div className="w-80 border-l border-gray-100 bg-white flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Details</h3>
            <button 
              onClick={() => setShowDetails(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex flex-col items-center border-b border-gray-50">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-100">
                {activeConversation.type === 'group' ? (
                  <Users size={40} />
                ) : (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${activeConversation.participants.find(p => Number(p.id) !== Number(me?.id))?.name}&background=random`} 
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                )}
              </div>
              <h4 className="text-lg font-bold text-gray-800 text-center">
                {activeConversation.type === 'group' ? activeConversation.name : activeConversation.participants.find(p => Number(p.id) !== Number(me?.id))?.name}
              </h4>
              
              <div className="flex gap-4 mt-6">
                <button className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                  <Search size={20} />
                </button>
                {activeConversation.type === 'group' && Number(activeConversation.created_by) === Number(me?.id) && (
                  <button 
                    onClick={() => setShowAddMember(true)}
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                  >
                    <UserPlus size={20} />
                  </button>
                )}
                <button className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="p-2 space-y-1">
              <DetailSection icon={<Info size={18}/>} title="Info" />
              <DetailSection 
                icon={<Users size={18}/>} 
                title="Members" 
                count={activeConversation.participants.length}
                isOpen={true}
                action={
                  activeConversation.type === 'group' && Number(activeConversation.created_by) === Number(me?.id) ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddMember(true);
                      }}
                      className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                      title="Add members"
                    >
                      <Plus size={16} />
                    </button>
                  ) : undefined
                }
              >
                <div className="space-y-1 mt-2">
                  {activeConversation.participants.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl group transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${p.name}&background=random`} alt="" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-gray-700 truncate">{p.name}</p>
                            {p.is_admin && (
                              <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-1 py-0.5 rounded uppercase tracking-tighter">Admin</span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 truncate">{p.job_title}</p>
                        </div>
                      </div>
                      {Number(activeConversation.created_by) === Number(me?.id) && Number(p.id) !== Number(me?.id) && (
                        <button 
                          onClick={() => handleRemoveMember(p.id, p.name)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <UserMinus size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </DetailSection>
              <DetailSection icon={<ImageIcon size={18}/>} title="Media" />
              <DetailSection icon={<FileText size={18}/>} title="Files" />
              <DetailSection icon={<Link2 size={18}/>} title="Links" />
            </div>

            <div className="p-4 mt-auto border-t border-gray-50 flex flex-col gap-2">
              <button 
                onClick={() => handleDeleteConversation('self')}
                className="w-full py-2.5 px-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left flex items-center gap-3"
              >
                <XCircle size={18} />
                {activeConversation.type === 'group' ? 'Leave Group' : 'Delete Chat'}
              </button>
              
              {activeConversation.type === 'group' && Number(activeConversation.created_by) === Number(me?.id) && (
                <button 
                  onClick={() => handleDeleteConversation('permanent')}
                  className="w-full py-2.5 px-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left flex items-center gap-3"
                >
                  <Trash2 size={18} />
                  Delete Group for Everyone
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showCreateGroup || showAddMember || showUserSearch) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {showCreateGroup ? 'Create New Group' : showAddMember ? 'Add Members' : 'Start New Chat'}
              </h3>
              <button onClick={() => { setShowCreateGroup(false); setShowAddMember(false); setShowUserSearch(false); setSelectedUsers([]); setSearchQuery(''); }} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {showCreateGroup && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Group Name</label>
                  <input 
                    type="text" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  {showUserSearch ? 'Search Employee' : 'Select Members'}
                </label>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {filteredUsers.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => showUserSearch ? handleStartDirectMessage(u.id) : toggleUserSelection(u.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${selectedUsers.includes(u.id) ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} alt="" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.job_title || u.role}</p>
                      </div>
                      {!showUserSearch && selectedUsers.includes(u.id) && <div className="bg-blue-500 text-white rounded-full p-1"><Check size={12} /></div>}
                      {showUserSearch && <div className="text-blue-500 p-1"><Send size={16} /></div>}
                    </button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="py-8 text-center text-gray-400">
                      No employees found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!showUserSearch && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => { setShowCreateGroup(false); setShowAddMember(false); setSelectedUsers([]); }}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={showCreateGroup ? handleCreateGroup : handleAddMembers}
                  disabled={(showCreateGroup && !groupName.trim()) || selectedUsers.length === 0}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
                >
                  {showCreateGroup ? 'Create Group' : 'Add Selected'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationAlert 
        isOpen={alert.isOpen}
        title={alert.title}
        description={alert.description}
        type={alert.type}
        confirmLabel={alert.confirmLabel}
        onConfirm={alert.onConfirm}
        onCancel={() => setAlert(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}

function DetailSection({ icon, title, count, children, isOpen: initialOpen = false, action }: { icon: React.ReactNode, title: string, count?: number, children?: React.ReactNode, isOpen?: boolean, action?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <div className="overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
      >
        <div className="flex items-center gap-3 text-gray-600">
          <div className="p-2 bg-gray-50 group-hover:bg-white rounded-lg transition-colors">
            {icon}
          </div>
          <span className="text-sm font-bold text-gray-700">{title}</span>
          {count !== undefined && (
            <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && children && (
        <div className="px-3 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}

function ConversationItem({ conversation, isActive, onClick, isOnline, currentUserId }: { conversation: Conversation, isActive: boolean, onClick: () => void, isOnline: boolean, currentUserId?: number }) {
  const participants = conversation.participants || []
  const otherParticipant = participants.find(p => Number(p.id) !== Number(currentUserId))
  const displayName = conversation.type === 'group' ? conversation.name : otherParticipant?.name

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 border border-blue-100 shadow-sm' : 'hover:bg-gray-50 border border-transparent'}`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} alt="" />
        </div>
        {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>}
      </div>
      <div className="flex-1 text-left overflow-hidden">
        <div className="flex justify-between items-baseline mb-0.5">
          <h4 className={`text-sm font-bold truncate text-[13px] ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
            {displayName}
          </h4>
          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
            {conversation.last_message ? format(new Date(conversation.last_message.created_at), 'HH:mm') : ''}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 truncate flex-1 mr-2">
            {conversation.last_message ? (
              conversation.last_message.type === 'system' ? (
                <span className="italic italic-gray-300 font-medium opacity-80">{conversation.last_message.content}</span>
              ) : (
                conversation.last_message.content
              )
            ) : 'No messages yet'}
          </p>
          {conversation.unread_count > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function MessageBubble({ message, isMe, showAvatar }: { message: Message, isMe: boolean, showAvatar: boolean }) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-wider">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} group`}>
      <div className={`w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 shadow-sm transition-opacity duration-200 ${!showAvatar && 'opacity-0'}`}>
        <img src={`https://ui-avatars.com/api/?name=${message.sender_name}&background=random`} alt="" />
      </div>
      <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-baseline gap-2 mb-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs font-bold text-gray-700">{isMe ? 'You' : message.sender_name}</span>
          <span className="text-[10px] text-gray-400 font-medium">{format(new Date(message.created_at), 'HH:mm a')}</span>
        </div>
        <div className={`p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all ${isMe ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 hover:border-gray-200'}`}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
