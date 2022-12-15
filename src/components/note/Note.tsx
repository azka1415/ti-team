import { Transition } from "@headlessui/react"
import type { Note } from "@prisma/client"
import { Fragment, useState } from "react"
import { trpc } from "../../utils/trpc"
import NoteModal from "./NoteModal"

interface Props {
    item: Note,
    refetch: () => void
}

export default function Note({ item, refetch }: Props) {

    const handleCheck = trpc.note.checkItem.useMutation()
    const handleDelete = trpc.note.deleteItem.useMutation()
    const [deleted, setDeleted] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const checkItem = async () => {
        handleCheck.mutate({
            check: !item.checked,
            text: item.id
        }, {
            onSuccess() {
                refetch()
            },
        })
    }

    const deleteItem = async () => {
        setDeleted(false)
        handleDelete.mutate({
            text: item.id
        }, {
            onSuccess() {
                refetch()
            },
        })
    }



    return (
        <Transition
            as={Fragment}
            show={deleted}
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 rotate-0 scale-100"
            leaveTo="opacity-0 scale-75 transform -translate-x-[4rem]"
        >
            <Transition>

                <div className="flex flex-col w-full p-2 shadow-2xl rounded-lg bg-gray-100">
                    <div className="flex flex-col space-y-2 p-2 text-start rounded-lg max-h-96">
                        <div className="flex h-fit">

                            <p className={`text-xl font-semibold break-all ${item.checked ? 'line-through' : ''}`}>
                                {item.name}
                            </p>
                        </div>
                        <div className="w-min flex space-x-2 items-center">
                            {handleCheck.isLoading && <div>Updating...</div>}
                        </div>
                        <hr />
                        {openModal &&
                            <NoteModal openModal={openModal} setOpenModal={setOpenModal} note={item} handleCheck={handleCheck} handleDelete={handleDelete} refetch={refetch} setDeleted={setDeleted} />}
                        <div className="relative flex h-full overflow-hidden overflow-ellipsis cursor-pointer" onClick={() => setOpenModal(true)}>
                            <div className="absolute flex justify-center p-2 items-center w-full h-full text-white opacity-0 rounded-lg transition-all hover:bg-gray-600 hover:opacity-75">
                                <div className="bg-white p-2 rounded-lg">

                                    <p className="rounded-lg p-2 bg-black text-white">
                                        View and Edit
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col h-full rounded-lg p-2 hover:text-white">
                                <p className="break-all">{item.body}</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center h-min space-x-2 my-auto">
                            <div className="flex justify-start items-center w-full h-full">
                                <p>
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex justify-end items-center space-x-4">
                                <button className="bg-green-500 p-2 rounded-lg transition-all hover:bg-green-600" onClick={checkItem}>{item.checked ? 'Uncheck' : 'Check'}</button>
                                <button className="bg-red-500 p-2 rounded-lg transition-all hover:bg-red-600" onClick={deleteItem}>Delete</button>
                            </div>
                        </div>

                    </div>
                </div>
            </Transition>
        </Transition >
    )
}
