import Landing from "../../Containers/Home";
// import { useUser } from "@clerk/nextjs"

export default function Home() {
  // const {user} = useUser()
  
  return (
    <>
          <Landing />
      {/* {user!==null?(
        <>
        </>
      ):(
        "Sign in kar saale"
      )} */}
    </>
  );
}
