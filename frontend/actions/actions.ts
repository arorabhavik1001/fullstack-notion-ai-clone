"use server"

import { auth } from "@clerk/nextjs/server"
import { adminDb } from "../firebase-admin"
import liveblocks from "@/lib/liveblocks"

export async function createNewDocument() {
    // auth().protect();

    const { sessionClaims } = await auth()
    
    const docCollectionRef = adminDb.collection('documents')
    const docRef = await docCollectionRef.add({
        title: "New Doc"
    })

    await adminDb.collection("users").doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email!,
        role: "owner",
        createAt: new Date(),
        roomId: docRef.id
    })

    return {docId: docRef.id}
}

export async function deleteDocument(roomId:any) {
    try {
        await adminDb.collection('documents').doc(roomId).delete()

        const query = await adminDb.collectionGroup('rooms').where("roomId", '==', roomId).get()
        const batch = adminDb.batch()
        query.docs.forEach((doc)=>{
            batch.delete(doc.ref)
        })
        
        await batch.commit()
        await liveblocks.deleteRoom(roomId)

        return { success: true }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}

export async function inviteUser(roomId:string, user:string) {
    try {
        await adminDb.collection('users').doc(user).collection('rooms').doc(roomId).set({
            userId: user,
            role: "editor",
            createdAt: new Date(),
            roomId,
        })

        return { success: true }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}

export async function removeUserFromDoc(roomId:string, user:string) {
    try {
        await adminDb.collection('users').doc(user).collection('rooms').doc(roomId).delete()
        return { success: true }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}