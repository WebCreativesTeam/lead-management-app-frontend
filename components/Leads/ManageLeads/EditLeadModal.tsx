/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo, useEffect, useState } from 'react';
import { IRootState } from '@/store';
import { getAllNotesForLead, setEditModal } from '@/store/Slices/leadSlice/manageLeadSlice';
import Loader from '@/components/__Shared/Loader';
import 'flatpickr/dist/flatpickr.css';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { Home, Note, Setting, Close, Delete } from '@/utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import EditOverviewForm from './EditOverviewForm';
import EditCustomFieldsTab from './EditCustomFieldsTab';
import { ApiClient } from '@/utils/http';
import { GetMethodResponseType, ILeadNotes } from '@/utils/Types';

const LeadEditModal = () => {
    const dispatch = useDispatch();
    const { isFetching, editModal, singleData, leadNoteList } = useSelector((state: IRootState) => state.lead);
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const {
        data: { id },
    } = useSelector((state: IRootState) => state.userInfo);

    useEffect(() => {
        handleFetchNotes();
    }, [fetching]);

    const handleFetchNotes = async () => {
        setIsLoading(true);
        try {
            const LeadNoteList: GetMethodResponseType = await new ApiClient().get(`lead-note?leadId=${singleData?.id}&sortBy=-createdAt`);
            const leadNotes: ILeadNotes[] = LeadNoteList?.data;
            if (typeof leadNotes === 'undefined') {
                dispatch(getAllNotesForLead([] as ILeadNotes[]));
                setIsLoading(false);
                return;
            }
            dispatch(getAllNotesForLead(leadNotes));
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleCreateNote = async () => {
        const createNoteObj = {
            content,
            userId: id,
            leadId: singleData?.id,
            title,
        };
        try {
            setIsLoading(true);
            await new ApiClient().post('lead-note', createNoteObj);
            setContent('');
            setTitle('');
            setIsLoading(false);
            setFetching(!fetching);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            setIsLoading(true);
            const deleteNote: ILeadNotes = await new ApiClient().delete('lead-note/' + id);
            if (deleteNote === null) {
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
            setFetching(!fetching);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    return (
        <Transition appear show={editModal} as={Fragment}>
            <Dialog
                as="div"
                open={editModal}
                onClose={() => {
                    dispatch(setEditModal({ open: false }));
                }}
            >
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-center justify-center px-4 ">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-[48rem] overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Update Lead</h5>
                                    <button
                                        type="button"
                                        className="text-white-dark hover:text-dark"
                                        onClick={() => {
                                            dispatch(setEditModal({ open: false }));
                                        }}
                                    >
                                        <Close />
                                    </button>
                                </div>
                                <div className="p-5">
                                    {isFetching ? (
                                        <Loader />
                                    ) : (
                                        <Tab.Group>
                                            <Tab.List className="mb-8 flex flex-col flex-wrap gap-2 sm:flex-row">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white`}
                                                        >
                                                            <Home />
                                                            Overview
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white`}
                                                        >
                                                            <Setting />
                                                            Custom Fields
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'bg-green-600 text-white  shadow-xl !outline-none' : ''
                                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2  before:inline-block hover:bg-green-600 hover:text-white`}
                                                        >
                                                            <Note />
                                                            Note
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>
                                            <Tab.Panels>
                                                {/* overview form :start */}
                                                <Tab.Panel>
                                                    <EditOverviewForm />
                                                </Tab.Panel>
                                                {/* overview form :end */}

                                                {/* Custom fields tab : start */}
                                                <Tab.Panel>
                                                    <EditCustomFieldsTab />
                                                </Tab.Panel>
                                                {/* custom fields tab :end */}

                                                {/* Notes tab content : start */}
                                                <Tab.Panel>
                                                    {isLoading ? (
                                                        <Loader />
                                                    ) : (
                                                        <div className="mb-5">
                                                            <div className="panel max-h-[60vh] overflow-y-auto">
                                                                {leadNoteList?.map((item, index) => {
                                                                    return (
                                                                        <div className="relative items-start sm:flex" key={index}>
                                                                            <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                                                <img
                                                                                    src="/assets/images/profile-16.jpeg"
                                                                                    alt="img"
                                                                                    className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]"
                                                                                />
                                                                            </div>

                                                                            <div className="flex-1">
                                                                                <h4 className="text-center text-base font-bold text-primary ltr:sm:text-left rtl:sm:text-right">{item?.title}</h4>
                                                                                <p className="text-xs tracking-wide text-gray-500">{new Date(item?.createdAt).toLocaleString()}</p>
                                                                                <div className="mb-8 mt-2 font-semibold text-white-dark sm:mt-7 ">{item?.content}</div>
                                                                            </div>
                                                                            <button type="button" className="btn btn-danger absolute right-2 top-0" onClick={() => handleDeleteNote(item?.id)}>
                                                                                <Delete />
                                                                                Delete this note
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div className="my-5 flex-1">
                                                                <label htmlFor="zip">Title</label>
                                                                <input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Enter Title" className="form-input" />
                                                            </div>
                                                            <div>
                                                                <textarea
                                                                    id="addNoteArea"
                                                                    rows={10}
                                                                    className="form-textarea"
                                                                    placeholder="Enter Note"
                                                                    onChange={(e) => setContent(e.target.value)}
                                                                    value={content}
                                                                ></textarea>
                                                            </div>
                                                            <div className="flex justify-center">
                                                                <button type="button" className="btn btn-primary" onClick={handleCreateNote} disabled={!content || !title}>
                                                                    Add Note
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Tab.Panel>
                                                {/* Notes tab content : end */}

                                                {/* logs tab content : start */}
                                                {/* <Tab.Panel>
                                    <div className="mb-5">
                                        <div className="mx-auto max-w-[900px]">
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-primary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Call with John Doe</p>
                                                    <p className="min-w-[100px] max-w-[100px] self-center text-xs font-bold text-white-dark">Duration :25 mins</p>
                                                    <audio controls muted>
                                                        <source src="horse.ogg" type="audio/ogg" />
                                                        <source src="horse.mp3" type="audio/mpeg" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-secondary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-secondary"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Whatsapp With Jane Smith</p>
                                                    <p className="min-w-[100px] self-center text-xs font-bold text-white-dark">Last Message: Birthday wish content</p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-success after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-success"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Email to HR and Admin</p>
                                                    <p className="min-w-[100px]  self-center text-xs font-bold text-white-dark">Last Message: Birthday wish content</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel> */}
                                                {/* logs tab content : end */}
                                            </Tab.Panels>
                                        </Tab.Group>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default memo(LeadEditModal);
