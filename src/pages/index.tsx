import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Navbar from "../components/navbar/Navbar";
import Note from "../components/note/Note";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { Fragment, useEffect, useState } from "react";
import AddNote from "../components/note/AddNote";
import type { Note as NoteModel } from "@prisma/client";
import { Transition } from "@headlessui/react";


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
  const { data: session } = useSession();
  const items = trpc.note.getItems.useQuery();
  const [openModal, setOpenModal] = useState(false)
  const [notes, setNotes] = useState<NoteModel[]>([])
  const [showItems, setShowItems] = useState(false)
  const [sort, setSort] = useState('desc' as 'desc' | 'asc')

  useEffect(() => {
    if (items.data?.length === 0) {
      return
    }
    if (items.data) {
      setShowItems(false)
      setNotes(items.data)
      setShowItems(true)
    }
  }, [items.data])


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
        {items.isLoading && <div>Loading...</div>}
        <Transition as='div'
          appear={true}
          show={showItems}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          className="flex flex-col space-y-4 justify-center items-center transition-all md:grid md:grid-cols-3 lg:grid-cols-5 md:space-y-0 md:gap-4 p-2">
          {notes.length === 0 ? (<div>No notes found</div>) : notes.sort((a, b) => {
            if (sort === 'desc') {
              const one = new Date(b.updatedAt).getTime()
              const two = new Date(a.updatedAt).getTime()
              return one - two
            } else {
              const one = new Date(a.updatedAt).getTime()
              const two = new Date(b.updatedAt).getTime()
              return one - two
            }
          }).map((item) => (
            <Transition.Child
              key={item.id}
              appear={true}
              enter="transition ease-out duration-300"
              enterFrom="transform scale-100 -translate-x-8"
              enterTo="transform scale-100 -translate-x-0"
              leave="transform duration-200 transition ease-in-out"
              leaveFrom="opacity-100 rotate-0 scale-100"
              leaveTo="opacity-0 scale-75 transform -translate-x-[4rem]"
            >
              <Note item={item} refetch={items.refetch} setNotes={setNotes} notes={notes} />
            </Transition.Child>
          ))}
        </Transition>
      </div>
    </>
  );
};

export default Home;

