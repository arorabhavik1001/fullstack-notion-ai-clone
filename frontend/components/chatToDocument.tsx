"use client";
import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { BotIcon, MessageCircleCode } from "lucide-react";
import { toast } from "sonner"
import Markdown from 'react-markdown'
import { Input } from "@/components/ui/input";

function ChatToDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition()
  const [summary, setSummary] = useState("")
  const [question, setQuestion] = useState('')
  const [input, setInput] = useState('')

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input != "") {
        setQuestion(input)
        startTransition( async () => {
            const documentData = doc.get("document-store").toJSON()
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`, { 
                   method: "POST",
                   headers: {
                    "Content-Type": "application/json"
                   },
                   body: JSON.stringify({
                    documentData,
                    question: question
                   })
                }
            )
    
            if(res.ok) {
                const { summary } = await res.json()
                setSummary(summary)
                setInput("")
                toast.success("Summary translated successfully!")
            } else {
                toast.error("There was some error translating document.")
            }
        })
    } else {
        toast.error("Question cannot be blank.")
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger><MessageCircleCode />Chat to Document</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to the Document</DialogTitle>
          <DialogDescription>
            Ask a question and chat to the Document with AI.
          </DialogDescription>
          <hr className="mt-5" />

          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {
            summary && (
                <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
                    <div className="flex">
                        <BotIcon className="w-10 flex-shrink-0" />
                        <p className="font-bold">
                            GPT {isPending?"is thinking...":"Says:"}
                        </p>
                    </div>
                    <p>{!isPending&&(<Markdown>{summary}</Markdown>)}</p>
                </div>
            )
        }

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask anything" type="text" />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChatToDocument;
