import { IronLadyChatbot } from "@/components/iron-lady-chatbot"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8">
        <IronLadyChatbot />
      </div>
    </main>
  )
}
