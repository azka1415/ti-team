import { Transition } from "@headlessui/react"
import { Note } from "@prisma/client"
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState } from "react"
import { trpc } from "../../utils/trpc"
import NoteModal from "./NoteModal"
import { CheckIcon, DeleteIcon, EditIcon, SpinnerIcon } from "@chakra-ui/icons";
interface Props {
    item: Note,
    refetch: () => void
    setNotes: Dispatch<SetStateAction<Note[]>>
    notes: Note[]
}

const Note = ({ item, refetch, setNotes, notes }: Props) => {

    const handleCheck = trpc.note.checkItem.useMutation()
    const handleDelete = trpc.note.deleteItem.useMutation()
    const [deleted, setDeleted] = useState(true)
    const [openModal, setOpenModal] = useState(false)

    const checkItem = async () => {
        handleCheck.mutateAsync({
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
        setTimeout(() => {
            setNotes(notes.filter(note => note.id !== item.id))
        }, 500)


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
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-8"

        >

            <div className="flex flex-col w-full p-2 shadow-2xl rounded-lg bg-gray-100">
                <div className="flex flex-col space-y-2 p-2 text-start rounded-lg max-h-96">
                    <div className="flex h-fit space-x-2 w-full items-center justify-start">
                        <p className={`text-xl font-semibold break-all ${item.checked ? 'line-through' : ''}`}>
                            {item.name}
                        </p>
                        <EditIcon className={`${handleCheck.isLoading ? 'collapse' : 'visible'} cursor-pointer`}
                            onClick={() => setOpenModal(true)} />
                        <div className="flex justify-end items-center">
                            {handleCheck.isLoading && (
                                <SpinnerIcon className="animate-spin" />
                            )}
                        </div>


                    </div>
                    <div className="w-min flex space-x-2 items-center">

                    </div>
                    <hr />
                    {openModal &&
                        <NoteModal openModal={openModal} setOpenModal={setOpenModal} note={item} handleCheck={handleCheck} handleDelete={handleDelete} refetch={refetch} setDeleted={setDeleted} />}
                    <div className="relative flex h-full overflow-hidden overflow-ellipsis">

                        <div className="flex flex-col h-full rounded-lg p-2">
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
                            <button className="flex items-center justify-center bg-green-500 p-2 rounded-lg w-fit transition-all hover:bg-green-600" onClick={checkItem}>{item.checked ? 'Uncheck' : <CheckIcon />}</button>
                            <button className="flex items-center justify-center bg-red-500 p-2 rounded-lg w-fit transition-all hover:bg-red-600" onClick={deleteItem}><DeleteIcon /></button>
                        </div>
                    </div>

                </div>
            </div >
        </Transition >
    )
}

export default Note