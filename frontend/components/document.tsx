"use client"

import { Input } from "@/components/ui/input"
import { FormEvent, useEffect, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"
import Editor from "./editor"
import useOwner from "@/lib/useOwner"
import DeleteDocument from "./deleteDocument"
import InviteUser from "./inviteUser"
import ManageUsers from "./manageUsers"
import { useOthers, useSelf } from "@liveblocks/react/suspense"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  

function Document({id}: {id: string}) {
    const data1 = useDocumentData(doc(db, 'documents', id))
    const data = data1[0]
    const [input, setInput] = useState("")
    const [isUpdating, startTransition] = useTransition()
    const isOwner = useOwner()
    const self = useSelf()
    const others = useOthers()

    const all = [self, ...others]

    useEffect(() => {
        if(data) {
            setInput(data.title)
        }
    }, [data])

    const updateTitle = (e: FormEvent) => {
        e.preventDefault()

        if (input.trim()) {
            startTransition(async() => {
                await updateDoc(doc(db, 'documents', id), {
                    title: input
                })
            })
        }
    }
  return (  
    <div className="flex-1 h-full bg-white p-5">
        <div className="flex max-w-6xl mx-auto justify-between pb-5">
            <form className="flex flex-1 space-x-2 flex-col sm:flex-row" onSubmit={updateTitle}>
                <div className="flex space-x-3 sm:w-full">
                    <Input value={input} className="bg-white" onChange={e=> setInput(e.target.value)} />
                    <Button disabled={isUpdating} type="submit">{isUpdating ? "Updating..." : "Update" }</Button>
                </div>

                {
                    isOwner && (
                        <div className="flex justify-end mt-3 sm:mt-0 space-x-3 ">
                            <InviteUser />
                            <DeleteDocument />
                        </div>
                    )
                }
            </form>
        </div>
        
        <div className="flex justify-between max-w-6xl mx-auto items-center mb-5">
            <ManageUsers />

            <div className="flex gap-2 items-center">
                <p className="font-light text-sm">Users on this page live</p>
                <div className="flex -space-x-5 ">
                    {all.map((curr, i)=> (
                        <TooltipProvider key={curr.id + i}>
                            <Tooltip>
                            <TooltipTrigger>
                                <Avatar className="border-2 hover:z-50">
                                    <AvatarImage src={curr?.info?.avatar} />
                                    <AvatarFallback>{curr?.info?.name}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{self.id==curr.id?"You":self?.info?.name}</p>
                            </TooltipContent>
                            </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
            </div>
        </div>

        <hr className="pb-10" />

        <Editor />
    </div>
  )
}

export default Document