'use client'

import { CheckCircle, Paperclip, MessageSquare } from 'lucide-react'

interface ActivityStreamItem {
  id: string
  userName: string
  userRole: string
  avatar: string
  action: string
  actionType: 'update' | 'attachment' | 'comment'
}

interface ActivityStreamProps {
  activities?: ActivityStreamItem[]
}

export default function ActivityStream({
  activities = [],
}: ActivityStreamProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'attachment':
        return <Paperclip className="w-3 h-3 text-blue-400" />
      case 'comment':
        return <MessageSquare className="w-3 h-3 text-blue-400" />
      case 'update':
      default:
        return <CheckCircle className="w-3 h-3 text-blue-400" />
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 mb-2 pb-2 border-b border-gray-200">Activity Stream</h3>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-2 pb-2 border-b border-gray-100 last:border-b-0">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[9px] font-semibold shadow-sm">
                {activity.avatar}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-900">{activity.userName}</p>
                  <p className="text-[9px] text-gray-500">{activity.userRole}</p>
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  {getActionIcon(activity.actionType)}
                </div>
              </div>

              <p className="text-[9px] text-gray-600 mt-1 line-clamp-2">
                {activity.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}