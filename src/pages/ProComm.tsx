import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function ProComm() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'chat'>('friends')
  const [friends, setFriends] = useState<any[]>([])
  const [friendRequests, setFriendRequests] = useState<any[]>([])
  const [sentRequests, setSentRequests] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedFriend, setSelectedFriend] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Dummy data for testing
  const dummyFriends = [
    {
      id: 'friend1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      college: 'MIT',
      avatar_url: null,
      friendship_id: 'f1',
    },
    {
      id: 'friend2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      college: 'Stanford',
      avatar_url: null,
      friendship_id: 'f2',
    },
    {
      id: 'friend3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      college: 'Harvard',
      avatar_url: null,
      friendship_id: 'f3',
    },
    {
      id: 'friend4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      college: 'UC Berkeley',
      avatar_url: null,
      friendship_id: 'f4',
    },
  ]

  const dummyFriendRequests = [
    {
      id: 'req1',
      sender_id: 'sender1',
      receiver_id: user?.id || 'current',
      status: 'pending',
      sender: {
        id: 'sender1',
        name: 'David Wilson',
        email: 'david@example.com',
        college: 'Yale',
        avatar_url: null,
      },
    },
    {
      id: 'req2',
      sender_id: 'sender2',
      receiver_id: user?.id || 'current',
      status: 'pending',
      sender: {
        id: 'sender2',
        name: 'Jessica Martinez',
        email: 'jessica@example.com',
        college: 'Princeton',
        avatar_url: null,
      },
    },
  ]

  // Use state for dummy messages so we can update them
  const [dummyMessagesState, setDummyMessagesState] = useState<{ [key: string]: any[] }>({
    friend1: [
      {
        id: 'msg1',
        chat_id: 'chat1',
        sender_id: 'friend1',
        receiver_id: user?.id || 'current',
        content: 'Hey! How are you doing?',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        sender: { id: 'friend1', name: 'Alex Johnson', avatar_url: null },
      },
      {
        id: 'msg2',
        chat_id: 'chat1',
        sender_id: user?.id || 'current',
        receiver_id: 'friend1',
        content: "I'm doing great! Thanks for asking. How about you?",
        created_at: new Date(Date.now() - 3300000).toISOString(),
        sender: { id: user?.id || 'current', name: 'You', avatar_url: null },
      },
      {
        id: 'msg3',
        chat_id: 'chat1',
        sender_id: 'friend1',
        receiver_id: user?.id || 'current',
        content: "I'm good too! Working on a new project. Want to collaborate?",
        created_at: new Date(Date.now() - 3000000).toISOString(),
        sender: { id: 'friend1', name: 'Alex Johnson', avatar_url: null },
      },
    ],
    friend2: [
      {
        id: 'msg4',
        chat_id: 'chat2',
        sender_id: 'friend2',
        receiver_id: user?.id || 'current',
        content: 'Hi! Are you going to the hackathon this weekend?',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        sender: { id: 'friend2', name: 'Sarah Chen', avatar_url: null },
      },
      {
        id: 'msg5',
        chat_id: 'chat2',
        sender_id: user?.id || 'current',
        receiver_id: 'friend2',
        content: 'Yes! I am. Are you participating too?',
        created_at: new Date(Date.now() - 6900000).toISOString(),
        sender: { id: user?.id || 'current', name: 'You', avatar_url: null },
      },
      {
        id: 'msg6',
        chat_id: 'chat2',
        sender_id: 'friend2',
        receiver_id: user?.id || 'current',
        content: 'Yes! Maybe we can form a team?',
        created_at: new Date(Date.now() - 6600000).toISOString(),
        sender: { id: 'friend2', name: 'Sarah Chen', avatar_url: null },
      },
    ],
    friend3: [
      {
        id: 'msg7',
        chat_id: 'chat3',
        sender_id: user?.id || 'current',
        receiver_id: 'friend3',
        content: 'Hey Michael! How did the exam go?',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        sender: { id: user?.id || 'current', name: 'You', avatar_url: null },
      },
      {
        id: 'msg8',
        chat_id: 'chat3',
        sender_id: 'friend3',
        receiver_id: user?.id || 'current',
        content: 'It went well! Thanks for asking. How about yours?',
        created_at: new Date(Date.now() - 1500000).toISOString(),
        sender: { id: 'friend3', name: 'Michael Brown', avatar_url: null },
      },
    ],
    friend4: [
      {
        id: 'msg9',
        chat_id: 'chat4',
        sender_id: 'friend4',
        receiver_id: user?.id || 'current',
        content: 'Hello! 👋',
        created_at: new Date(Date.now() - 900000).toISOString(),
        sender: { id: 'friend4', name: 'Emily Davis', avatar_url: null },
      },
    ],
  })

  useEffect(() => {
    if (user) {
      // Use dummy data instead of fetching
      setFriends(dummyFriends)
      setFriendRequests(dummyFriendRequests)
      setSentRequests([])
    }
  }, [user])

  useEffect(() => {
    if (selectedFriend && user) {
      // Load dummy messages for the selected friend
      const friendMessages = dummyMessagesState[selectedFriend.id] || []
      setMessages(friendMessages)
    }
  }, [selectedFriend, user, dummyMessagesState])

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    const messagesContainer = document.getElementById('messages-container')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_')
  }

  const fetchFriends = async () => {
    if (!user) return

    const { data } = await supabase
      .from('friendships')
      .select(`
        *,
        user1:users!friendships_user1_id_fkey(id, name, email, college, avatar_url),
        user2:users!friendships_user2_id_fkey(id, name, email, college, avatar_url)
      `)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('status', 'accepted')

    if (data) {
      const friendsList = data.map((friendship: any) => {
        const friend = friendship.user1_id === user.id ? friendship.user2 : friendship.user1
        return { ...friend, friendship_id: friendship.id }
      })
      setFriends(friendsList)
    }
  }

  const fetchFriendRequests = async () => {
    if (!user) return

    const { data } = await supabase
      .from('friend_requests')
      .select(`
        *,
        sender:users!friend_requests_sender_id_fkey(id, name, email, college, avatar_url)
      `)
      .eq('receiver_id', user.id)
      .eq('status', 'pending')

    if (data) {
      setFriendRequests(data)
    }
  }

  const fetchSentRequests = async () => {
    if (!user) return

    const { data } = await supabase
      .from('friend_requests')
      .select(`
        *,
        receiver:users!friend_requests_receiver_id_fkey(id, name, email, college, avatar_url)
      `)
      .eq('sender_id', user.id)
      .eq('status', 'pending')

    if (data) {
      setSentRequests(data)
    }
  }

  const dummySearchResults = [
    {
      id: 'search1',
      name: 'Ryan Taylor',
      email: 'ryan@example.com',
      college: 'Cornell',
      avatar_url: null,
    },
    {
      id: 'search2',
      name: 'Olivia White',
      email: 'olivia@example.com',
      college: 'UCLA',
      avatar_url: null,
    },
    {
      id: 'search3',
      name: 'James Anderson',
      email: 'james@example.com',
      college: 'NYU',
      avatar_url: null,
    },
  ]

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return

    setLoading(true)
    // Simulate search delay
    setTimeout(() => {
      // Filter dummy results based on search query
      const filtered = dummySearchResults.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
      setLoading(false)
    }, 300)
  }

  const sendFriendRequest = async (receiverId: string) => {
    if (!user) return

    // Simulate sending friend request
    const newRequest = {
      id: `req_${Date.now()}`,
      sender_id: user.id,
      receiver_id: receiverId,
      status: 'pending',
      receiver: dummySearchResults.find((u) => u.id === receiverId),
    }

    setSentRequests([...sentRequests, newRequest])
    setSearchResults((prev) => prev.filter((u) => u.id !== receiverId))
  }

  const acceptFriendRequest = async (requestId: string, senderId: string) => {
    if (!user) return

    // Find the request
    const request = friendRequests.find((r) => r.id === requestId)
    if (!request) return

    // Add to friends list
    const newFriend = {
      id: request.sender.id,
      name: request.sender.name,
      email: request.sender.email,
      college: request.sender.college,
      avatar_url: request.sender.avatar_url,
      friendship_id: `f_${Date.now()}`,
    }

    setFriends([...friends, newFriend])
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId))

    // Initialize empty messages for new friend if not exists
    setDummyMessagesState((prev) => {
      if (!prev[newFriend.id]) {
        return { ...prev, [newFriend.id]: [] }
      }
      return prev
    })
  }

  const rejectFriendRequest = async (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId))
  }


  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || !user) return

    // Add message to dummy data (simulating sending)
    const newMsg = {
      id: `msg_${Date.now()}`,
      chat_id: getChatId(user.id, selectedFriend.id),
      sender_id: user.id,
      receiver_id: selectedFriend.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender: { id: user.id, name: 'You', avatar_url: null },
    }

    // Update dummy messages state for this friend
    setDummyMessagesState((prev) => {
      const friendMessages = prev[selectedFriend.id] || []
      return {
        ...prev,
        [selectedFriend.id]: [...friendMessages, newMsg],
      }
    })

    // Update messages state
    setMessages((prev) => [...prev, newMsg])
    setNewMessage('')

    // Auto-scroll to bottom
    setTimeout(() => {
      const messagesContainer = document.getElementById('messages-container')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }, 100)
  }

  return (
    <div className="flex-1 p-8 bg-silver-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">ProComm</h1>
          <p className="text-silver-dark">Connect and communicate with your peers</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-silver">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-silver-dark hover:text-black'
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'requests'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-silver-dark hover:text-black'
              }`}
            >
              Requests
              {friendRequests.length > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'search'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-silver-dark hover:text-black'
              }`}
            >
              Search Users
            </button>
            {selectedFriend && (
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'text-navy border-b-2 border-navy'
                    : 'text-silver-dark hover:text-black'
                }`}
              >
                Chat with {selectedFriend.name}
              </button>
            )}
          </div>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Your Friends</h2>
            {friends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="border border-silver rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedFriend(friend)
                      setActiveTab('chat')
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {friend.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{friend.name}</h3>
                        <p className="text-sm text-silver-dark">{friend.college}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">👥</span>
                <p className="text-silver-dark">No friends yet. Search for users to connect!</p>
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Received Requests */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Friend Requests</h2>
              {friendRequests.length > 0 ? (
                <div className="space-y-4">
                  {friendRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-silver rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {request.sender?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">{request.sender?.name}</h3>
                          <p className="text-sm text-silver-dark">{request.sender?.college}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptFriendRequest(request.id, request.sender_id)}
                          className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(request.id)}
                          className="px-4 py-2 border border-silver rounded-lg hover:bg-silver-light transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-silver-dark">No pending friend requests</p>
              )}
            </div>

            {/* Sent Requests */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Sent Requests</h2>
              {sentRequests.length > 0 ? (
                <div className="space-y-4">
                  {sentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-silver rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {request.receiver?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">{request.receiver?.name}</h3>
                          <p className="text-sm text-silver-dark">{request.receiver?.college}</p>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-silver-light text-black rounded-lg">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-silver-dark">No sent requests</p>
              )}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Search Users</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchUsers()
                  }
                }}
                placeholder="Search by name..."
                className="flex-1 px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
              />
              <button
                onClick={searchUsers}
                disabled={loading}
                className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((user) => {
                  const isRequestSent = sentRequests.some((r) => r.receiver_id === user.id)
                  const isFriend = friends.some((f) => f.id === user.id)
                  return (
                    <div
                      key={user.id}
                      className="border border-silver rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">{user.name}</h3>
                          <p className="text-sm text-silver-dark">{user.college}</p>
                        </div>
                      </div>
                      {isFriend ? (
                        <span className="px-4 py-2 bg-silver-light text-black rounded-lg">
                          Friends
                        </span>
                      ) : isRequestSent ? (
                        <span className="px-4 py-2 bg-silver-light text-black rounded-lg">
                          Request Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => sendFriendRequest(user.id)}
                          className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
                        >
                          Send Request
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && selectedFriend && (
          <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="border-b border-silver p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {selectedFriend.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-black">{selectedFriend.name}</h3>
                <p className="text-xs text-silver-dark">{selectedFriend.college}</p>
              </div>
            </div>

            {/* Messages */}
            <div id="messages-container" className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id
                          ? 'bg-navy text-white'
                          : 'bg-silver-light text-black'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender_id === user?.id ? 'text-silver-light' : 'text-silver-dark'
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-silver-dark">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-silver p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && !selectedFriend && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">💬</span>
            <p className="text-silver-dark">Select a friend to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

