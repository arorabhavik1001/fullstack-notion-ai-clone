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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner"
import Markdown from 'react-markdown'
  

type Language =
  | "english"
  | "spanish"
  | "portugese"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "russian"
  | "japanese";

const languages: Language[] = [
  "english",
  "spanish",
  "portugese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
];

function TranslateDoc({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition()
  const [summary, setSummary] = useState("")
  const [language, setLanguage] = useState<string>('')

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (language != "") {
        startTransition( async () => {
            const documentData = doc.get("document-store").toJSON()
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`, { 
                   method: "POST",
                   headers: {
                    "Content-Type": "application/json"
                   },
                   body: JSON.stringify({
                    documentData,
                    targetLanguage: language
                   })
                }
            )
    
            if(res.ok) {
                const { translatedText } = await res.json()
                setSummary(translatedText)
                toast.success("Summary translated successfully!")
            } else {
                toast.error("There was some error translating document.")
            }
        })
    } else {
        toast.error("Please select a language.")
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger><LanguagesIcon />Translate</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the Document</DialogTitle>
          <DialogDescription>
            Select a language and AI will translate a summary of the document in selected language.
          </DialogDescription>
          <hr className="mt-5" />
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
                    <p>{isPending?"Thinking...":<Markdown>{summary}</Markdown>}</p>
                </div>
            )
        }

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Select value={language} onValueChange={(value)=>setLanguage(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map((lan)=> (
                    <SelectItem key={lan} value={lan}>
                        {lan.charAt(0).toUpperCase()+lan.slice(1)}
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TranslateDoc;
