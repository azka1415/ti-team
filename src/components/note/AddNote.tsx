import { Dialog, Transition } from "@headlessui/react"
import type { Session } from "next-auth"
import type { FormEvent } from "react";
import { useState } from "react";
import { Fragment } from "react"
import { trpc } from "../../utils/trpc";

interface Props {
    session: Session | null
    refetch: () => void
    setOpenModal: (value: boolean) => void
    openModal: boolean
}

export default function AddNote({ setOpenModal, openModal, refetch }: Props) {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const handleAdd = trpc.note.addItem.useMutation()
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleAdd.mutate({
            text: title,
            body
        }, {
            onSuccess() {
                setTitle('')
                setBody('')
                refetch()
                setOpenModal(false)
            }
        })

    }



    return (
        <>
            <Transition appear show={openModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setOpenModal(false)}>
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
                                <Dialog.Panel className="w-full flex flex-col max-w-md transform overflow-hidden rounded-2xl bg-white p-6 justify-center items-center align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h1"
                                        className="text-lg font-bold text-center text-gray-900"
                                    >
                                        Add Note
                                    </Dialog.Title>
                                    {handleAdd.isLoading && <p>Creating...</p>}
                                    <form className="flex flex-col items-center space-y-2 p-2" onSubmit={(e) => handleSubmit(e)} >
                                        <label htmlFor="Title">Title</label>
                                        <input type="text" id="Title" className="bg-blue-200 rounded-lg p-2"
                                            onChange={e => setTitle(e.target.value)} />
                                        <label htmlFor="body">Body</label>
                                        <textarea id="body" cols={30} rows={10} className='bg-blue-200 rounded-lg p-2'
                                            onChange={e => setBody(e.target.value)} />
                                        <div className="w-full flex justify-between items-center">

                                            <button
                                                type="button"
                                                className="bg-red-400 p-2 rounded-lg transition-all hover:bg-red-500"
                                                onClick={() => setOpenModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className={`${title.length === 0 ? 'invisible' : 'visible'} bg-green-400 p-2 rounded-lg transition-all hover:bg-green-500`}>Submit</button>
                                        </div>
                                    </form>
                                    <div className="flex justify-start items-center w-full">

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
