"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles } from "lucide-react"
import faqData from "@/data/faq-knowledge-base.json"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const suggestedQuestions = [
  "What programs does Iron Lady offer?",
  "What is the program duration?",
  "Is the program online or offline?",
  "Are certificates provided?",
  "Who are the mentors/coaches?",
]

export function IronLadyChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Iron Lady Leadership Programs assistant. I can help you learn about our programs, duration, format, certificates, and mentors. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findRelevantAnswer = (question: string): string => {
    const allFAQs = [...faqData.ironLadyFAQ.programs, ...faqData.ironLadyFAQ.additionalInfo]

    // Simple keyword matching for FAQ lookup
    const keywords = question.toLowerCase()

    for (const faq of allFAQs) {
      const faqKeywords = faq.question.toLowerCase()
      if (
        keywords.includes("program") &&
        faqKeywords.includes("program") &&
        (keywords.includes("offer") || keywords.includes("what"))
      ) {
        return faq.answer
      }
      if (keywords.includes("duration") || keywords.includes("long") || keywords.includes("time")) {
        if (faqKeywords.includes("duration")) return faq.answer
      }
      if (
        (keywords.includes("online") || keywords.includes("offline") || keywords.includes("format")) &&
        faqKeywords.includes("online")
      ) {
        return faq.answer
      }
      if (
        (keywords.includes("certificate") || keywords.includes("certification")) &&
        faqKeywords.includes("certificate")
      ) {
        return faq.answer
      }
      if (
        (keywords.includes("mentor") || keywords.includes("coach") || keywords.includes("instructor")) &&
        (faqKeywords.includes("mentor") || faqKeywords.includes("coach"))
      ) {
        return faq.answer
      }
      if (
        (keywords.includes("cost") || keywords.includes("price") || keywords.includes("fee")) &&
        faqKeywords.includes("cost")
      ) {
        return faq.answer
      }
      if (
        (keywords.includes("apply") || keywords.includes("application") || keywords.includes("enroll")) &&
        faqKeywords.includes("apply")
      ) {
        return faq.answer
      }
      if ((keywords.includes("support") || keywords.includes("help")) && faqKeywords.includes("support")) {
        return faq.answer
      }
      if (
        (keywords.includes("prerequisite") || keywords.includes("requirement")) &&
        faqKeywords.includes("prerequisite")
      ) {
        return faq.answer
      }
    }

    return "I'd be happy to help you with information about Iron Lady's leadership programs! You can ask me about our programs, duration, format (online/offline), certificates, mentors, costs, application process, or support services. Feel free to ask any specific questions!"
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // First, try to find a direct FAQ match
      const faqAnswer = findRelevantAnswer(userMessage)

      // For now, we'll use the FAQ system since Gemini AI requires API key setup
      // In a real implementation, you would call the Gemini API here
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          faqContext: faqData.ironLadyFAQ,
        }),
      })

      if (!response.ok) {
        // Fallback to FAQ system if API fails
        return faqAnswer
      }

      const data = await response.json()
      return data.response || faqAnswer
    } catch (error) {
      console.error("Error generating AI response:", error)
      // Fallback to FAQ system
      return findRelevantAnswer(userMessage)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const botResponse = await generateAIResponse(userMessage.content)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try asking about our programs, duration, format, certificates, or mentors.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="h-[700px] flex flex-col shadow-xl border-0 bg-white dark:bg-gray-950">
        <CardHeader
          className="text-white rounded-t-lg border-b-0 py-6"
          style={{
            background: "linear-gradient(135deg, #9333ea 0%, #c026d3 50%, #ec4899 100%)",
            backgroundColor: "#9333ea",
          }}
        >
          <CardTitle className="flex items-center gap-3 text-white text-xl">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold">Iron Lady Chatbot</span>
            <Sparkles className="h-5 w-5 ml-auto text-white animate-pulse" />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"} ${
                      index === 0 ? "animate-in slide-in-from-bottom-4 duration-500" : ""
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full flex-shrink-0 shadow-lg">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] p-4 rounded-2xl break-words shadow-md transition-all duration-200 hover:shadow-lg ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white ml-auto rounded-br-md"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                      <span
                        className={`text-xs mt-2 block ${
                          message.sender === "user" ? "text-purple-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {message.sender === "user" && (
                      <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-3 rounded-full flex-shrink-0 shadow-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full flex-shrink-0 shadow-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-md shadow-md border border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>

          <div className="flex-shrink-0 p-6 border-t bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:border-purple-600 transition-all duration-200 text-xs py-2 px-3 rounded-full border-gray-300 dark:border-gray-600 hover:shadow-sm"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Iron Lady's leadership programs..."
                disabled={isLoading}
                className="flex-1 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-xl py-3 px-4 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 flex-shrink-0 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
