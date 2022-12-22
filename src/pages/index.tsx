import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Navbar from "../components/navbar/Navbar";
import Note from "../components/note/Note";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { useEffect, useState } from "react";
import AddNote from "../components/note/AddNote";
import type { Note as NoteModel } from "@prisma/client";
import { Transition } from "@headlessui/react";
import { AddIcon } from "@chakra-ui/icons";
import useFilteredNotes from "../hooks/useFilteredNotes";
import FilterNotes from "../components/note/FilterNotes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

const Home: NextPage = () => {
  const items = trpc.note.getItems.useQuery();
  const [openModal, setOpenModal] = useState(false);
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showItems, setShowItems] = useState(false);
  const filter = useFilteredNotes(notes);
  const { filteredNotes } = filter;

  useEffect(() => {
    if (items.data) {
      setShowItems(false);
      setNotes(items.data);
      setShowItems(true);
    }
  }, [items.data]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex h-auto w-full flex-col">
        <div className="flex h-min w-full items-center justify-between p-2">
          <div className="flex items-center justify-start">
            <h1 className="text-4xl font-bold">Notes</h1>
          </div>
          <div className="flex items-center justify-end">
            <button
              className="flex items-center gap-2 rounded-lg bg-purple-400 p-2 text-sm transition-all hover:bg-purple-500"
              onClick={() => setOpenModal(true)}
            >
              Add Note <AddIcon />
            </button>
          </div>
        </div>
        <FilterNotes useFilteredNotes={filter} setShowItems={setShowItems} />
        <AddNote
          openModal={openModal}
          setOpenModal={setOpenModal}
          setNotes={setNotes}
        />
        {items.isLoading && <div className="p-2">Loading...</div>}
        {notes.length === 0 && !items.isInitialLoading ? (
          <div className="p-2">No notes found</div>
        ) : (
          <Transition
            as="div"
            appear={true}
            show={showItems}
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-300"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className="flex flex-col items-center justify-center space-y-4 p-2 transition-all md:grid md:grid-cols-3 md:gap-4 md:space-y-0 lg:grid-cols-5"
          >
            {filteredNotes.map((item) => (
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
                <Note
                  item={item}
                  refetch={items.refetch}
                  setNotes={setNotes}
                  notes={notes}
                />
              </Transition.Child>
            ))}
          </Transition>
        )}
      </div>
    </>
  );
};

export default Home;
