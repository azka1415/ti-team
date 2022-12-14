import { Dialog, Transition } from "@headlessui/react";
import type { Note } from "@prisma/client";
import { Fragment, useState } from "react";
import { trpc } from "../../utils/trpc";
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  SpinnerIcon,
} from "@chakra-ui/icons";

interface Props {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  note: Note;
  handleCheck: ReturnType<typeof trpc.note.checkItem.useMutation>;
  handleDelete: ReturnType<typeof trpc.note.deleteItem.useMutation>;
  refetch: () => void;
  setDeleted: (value: boolean) => void;
}

export default function NoteModal({
  openModal,
  setOpenModal,
  note,
  handleCheck,
  handleDelete,
  refetch,
  setDeleted,
}: Props) {
  const [newTitle, setNewTitle] = useState(note.name);
  const [newBody, setNewBody] = useState(String(note.body));
  const editNote = trpc.note.editItem.useMutation();

  const checkItem = () => {
    handleCheck.mutate(
      {
        check: !note.checked,
        text: note.id,
      },
      {
        onSuccess() {
          refetch();
        },
      }
    );
  };

  const deleteItem = () => {
    setDeleted(false);
    handleDelete.mutate(
      {
        text: note.id,
      },
      {
        onSuccess() {
          refetch();
        },
      }
    );
  };

  const handleSave = () => {
    if (newTitle === "") {
      alert("Please Fill The Title");
      return;
    }

    editNote.mutate(
      {
        text: note.id,
        newName: newTitle,
        newBody: newBody,
      },
      {
        onSuccess() {
          refetch();
        },
      }
    );

    return;
  };

  return (
    <>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => setOpenModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 h-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex w-full max-w-md transform flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="break-all p-2 text-center text-lg font-bold text-gray-900"
                  >
                    <p>Edit Note</p>
                    {editNote.isLoading && (
                      <SpinnerIcon className="animate-spin" />
                    )}
                  </Dialog.Title>
                  {handleCheck.isLoading && (
                    <SpinnerIcon className="animate-spin" />
                  )}
                  <div className="flex w-full flex-col items-center justify-start">
                    <div className="flex flex-col items-center justify-center space-y-2 p-2">
                      <input
                        type="text"
                        value={newTitle}
                        className={`rounded-lg bg-blue-200 p-2 ${
                          note.checked && "line-through"
                        }`}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <div className="flex w-full items-center justify-evenly">
                        <Transition
                          show={newTitle !== ""}
                          enter="transition ease-in duration-200"
                          enterFrom="transform opacity-0 -translate-x-5"
                          enterTo="transform opacity-100 -translate-x-0"
                          leave="transition ease-out duration-100"
                          leaveFrom="transform opacity-100"
                          leaveTo="transform opacity-0 -translate-x-5"
                        >
                          <button
                            className="rounded-lg bg-amber-500 p-2 transition-all hover:bg-amber-600"
                            onClick={() => setNewTitle("")}
                          >
                            Clear
                          </button>
                        </Transition>
                        <Transition
                          show={newTitle !== note.name}
                          enter="transition ease-in duration-200"
                          enterFrom="transform opacity-0 translate-y-5"
                          enterTo="transform opacity-100 translate-y-0"
                          leave="transition ease-out duration-100"
                          leaveFrom="transform opacity-100"
                          leaveTo="transform opacity-0 translate-y-5"
                        >
                          <button
                            className="rounded-lg bg-fuchsia-500 p-2 transition-all hover:bg-fuchsia-600"
                            onClick={() => setNewTitle(note.name)}
                          >
                            Reset
                          </button>
                        </Transition>
                      </div>
                      <div className="flex flex-col space-y-2 rounded-lg bg-blue-200 p-2">
                        <textarea
                          value={newBody}
                          onChange={(e) => setNewBody(e.target.value)}
                          className="rounded-lg bg-blue-200 p-2"
                          cols={30}
                          rows={10}
                        />
                        <div className="flex w-full items-center justify-evenly">
                          <Transition
                            show={newBody !== ""}
                            enter="transition ease-in duration-200"
                            enterFrom="transform opacity-0 -translate-x-5"
                            enterTo="transform opacity-100 -translate-x-0"
                            leave="transition ease-out duration-150"
                            leaveFrom="transform opacity-100"
                            leaveTo="transform opacity-0 -translate-x-10"
                          >
                            <button
                              className="rounded-lg bg-amber-500 p-2 transition-all hover:bg-amber-600"
                              onClick={() => setNewBody("")}
                            >
                              Clear
                            </button>
                          </Transition>
                          <Transition
                            show={newBody !== String(note.body)}
                            enter="transition ease-in duration-200"
                            enterFrom="transform opacity-0 translate-y-5"
                            enterTo="transform opacity-100 translate-y-0"
                            leave="transition ease-out duration-150"
                            leaveFrom="transform opacity-100"
                            leaveTo="transform opacity-0 translate-y-10"
                          >
                            <button
                              className="rounded-lg bg-fuchsia-500 p-2 transition-all hover:bg-fuchsia-600"
                              onClick={() => setNewBody(String(note.body))}
                            >
                              Reset
                            </button>
                          </Transition>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-4">
                        <button
                          className="flex w-fit items-center justify-center rounded-lg bg-green-500 p-2 transition-all hover:bg-green-600"
                          onClick={checkItem}
                        >
                          {note.checked ? "Uncheck" : <CheckIcon />}
                        </button>
                        <button
                          className="flex w-fit items-center justify-center rounded-lg bg-red-500 p-2 transition-all hover:bg-red-600"
                          onClick={deleteItem}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <button
                          className="flex w-fit items-center justify-center rounded-lg bg-red-500 p-2 transition-all hover:bg-red-600"
                          onClick={() => setOpenModal(false)}
                        >
                          <CloseIcon />
                        </button>
                        <button
                          className="rounded-lg bg-emerald-500 p-2 transition-all hover:bg-emerald-600"
                          onClick={() => handleSave()}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
