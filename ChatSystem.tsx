import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  MessageSquare,
  Search,
  Plus,
  Send,
  Phone,
  Video,
  MoreVertical,
  Users,
  Settings,
  PaperclipIcon,
  Smile,
  Circle,
  CheckCheck,
  Clock,
  Info
} from 'lucide-react';
import { useAuth } from '../../App';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { NavigationItem } from '../dashboard/Dashboard';

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: string;
  role?: string;
  company?: string;
}

interface Conversation {
  id: string;
  participants: Contact[];
  lastMessage: Message;
  unreadCount: number;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

interface ChatSystemProps {
  onNavigate?: (section: NavigationItem) => void;
}

export function ChatSystem({ onNavigate }: ChatSystemProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatData();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatData = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/chat`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        setContacts(data.contacts || []);
      } else {
        // Sample data for demo
        const sampleContacts = [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            isOnline: true,
            lastSeen: '2024-01-28T10:30:00Z',
            role: 'Senior Software Engineer',
            company: 'Tech Corp'
          },
          {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            isOnline: false,
            lastSeen: '2024-01-28T09:15:00Z',
            role: 'Product Manager',
            company: 'Innovation Inc'
          },
          {
            id: '3',
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@email.com',
            isOnline: true,
            lastSeen: '2024-01-28T10:45:00Z',
            role: 'Marketing Director',
            company: 'Creative Agency'
          },
          {
            id: '4',
            name: 'Alumni Network',
            email: 'network@alumni.edu',
            isOnline: true,
            lastSeen: '2024-01-28T10:50:00Z',
            role: 'Group Chat',
            company: 'University'
          }
        ];

        const sampleConversations = [
          {
            id: '1',
            participants: [sampleContacts[0]],
            lastMessage: {
              id: '1',
              conversationId: '1',
              senderId: '1',
              content: 'Thanks for connecting! Looking forward to our mentorship session.',
              timestamp: '2024-01-28T10:30:00Z',
              type: 'text' as const,
              status: 'read' as const
            },
            unreadCount: 0,
            type: 'direct' as const
          },
          {
            id: '2',
            participants: [sampleContacts[1]],
            lastMessage: {
              id: '2',
              conversationId: '2',
              senderId: '2',
              content: 'The product strategy document looks great. I have a few suggestions.',
              timestamp: '2024-01-28T09:15:00Z',
              type: 'text' as const,
              status: 'delivered' as const
            },
            unreadCount: 2,
            type: 'direct' as const
          },
          {
            id: '3',
            participants: [sampleContacts[2]],
            lastMessage: {
              id: '3',
              conversationId: '3',
              senderId: '3',
              content: 'The marketing campaign results exceeded our expectations!',
              timestamp: '2024-01-28T10:45:00Z',
              type: 'text' as const,
              status: 'sent' as const
            },
            unreadCount: 1,
            type: 'direct' as const
          },
          {
            id: '4',
            participants: sampleContacts,
            lastMessage: {
              id: '4',
              conversationId: '4',
              senderId: '4',
              content: 'Welcome to the Alumni Network group chat!',
              timestamp: '2024-01-28T10:50:00Z',
              type: 'text' as const,
              status: 'read' as const
            },
            unreadCount: 0,
            type: 'group' as const,
            name: 'Alumni Network',
            avatar: undefined
          }
        ];

        setContacts(sampleContacts);
        setConversations(sampleConversations);
      }
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
      toast.error('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/chat/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        // Sample messages for demo
        const sampleMessages = [
          {
            id: '1',
            conversationId: conversationId,
            senderId: conversationId === '1' ? '1' : 'me',
            content: 'Hi! I saw your profile and would love to connect.',
            timestamp: '2024-01-28T09:00:00Z',
            type: 'text' as const,
            status: 'read' as const
          },
          {
            id: '2',
            conversationId: conversationId,
            senderId: conversationId === '1' ? 'me' : '2',
            content: 'Thanks for reaching out! I\'d be happy to help with your career questions.',
            timestamp: '2024-01-28T09:05:00Z',
            type: 'text' as const,
            status: 'read' as const
          },
          {
            id: '3',
            conversationId: conversationId,
            senderId: conversationId === '1' ? '1' : 'me',
            content: 'That would be amazing. When would be a good time for a quick call?',
            timestamp: '2024-01-28T09:10:00Z',
            type: 'text' as const,
            status: 'read' as const
          }
        ];
        setMessages(sampleMessages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const messageContent = newMessage;
    setNewMessage('');
    setIsTyping(false);

    const tempMessage: Message = {
      id: Date.now().toString(),
      conversationId: activeConversation.id,
      senderId: 'me',
      content: messageContent,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, tempMessage]);

    // Simulate WhatsApp-like message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);

    // Simulate response from other user (for demo)
    if (activeConversation.type === 'direct') {
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          conversationId: activeConversation.id,
          senderId: activeConversation.participants[0]?.id || '1',
          content: getAutoResponse(messageContent),
          timestamp: new Date().toISOString(),
          type: 'text',
          status: 'read'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 3000);
    }

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, lastMessage: tempMessage }
        : conv
    ));

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94ca4259/chat/${activeConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ content: messageContent, type: 'text' }),
      });

      if (!response.ok) {
        console.log('Message sent (demo mode)');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Nice to hear from you.";
    } else if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "I'd be happy to discuss career opportunities with you.";
    } else if (lowerMessage.includes('mentorship') || lowerMessage.includes('mentor')) {
      return "Great! I'd love to share my experience and help you grow.";
    } else if (lowerMessage.includes('thank')) {
      return "You're very welcome! Feel free to reach out anytime.";
    } else {
      const responses = [
        "Thanks for your message! I'll get back to you soon.",
        "That sounds great! Let's discuss this further.",
        "I appreciate you reaching out. Let me think about this.",
        "Interesting point! I'd love to explore this opportunity.",
        "Thank you for sharing that with me.",
        "I'll review this and get back to you shortly."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || (conv.name && conv.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-muted-foreground">
            Stay connected with your alumni network
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
            </DialogHeader>
            <NewChatDialog contacts={contacts} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              <div className="space-y-1 p-3">
                {filteredConversations.map((conversation) => {
                  const participant = conversation.type === 'direct' 
                    ? conversation.participants[0]
                    : null;
                  const displayName = conversation.name || participant?.name || 'Unknown';
                  const isActive = activeConversation?.id === conversation.id;

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isActive 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar || participant?.avatar} />
                          <AvatarFallback>
                            {conversation.type === 'group' ? (
                              <Users className="h-4 w-4" />
                            ) : (
                              getInitials(displayName)
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.type === 'direct' && participant?.isOnline && (
                          <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{displayName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs rounded-full h-5 w-5 p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeConversation.avatar || activeConversation.participants[0]?.avatar} />
                      <AvatarFallback>
                        {activeConversation.type === 'group' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          getInitials(activeConversation.participants[0]?.name || 'Unknown')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {activeConversation.name || activeConversation.participants[0]?.name}
                      </h3>
                      {activeConversation.type === 'direct' && (
                        <p className="text-sm text-muted-foreground">
                          {activeConversation.participants[0]?.isOnline 
                            ? 'Online' 
                            : `Last seen ${formatLastSeen(activeConversation.participants[0]?.lastSeen || '')}`
                          }
                        </p>
                      )}
                      {activeConversation.type === 'group' && (
                        <p className="text-sm text-muted-foreground">
                          {activeConversation.participants.length} members
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowInfo(!showInfo)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isMe = message.senderId === 'me';
                      const sender = isMe 
                        ? { name: user?.user_metadata?.name || 'You', avatar: '' }
                        : activeConversation.participants.find(p => p.id === message.senderId) || 
                          contacts.find(c => c.id === message.senderId) ||
                          { name: 'Unknown', avatar: '' };

                      return (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-2 ${
                            isMe ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={sender.avatar} />
                            <AvatarFallback className="text-xs">
                              {getInitials(sender.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                            <div
                              className={`px-3 py-2 rounded-lg ${
                                isMe
                                  ? 'bg-primary text-primary-foreground rounded-br-none'
                                  : 'bg-muted rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm break-words">{message.content}</p>
                            </div>
                            <div className={`flex items-center space-x-1 mt-1 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(message.timestamp)}
                              </span>
                              {isMe && getMessageStatusIcon(message.status)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Typing indicator */}
                    {isTyping && activeConversation.type === 'direct' && (
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activeConversation.participants[0]?.avatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(activeConversation.participants[0]?.name || 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted px-3 py-2 rounded-lg rounded-bl-none">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="pr-10"
                    />
                  </div>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function NewChatDialog({ contacts }: { contacts: Contact[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleContact = (contact: Contact) => {
    setSelectedContacts(prev =>
      prev.find(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const startChat = () => {
    if (selectedContacts.length > 0) {
      toast.success(`Started conversation with ${selectedContacts.map(c => c.name).join(', ')}`);
      // In a real app, this would create a new conversation
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2">
          {filteredContacts.map((contact) => {
            const isSelected = selectedContacts.find(c => c.id === contact.id);
            
            return (
              <div
                key={contact.id}
                onClick={() => toggleContact(contact)}
                className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 fill-green-500 text-green-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{contact.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {contact.role} at {contact.company}
                  </p>
                </div>
                
                {isSelected && (
                  <Badge variant="default" className="text-xs">
                    Selected
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
        </p>
        <Button onClick={startChat} disabled={selectedContacts.length === 0}>
          Start Chat
        </Button>
      </div>
    </div>
  );
}