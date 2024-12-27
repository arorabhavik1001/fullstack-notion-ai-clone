import LiveBlocksProvider from "../../../../components/liveblocksProvider";
import RoomProvider from "../../../../components/roomProvider";

function RoomLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <LiveBlocksProvider>
      <RoomProvider roomId={id}>
          {children}
      </RoomProvider>
    </LiveBlocksProvider>
  );
}

export default RoomLayout;
