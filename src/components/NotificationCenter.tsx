"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellOff, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { NotificationHistory } from '@/hooks/useNotifications';

interface NotificationCenterProps {
  notifications: NotificationHistory[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  unreadCount: number;
}

const NotificationCenter = ({ notifications, onMarkAsRead, onClearAll, unreadCount }: NotificationCenterProps) => {
  const [showAll, setShowAll] = useState(false);

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 10);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return '🔔';
      case 'streak':
        return '🔥';
      case 'achievement':
        return '🏆';
      case 'summary':
        return '📊';
      default:
        return '📱';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-100 text-blue-800';
      case 'streak':
        return 'bg-orange-100 text-orange-800';
      case 'achievement':
        return 'bg-green-100 text-green-800';
      case 'summary':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              {unreadCount > 0 ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {notifications.length > 10 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : 'Show All'}
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet.</p>
            <p className="text-sm">Your notifications will appear here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'text-blue-900' : ''}`}>
                            {notification.title}
                          </h4>
                          <Badge className={`text-xs ${getNotificationColor(notification.type)}`}>
                            {notification.type === 'reminder' ? 'Reminder' :
                             notification.type === 'streak' ? 'Streak' :
                             notification.type === 'achievement' ? 'Achievement' : 'Summary'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        {notification.habit_name && (
                          <p className="text-xs text-muted-foreground">
                            Habit: {notification.habit_name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), 'MM/dd/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="ml-2 h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;