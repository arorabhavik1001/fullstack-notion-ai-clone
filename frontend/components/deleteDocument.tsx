'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { Button } from "./ui/button"
import { useRoom } from "@liveblocks/react/suspense"
import { useRouter } from "next/navigation"
import { deleteDocument } from "../actions/actions"
import { toast } from "sonner"

  
function DeleteDocument() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const {id} = useRoom()
    const router = useRouter()

    const handleDelete = async () => {
        if (!id) return;

        startTransition(async () => {
            const {success} = await deleteDocument(id)

            if (success) {
                setIsOpen(false)
                router.replace('/')
                toast.success("Room Deleted successfully!")
            } else {
                toast.success("There was some error deleting the Room.")
            }
        })
    }

    return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="destructive">
            <DialogTrigger>Delete</DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure you want to Delete?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete the document and all its contents.
            </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2">
                <Button 
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    {isPending ? "Deleting...": "Delete"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

  )
}

export default DeleteDocument