import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Navbar from "../components/navbar/Navbar";
import Note from "../components/note/Note";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { useState } from "react";
import AddNote from "../components/note/AddNote";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }

}

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const items = trpc.note.getItems.useQuery();
  const [openModal, setOpenModal] = useState(false)


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex flex-col h-full w-full bg-inherit">
        <div className="flex w-full h-min p-2 justify-between items-center">
          <h1 className="text-4xl font-bold">Notes</h1>
          <button className="bg-purple-400 p-2 rounded-lg text-sm transition-all hover:bg-purple-500" onClick={() => setOpenModal(true)}>Add Note</button>
        </div>
        <AddNote openModal={openModal} refetch={items.refetch} session={session} setOpenModal={setOpenModal} />
        <div className="flex flex-col space-y-4 justify-center items-center transition-all md:grid md:grid-cols-3 lg:grid-cols-5 md:space-y-0 md:gap-4 p-2">
          {items.isLoading && <div>Loading...</div>}
          {items.data?.length === 0 && <div>No notes found</div>}
          {items.data?.sort((a, b) => {
            const one = new Date(b.updatedAt).getTime()
            const two = new Date(a.updatedAt).getTime()
            return one - two
          }).map((item) => (
            <Note key={item.id} item={item} refetch={items.refetch} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

