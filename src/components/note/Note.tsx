import { Transition } from "@headlessui/react";
import { Note } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState } from "react";
import { trpc } from "../../utils/trpc";
import NoteModal from "./NoteModal";
import { CheckIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
interface Props {
  item: Note;
  refetch: () => void;
  setNotes: Dispatch<SetStateAction<Note[]>>;
  notes: Note[];
}

const Note = ({ item, refetch, setNotes, notes }: Props) => {
  const handleCheck = trpc.note.checkItem.useMutation();
  const handleDelete = trpc.note.deleteItem.useMutation();
  const [deleted, setDeleted] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const checkItem = async () => {
    setDeleted(false);
    setNotes(
      notes.map((note) => {
        if (note.id === item.id) {
          return {
            ...note,
            checked: !note.checked,
            updatedAt: new Date(),
          };
        }
        return note;
      })
    );
    setTimeout(() => {
      setDeleted(true);
    }, 500);

    handleCheck.mutate({
      check: !item.checked,
      text: item.id,
    });
  };

  const deleteItem = async () => {
    setDeleted(false);
    setTimeout(() => {
      setNotes(notes.filter((note) => note.id !== item.id));
    }, 300);

    handleDelete.mutate({
      text: item.id,
    });
  };

  return (
    <Transition
      as={Fragment}
      show={deleted}
      enter="transition ease-in-out duration-200"
      enterFrom="opacity-0 -translate-x-8"
      enterTo="opacity-100 -translate-x-0"
      leave="transition ease-in-out duration-200"
      leaveFrom="opacity-100 -translate-x-0"
      leaveTo="opacity-0 -translate-x-8"
    >
      <div className="flex w-full flex-col rounded-lg border-2 border-gray-300 bg-gradient-to-b from-blue-400 to-blue-600 p-2 shadow-2xl">
        <div className="flex max-h-96 flex-col space-y-2 rounded-lg p-2 text-start">
          <div className="flex h-fit w-full items-center justify-start space-x-2">
            <p
              className={`break-all text-xl font-semibold ${
                item.checked ? "line-through" : ""
              }`}
            >
              {item.name}
            </p>
            <EditIcon
              className={`${
                handleCheck.isLoading ? "collapse" : "visible"
              } cursor-pointer`}
              onClick={() => setOpenModal(true)}
            />
          </div>
          <div className="flex w-min items-center space-x-2"></div>
          <hr />
          {openModal && (
            <NoteModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              note={item}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              refetch={refetch}
              setDeleted={setDeleted}
            />
          )}
          <div className="relative flex h-full overflow-hidden overflow-ellipsis">
            <div className="flex h-full flex-col rounded-lg p-2">
              <p className="break-all">{item.body}</p>
            </div>
          </div>
          <div className="my-auto flex h-min items-center justify-center space-x-2">
            <div className="flex h-full w-full items-center justify-start">
              <p>{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-end space-x-4">
              <button
                className="flex w-fit items-center justify-center rounded-lg bg-green-500 p-2 transition-all hover:bg-green-600"
                onClick={checkItem}
              >
                {item.checked ? "Uncheck" : <CheckIcon />}
              </button>
              <button
                className="flex w-fit items-center justify-center rounded-lg bg-red-500 p-2 transition-all hover:bg-red-600"
                onClick={deleteItem}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Note;
