"use client";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { usePathname } from "next/navigation";

function SideBarOption({ href, id }: { href: string; id: string }) {
    const data1 = useDocumentData(doc(db, "documents", id));
    const data = data1[0]
    const loading = data1[1]
    const pathname = usePathname()
    const isActive = href.includes(pathname) && pathname !== '/'
    
    if (!data) return null;

    return (
        <Link href={href} className={`border p-2 rounded-md ${isActive ? "bg-gray-300 font-semibold border-gray-500" : "border-gray-400"}`}>
            <p className="truncate">{!loading && data?.title}</p>
        </Link>
    );
}

export default SideBarOption;
