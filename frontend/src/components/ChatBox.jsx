import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBox({ gigId, receiverId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://skillsphere-backend-jz7a.onrender.com/api/chat/${gigId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (gigId) fetchMessages();
  }, [gigId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      await axios.post(
        "https://skillsphere-backend-jz7a.onrender.com/api/chat",
        {
          gigId,
          receiverId,
          text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setText("");
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4 sm:p-6 pointer-events-none">
        
        {/* Backdrop for mobile, transparent on desktop so you can still see the dashboard */}
        <div className="fixed inset-0 bg-black/20 sm:bg-transparent pointer-events-auto sm:pointer-events-none" onClick={onClose}></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full sm:w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stripe-border flex flex-col h-[600px] max-h-[85vh] relative z-10 pointer-events-auto overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#f8fafc] border-b border-stripe-border flex justify-between items-center">
            <div>
              <h2 className="text-[#0a2540] font-bold">Messages</h2>
              <p className="text-xs font-semibold text-[#10b981] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                Online
              </p>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-2 text-[#425466] hover:bg-[#e2e8f0] rounded-full transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-white">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 bg-[#eef2ff] text-[#6366f1] rounded-full flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <p className="text-sm font-semibold text-[#0a2540] mb-1">No messages yet</p>
                <p className="text-xs text-[#425466]">Send a message to start the conversation.</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMine = msg.sender?._id === currentUser.id;
                // Add a little extra margin if the previous message was from a different sender
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const isFirstInGroup = !prevMsg || prevMsg.sender?._id !== msg.sender?._id;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id} 
                    className={`flex flex-col ${isMine ? "items-end" : "items-start"} ${isFirstInGroup ? 'mt-6' : 'mt-1'}`}
                  >
                    {isFirstInGroup && (
                      <span className="text-[11px] font-semibold text-[#64748b] mb-1.5 px-1">
                        {msg.sender?.name || (isMine ? "You" : "User")}
                      </span>
                    )}
                    <div 
                      className={`max-w-[85%] px-4 py-2.5 text-sm ${
                        isMine 
                          ? "bg-[#6366f1] text-white rounded-2xl rounded-tr-sm" 
                          : "bg-[#f1f5f9] text-[#0a2540] rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-stripe-border">
            <form onSubmit={sendMessage} className="relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-[#f8fafc] border border-stripe-border rounded-full pl-5 pr-12 py-3 text-sm text-[#0a2540] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-shadow"
              />
              <button 
                type="submit"
                disabled={!text.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#6366f1] text-white rounded-full hover:bg-[#4f46e5] disabled:opacity-50 disabled:hover:bg-[#6366f1] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}