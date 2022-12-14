import { Transition } from "@headlessui/react"
import type { Note } from "@prisma/client"
import { Fragment, useState } from "react"
import { trpc } from "../../utils/trpc"

interface Props {
    item: Note,
    refetch: () => void
}

export default function Note({ item, refetch }: Props) {

    const handleCheck = trpc.note.checkItem.useMutation()
    const handleDelete = trpc.note.deleteItem.useMutation()
    const [deleted, setDeleted] = useState(true)
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
            leaveTo="opacity-0 scale-95 transform -translate-x-[4rem]"

        >

            <div className="flex flex-col w-full p-2 shadow-2xl rounded-lg bg-gray-100">
                <div className="flex flex-col space-y-2 p-2 text-start rounded-lg h-80 ">
                    <p className={`text-xl font-semibold break-all ${item.checked ? 'line-through' : ''}`}>
                        {item.name}
                    </p>
                    <div className="w-min flex space-x-2 items-center">
                        {handleCheck.isLoading && <div>Updating...</div>}
                    </div>
                    <hr />
                    <div className="overflow-auto h-full ">
                        <p className="break-all">{item.body}</p>
                    </div>
                    <div className="flex justify-center items-end h-full space-x-2 my-auto">
                        <p>
                            {new Date(item.createdAt).toLocaleString()}
                        </p>
                        <div className="flex justify-end items-center space-x-4">
                            <button className="bg-green-500 p-2 rounded-lg transition-all hover:bg-green-600" onClick={checkItem}>{item.checked ? 'Uncheck' : 'Check'}</button>
                            <button className="bg-red-500 p-2 rounded-lg transition-all hover:bg-red-600" onClick={deleteItem}>Delete</button>
                        </div>
                    </div>

                </div>
            </div>
        </Transition >
    )
}
