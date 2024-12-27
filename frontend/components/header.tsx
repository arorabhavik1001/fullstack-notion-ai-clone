'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { useUser } from "@clerk/nextjs"
import Breadcrumbs from "./breadcrumbs"
import Image from "next/image"
import logo from '../public/notion_bhavik.png';

function Header() {
  const { user } = useUser()
  return (
    <>
      {user!==null?(
         <div className="flex items-center justify-between p-5">
         {
           user && (
             <h1 className="text-2xl">{user?.firstName}{`'s`} Space</h1>
           )
         }
   
         <div className="hidden md:inline">
          <Breadcrumbs />
         </div>
   
         <div>
           <SignedOut>
             <SignInButton></SignInButton>
           </SignedOut>
           <SignedIn>
             <UserButton />
           </SignedIn>
         </div>
       </div>
      ):(
        <div className="fullscreen-div"> 
          <Image className="mb-5" src={logo} width={200} height={200} alt="logo" />
          <SignInButton></SignInButton>
        </div>
      )}
    
    </>
   
  )
}

export default Header