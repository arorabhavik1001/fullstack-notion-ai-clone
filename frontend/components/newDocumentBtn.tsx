"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { createNewDocument } from "../actions/actions";

function NewDocumentButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleCreateNew = () => {
    startTransition(async () => {
        const {docId} = await createNewDocument();
        router.push(`/doc/${docId}`)
    })
  };

  return (
    <div>
      <Button onClick={handleCreateNew} disabled={isPending}>{isPending?"Creating...":"New Document"}</Button>
    </div>
  );
}

export default NewDocumentButton;
