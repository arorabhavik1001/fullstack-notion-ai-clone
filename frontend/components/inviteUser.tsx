'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { useRoom } from "@liveblocks/react/suspense"
import { inviteUser } from "../actions/actions"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

  
function InviteUser() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [email, setEmail] = useState("")
    const {id} = useRoom()

    const handleInvite = async (e: FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            if (!id) return;

            const {success} = await inviteUser(id, email)

            if (success) {
                setIsOpen(false)
                setEmail("")
                toast.success("User invited successfully!")
            } else {
                toast.success("There was some error inviting the user.")
            }
        })
    }

    return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline">
            <DialogTrigger>Invite</DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Invite a User to Collaborate!</DialogTitle>
            <DialogDescription>
                Enter the email of the user you want to invite.
            </DialogDescription>
            </DialogHeader>
            
            <form className="flex gap-2" onSubmit={handleInvite}>
                <Input value={email} type="email" placeholder="Email" className="w-full" onChange={(e)=>setEmail(e.target.value)} />
                <Button type="submit" disabled={!email || isPending}>{isPending?"Inviting...":"Invite"}</Button>
            </form>
        </DialogContent>
    </Dialog>

  )
}

export default InviteUser