import { useState, useEffect, useRef } from 'react';
import { useConversations, useMessages } from '../../api/hooks';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { user } = useAuth();
  const { data: conversations, isLoading, refetch: refetchConvs } = useConversations();
  const [activeConv, setActiveConv] = useState<number | null>(null);
  const { data: messages, refetch } = useMessages(activeConv || 0);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = (id: number) => {
    setActiveConv(id);
    setTimeout(() => refetchConvs(), 500);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    try {
      await api.post(`/api/conversations/${activeConv}/messages`, { content: newMsg });
      setNewMsg('');
      refetch();
    } catch {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat</h1>

      <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversation list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">Conversations</h2>
          </div>
          {isLoading ? (
            <p className="p-4 text-gray-400 text-sm">Loading...</p>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => openConversation(c.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                  activeConv === c.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.businessName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user?.userId === c.founderId ? c.investorName : c.founderName}
                  </p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0" />
                )}
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-400 text-sm">No conversations yet.</p>
          )}
        </div>

        {/* Messages */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {activeConv ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages?.map((m) => (
                  <div key={m.id}
                    className={`flex ${m.senderId === user?.userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                      m.senderId === user?.userId
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}>
                      <p className="text-xs font-medium opacity-70 mb-0.5">{m.senderName}</p>
                      <p className="text-sm">{m.content}</p>
                      <p className="text-[10px] opacity-50 mt-1">
                        {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 flex gap-2">
                <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500" />
                <button type="submit" disabled={sending || !newMsg.trim()}
                  className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
