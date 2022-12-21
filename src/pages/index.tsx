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
import { AddIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import useFilteredNotes from "../hooks/useFilteredNotes";

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
  const { data: session } = useSession();
  const items = trpc.note.getItems.useQuery();
  const [openModal, setOpenModal] = useState(false);
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showItems, setShowItems] = useState(false);
  const {
    query,
    found,
    completed,
    uncompleted,
    filteredNotes,
    filteredNotFound,
    setQuery,
    handleNoteFilter,
  } = useFilteredNotes(notes);

  useEffect(() => {
    if (items.data) {
      setShowItems(false);
      setNotes(items.data);
      setShowItems(true);
    }
    if (!found) {
      setShowItems(false);
    }
  }, [items.data, found]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
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
        <div className="flex w-full flex-col items-center justify-center space-y-1 px-2 md:flex-row md:justify-start md:space-x-2 md:space-y-0">
          <div className="flex h-fit w-fit items-center justify-center rounded-lg bg-gray-200 pr-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="search"
              className="rounded-lg bg-gray-200 p-2 text-sm outline-none transition-all"
              autoComplete="off"
              placeholder="Search Notes"
            />

            <SearchIcon
              className={`flex items-center justify-center ${
                query.length === 0 ? "visible" : "collapse"
              }`}
            />

            <button
              className={`flex items-center justify-center ${
                query.length !== 0 ? "visible" : "hidden"
              }`}
              onClick={() => setQuery("")}
            >
              <CloseIcon className="flex w-2" />
            </button>
          </div>
          <div className="flex gap-2 rounded-lg border p-2">
            <label htmlFor="check" className="text-sm">
              Show Completed Notes
            </label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => handleNoteFilter(e)}
              id="checked_only"
              className="rounded-lg bg-gray-200 p-2 text-sm outline-none transition-all"
            />
          </div>
          <div className="flex space-x-2 rounded-lg border p-2">
            <label htmlFor="check" className="text-sm">
              Show Uncompleted Notes
            </label>
            <input
              type="checkbox"
              checked={uncompleted}
              onChange={(e) => handleNoteFilter(e)}
              id="unchecked_only"
              className="rounded-lg bg-gray-200 p-2 text-sm outline-none transition-all"
            />
          </div>
          <Transition
            show={!found || filteredNotFound}
            appear={true}
            enter="transition ease-out duration-300"
            enterFrom="transform translate-y-4"
            enterTo="transform translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="transform translate-y-0"
            leaveTo="transform translate-y-4"
          >
            <div className="flex flex-col items-center justify-center divide-y divide-black md:flex-row md:divide-x md:divide-y-0">
              {!found && <p className="px-1">No Notes Found</p>}
              {filteredNotFound && (
                <p className="px-1">No Notes Found With That Filter</p>
              )}
            </div>
          </Transition>
        </div>
        <AddNote
          openModal={openModal}
          refetch={items.refetch}
          session={session}
          setOpenModal={setOpenModal}
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
                appear={showItems}
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
