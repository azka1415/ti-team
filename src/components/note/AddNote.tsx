import { Dialog, Transition } from "@headlessui/react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useState } from "react";
import { Fragment } from "react";
import { trpc } from "../../utils/trpc";
import { CloseIcon, SpinnerIcon } from "@chakra-ui/icons";
import type { Note } from "@prisma/client";

interface Props {
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
  setNotes: Dispatch<SetStateAction<Note[]>>;
}

export default function AddNote({ setOpenModal, openModal, setNotes }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const handleAdd = trpc.note.addItem.useMutation();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAdd.mutate(
      {
        text: title,
        body,
      },
      {
        onSuccess(data) {
          setTitle("");
          setBody("");
          setNotes((prev) => [...prev, data]);
          setOpenModal(false);
        },
      }
    );
  };

  return (
    <>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex h-full w-full p-2 text-center md:items-center md:justify-center  lg:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-w-md flex w-full transform flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all md:h-min md:max-w-xl lg:max-w-2xl lg:py-2">
                  <Dialog.Title
                    as="h1"
                    className="text-center text-lg font-bold text-gray-900"
                  >
                    Add Note
                  </Dialog.Title>
                  {handleAdd.isLoading && (
                    <SpinnerIcon className="animate-spin" />
                  )}
                  <form
                    className="my-auto flex h-full w-fit flex-col items-center space-y-2 p-2 lg:space-y-4"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="flex flex-col">
                      <label htmlFor="Title">Title</label>
                      <input
                        type="text"
                        id="Title"
                        className="w-[20rem] rounded-lg bg-blue-200 p-2 md:h-[3rem]"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <label htmlFor="body">Body</label>
                    <textarea
                      id="body"
                      className="h-full w-[20rem] max-w-lg rounded-lg bg-blue-200 p-2 lg:h-[40rem] lg:w-[40rem]"
                      onChange={(e) => setBody(e.target.value)}
                    />
                    <div className="flex w-full items-center justify-between">
                      <button
                        type="button"
                        className="flex w-fit items-center justify-center rounded-lg bg-red-400 p-2 transition-all hover:bg-red-500"
                        onClick={() => setOpenModal(false)}
                      >
                        <CloseIcon />
                      </button>
                      <Transition
                        show={title.length > 0}
                        enter="transition ease-out duration-200"
                        enterFrom="transform translate-x-8"
                        enterTo="transform translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="transform translate-x-0"
                        leaveTo="transform translate-x-8"
                      >
                        <button
                          type="submit"
                          className={` rounded-lg bg-green-400 p-2 transition-all hover:bg-green-500`}
                        >
                          Submit
                        </button>
                      </Transition>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
