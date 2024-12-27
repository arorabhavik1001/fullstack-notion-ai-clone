"use client";
import NewDocumentButton from "./newDocumentBtn";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import SideBarOption from "./sideBarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

function Sidebar() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  const data1 = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );

  const data = data1[0]

  useEffect(() => {
    if (!data) {
      return;
    } else {
      const grouped = data.docs.reduce<{
        owner: RoomDocument[];
        editor: RoomDocument[];
      }>(
        (acc, curr) => {
          const roomData = curr.data() as RoomDocument;
          if (roomData.role == "owner") {
            acc["owner"].push({
              id: curr.id,
              ...roomData,
            });
          } else {
            acc["editor"].push({
              id: curr.id,
              ...roomData,
            });
          }

          return acc;
        },
        {
          owner: [],
          editor: [],
        }
      );

      setGroupedData(grouped);
    }
  }, [data]);

  const menuOption = (
    <>
      <NewDocumentButton />
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {groupedData.owner.length > 0 ? (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        ) : (
          <h2 className="text-gray-500 font-semibold text-sm">
            No Documents Found.
          </h2>
        )}
      </div>

      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
      {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared with Me
            </h2>
            {groupedData.editor.map((doc) => (
              <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )
        }
        </div>
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <hr />
              <br />
              {menuOption}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOption}</div>
    </div>
  );
}

export default Sidebar;
