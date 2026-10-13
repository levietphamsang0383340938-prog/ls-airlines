"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, ExternalLink, Paperclip, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "bot"
  text: string
}

interface NeoChatProps {
  isOpen: boolean
  onClose: () => void
}

export function NeoChat({ isOpen, onClose }: NeoChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", role: "bot", text: "Xin chào! Tôi là LEO, trợ lý ảo của LS Airlines. Tôi có thể giúp gì cho chuyến bay của bạn hôm nay?" }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Timeout logic cho 3 phút không tương tác
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      setMessages(prev => {
        // Kiểm tra xem tin nhắn cuối cùng đã là câu hỏi đánh giá chưa để tránh gửi lặp lại
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.text.includes("đánh giá mức độ hài lòng")) {
          return prev;
        }
        return [...prev, {
          id: Date.now().toString(),
          role: "bot",
          text: "Nếu không cần hỗ trợ thêm, quý khách vui lòng dành chút thời gian để đánh giá mức độ hài lòng với dịch vụ chăm sóc khách hàng của LS Airlines theo thang điểm 1 (Rất không hài lòng) - 5 (Rất hài lòng), được không ạ?"
        }];
      });
    }, 3 * 60 * 1000); // 3 phút = 180000 ms

    return () => clearTimeout(timeoutId);
  }, [messages, isOpen]);

  if (!isOpen) return null

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra')
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: data.reply
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error: any) {
      console.error(error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Xin lỗi, LEO đang gặp chút sự cố kết nối. Quý khách vui lòng thử lại sau nhé! (" + error.message + ")"
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[380px] max-w-[calc(100vw-2rem)] flex flex-col bg-white rounded-t-xl rounded-b-md shadow-2xl border border-gray-200 overflow-hidden sm:bottom-0 sm:right-6 sm:h-[600px] max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#165a72] px-4 py-3 text-white shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-yellow-400" />
          <h3 className="font-bold text-[15px] tracking-wide">LS Airlines</h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white hover:text-cyan-200 transition-colors">
            <ExternalLink className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="text-white hover:text-cyan-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col gap-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          // Check if previous message was also from bot to avoid repeating avatar
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const showAvatar = !isUser && (prevMsg?.role !== "bot");

          return (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full gap-2",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              {!isUser && (
                <div className="w-8 shrink-0 flex items-end pb-1">
                  {showAvatar ? (
                    <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-[#165a72]">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7" /> // Spacer
                  )}
                </div>
              )}

              <div className={cn(
                "max-w-[85%] px-4 py-3 text-[14px] leading-relaxed relative",
                isUser 
                  ? "bg-[#1c6478] text-white rounded-2xl rounded-tr-sm" 
                  : "bg-[#f0f4f5] text-[#1c6478] rounded-2xl rounded-tl-sm font-medium"
              )}>
                {msg.text}
              </div>
            </div>
          )
        })}
        {isTyping && (
           <div className="flex w-full gap-2 justify-start">
             <div className="w-8 shrink-0 flex items-end pb-1">
                <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-[#165a72]">
                  <Bot className="w-4 h-4" />
                </div>
             </div>
             <div className="bg-[#f0f4f5] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center">
               <div className="flex gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#1c6478] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-[#1c6478] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-[#1c6478] animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-2">
          <button className="text-gray-300 hover:text-gray-500 transition-colors p-1 shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              placeholder="Nhập câu hỏi của Quý khách tại đây"
              className="w-full bg-white border border-gray-200 text-sm text-gray-800 rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-gray-300 shadow-sm placeholder:text-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-300 disabled:opacity-50 transition-colors hover:text-[#1c6478]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Footer text */}
        <div className="text-center text-[11px] text-gray-500">
          LEO có thể sai sót, hãy kiểm tra thông tin quan trọng.{" "}
          <a href="#" className="text-[#0ea5e9] hover:underline">Điều khoản sử dụng</a>
        </div>
      </div>
    </div>
  )
}
