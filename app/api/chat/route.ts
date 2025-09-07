import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI (you'll need to add GEMINI_API_KEY to your environment variables)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { message, faqContext } = await request.json()

    // If no API key is provided, return a fallback response
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response:
          "I'm currently running in FAQ mode. Please ask me about Iron Lady's programs, duration, format, certificates, or mentors for detailed information!",
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
You are an AI assistant for Iron Lady Leadership Programs. Use the following FAQ knowledge base to answer user questions accurately and helpfully.

FAQ Knowledge Base:
${JSON.stringify(faqContext, null, 2)}

User Question: ${message}

Instructions:
- Provide accurate, helpful responses based on the FAQ knowledge base
- If the question is not covered in the FAQ, politely redirect to available topics
- Be professional, encouraging, and supportive
- Keep responses concise but informative
- Always maintain a positive tone about Iron Lady's programs

Response:
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error calling Gemini API:", error)

    // Fallback response if API fails
    return NextResponse.json({
      response:
        "I'm here to help you learn about Iron Lady's leadership programs! You can ask me about our programs, duration, format (online/offline), certificates, mentors, costs, application process, or support services.",
    })
  }
}
