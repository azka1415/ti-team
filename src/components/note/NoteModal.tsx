import { Dialog, Transition } from '@headlessui/react'
import type { Note } from '@prisma/client'
import { Fragment, useState } from 'react'
import { trpc } from '../../utils/trpc'


interface Props {
    openModal: boolean
    setOpenModal: (value: boolean) => void
    note: Note
    handleCheck: ReturnType<typeof trpc.note.checkItem.useMutation>
    handleDelete: ReturnType<typeof trpc.note.deleteItem.useMutation>
    refetch: () => void
    setDeleted: (value: boolean) => void
}

export default function NoteModal({ openModal, setOpenModal, note, handleCheck, handleDelete, refetch, setDeleted }: Props) {

    const [newTitle, setNewTitle] = useState(note.name)
    const [newBody, setNewBody] = useState(String(note.body))
    const [savedTitle, setSavedTitle] = useState(note.name)
    const [savedBody, setSavedBody] = useState(note.body)
    const [warning, setWarning] = useState(false)
    const editNote = trpc.note.editItem.useMutation()



    const checkItem = () => {
        handleCheck.mutate({
            check: !note.checked,
            text: note.id
        }, {
            onSuccess() {
                refetch()
            },
        })

    }

    const deleteItem = () => {
        setDeleted(false)
        handleDelete.mutate({
            text: note.id
        }, {
            onSuccess() {
                refetch()
            },
        })
    }

    const handleSave = () => {

        if (savedTitle === '') {
            alert('Please Fill The Title')
            return
        }

        if (note.name !== savedTitle || note.body !== savedBody) {
            editNote.mutate({
                text: note.id,
                newName: newTitle,
                newBody: newBody
            }, {
                onSuccess() {
                    refetch()
                },
            })

            setSavedTitle(newTitle)
            setSavedBody(newBody)
            return
        }
        alert('Please Change Something Before Submitting')

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
                                        className="text-lg font-bold text-center text-gray-900 break-all p-2"
                                    >
                                        Edit Note
                                    </Dialog.Title>
                                    {editNote.isLoading && <div>Changing...</div>}
                                    {handleCheck.isLoading && <div>Checking...</div>}
                                    <div className="flex flex-col justify-start items-center w-full">
                                        <div className='flex flex-col justify-center items-center p-2 space-y-2'>
                                            <input type="text" value={newTitle} className={`bg-blue-200 rounded-lg p-2 ${note.checked && 'line-through'}`} onChange={e => setNewTitle(e.target.value)} />
                                            <div className='flex w-full justify-evenly items-center'>
                                                <Transition
                                                    show={newTitle !== ''}
                                                    enter="transition ease-in duration-200"
                                                    enterFrom="transform opacity-0 -translate-x-5"
                                                    enterTo="transform opacity-100 -translate-x-0"
                                                    leave="transition ease-out duration-100"
                                                    leaveFrom="transform opacity-100"
                                                    leaveTo="transform opacity-0 -translate-x-5"
                                                >

                                                    <button className='bg-amber-500 p-2 rounded-lg transition-all hover:bg-amber-600'
                                                        onClick={() => setNewTitle('')}>Clear</button>
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

                                                    <button className='bg-fuchsia-500 p-2 rounded-lg transition-all hover:bg-fuchsia-600'
                                                        onClick={() => setNewTitle(note.name)}>
                                                        Reset
                                                    </button>
                                                </Transition>
                                                <Transition
                                                    show={newTitle !== savedTitle}
                                                    enter="transition ease-in duration-200"
                                                    enterFrom="transform opacity-0 translate-x-5"
                                                    enterTo="transform opacity-100 translate-x-0"
                                                    leave="transition ease-out duration-100"
                                                    leaveFrom="transform opacity-100"
                                                    leaveTo="transform opacity-0 translate-x-5"
                                                >

                                                    <button className='bg-blue-500 p-2 rounded-lg transition-all hover:bg-blue-600'
                                                        onClick={() => setSavedTitle(newTitle)}>Save</button>
                                                </Transition>
                                            </div>
                                            <div className='bg-blue-200 flex flex-col p-2 rounded-lg space-y-2'>

                                                <textarea value={newBody} onChange={e => setNewBody(e.target.value)} className='bg-blue-200 rounded-lg p-2' cols={30} rows={10} />
                                                <div className='flex w-full justify-evenly items-center'>
                                                    <Transition
                                                        show={newBody !== ''}
                                                        enter="transition ease-in duration-200"
                                                        enterFrom="transform opacity-0 -translate-x-5"
                                                        enterTo="transform opacity-100 -translate-x-0"
                                                        leave="transition ease-out duration-150"
                                                        leaveFrom="transform opacity-100"
                                                        leaveTo="transform opacity-0 -translate-x-10"
                                                    >

                                                        <button className='bg-amber-500 p-2 rounded-lg transition-all hover:bg-amber-600'
                                                            onClick={() => setNewBody('')}>Clear</button>
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

                                                        <button className='bg-fuchsia-500 p-2 rounded-lg transition-all hover:bg-fuchsia-600'
                                                            onClick={() => setNewBody(String(note.body))}>
                                                            Reset
                                                        </button>
                                                    </Transition>
                                                    <Transition
                                                        show={newBody !== savedBody}
                                                        enter="transition ease-in duration-200"
                                                        enterFrom="transform opacity-0 translate-x-5"
                                                        enterTo="transform opacity-100 translate-x-0"
                                                        leave="transition ease-out duration-150"
                                                        leaveFrom="transform opacity-100"
                                                        leaveTo="transform opacity-0 translate-x-10"
                                                    >

                                                        <button className='bg-blue-500 p-2 rounded-lg transition-all hover:bg-blue-600'
                                                            onClick={() => setSavedBody(newBody)}>Save</button>
                                                    </Transition>
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center space-x-4">
                                                <button className="bg-green-500 p-2 rounded-lg transition-all hover:bg-green-600" onClick={checkItem}>{note.checked ? 'Uncheck' : 'Check'}</button>
                                                <button className="bg-red-500 p-2 rounded-lg transition-all hover:bg-red-600" onClick={deleteItem}>Delete</button>
                                            </div>
                                            <div className='flex w-full justify-between items-center'>
                                                <button className='p-2 bg-red-500 rounded-lg transition-all hover:bg-red-600'
                                                    onClick={() => setOpenModal(false)}>Cancel</button>
                                                <button className='p-2 bg-emerald-500 rounded-lg transition-all hover:bg-emerald-600'
                                                    onClick={() => handleSave()}>Submit</button>

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
    )
}
