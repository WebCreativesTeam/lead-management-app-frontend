/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo, useEffect } from 'react';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/manageLeadSlice';
import { useFormik } from 'formik';
import { leadSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import 'flatpickr/dist/flatpickr.css';
import { SelectOptionsType, BranchListSecondaryEndpoint, SourceDataType, ContactListSecondaryEndpoint, LeadPrioritySecondaryEndpoint, LeadStatusSecondaryEndpoint } from '@/utils/Types';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { Home, Note, Setting, Close } from '@/utils/icons';
import CustomFieldsTab from './CustomFieldsTab';
import CreateOverviewForm from './CreateOverviewForm';
import { useDispatch, useSelector } from 'react-redux';

const LeadCreateModal = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal } = useSelector((state: IRootState) => state.lead);

    return (
        <Transition appear show={createModal} as={Fragment}>
            <Dialog
                as="div"
                open={createModal}
                onClose={() => {
                    dispatch(setCreateModal(false));
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
                                    <h5 className="text-lg font-bold">Create Lead</h5>
                                    <button
                                        type="button"
                                        className="text-white-dark hover:text-dark"
                                        onClick={() => {
                                            dispatch(setCreateModal(false));
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
                                                    <CreateOverviewForm />
                                                </Tab.Panel>
                                                {/* overview form :end */}

                                                {/* Custom fields tab : start */}
                                                <Tab.Panel>
                                                    <CustomFieldsTab />
                                                </Tab.Panel>
                                                {/* custom fields tab :end */}

                                                {/* Notes tab content : start */}
                                                <Tab.Panel>
                                                    <div className="mb-5">
                                                        <div className="panel max-h-[60vh] overflow-y-auto">
                                                            <div className="sm:flex">
                                                                <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                                    <img
                                                                        src="/assets/images/profile-16.jpeg"
                                                                        alt="img"
                                                                        className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]"
                                                                    />
                                                                </div>

                                                                <div className="flex-1">
                                                                    <h4 className="text-center text-base font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Laurie Fox</h4>
                                                                    <p className="text-xs tracking-wide text-gray-500">31/01/2024, 12:00 AM</p>
                                                                    <div className="mb-16 mt-2 sm:mt-7">
                                                                        <h6 className="mb-2 inline-block text-base font-bold">Trending Style</h6>
                                                                        <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="sm:flex">
                                                                <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                                    <img
                                                                        src="/assets/images/profile-7.jpeg"
                                                                        alt="img"
                                                                        className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="text-center text-base font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Justin Cross</h4>
                                                                    <p className="text-xs tracking-wide text-gray-500">31/01/2024, 12:00 AM</p>
                                                                    <div className="mb-16 mt-4 sm:mt-7">
                                                                        <h6 className="mb-2 inline-block text-base font-bold">Nature Photography</h6>
                                                                        <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="sm:flex">
                                                                <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                                    <img
                                                                        src="/assets/images/profile-16.jpeg"
                                                                        alt="img"
                                                                        className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]"
                                                                    />
                                                                </div>

                                                                <div className="flex-1">
                                                                    <h4 className="text-center text-base font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Laurie Fox</h4>
                                                                    <p className="text-xs tracking-wide text-gray-500">31/01/2024, 12:00 AM</p>
                                                                    <div className="mb-16 mt-2 sm:mt-7">
                                                                        <h6 className="mb-2 inline-block text-base font-bold">Trending Style</h6>
                                                                        <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="sm:flex">
                                                                <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                                    <img
                                                                        src="/assets/images/profile-7.jpeg"
                                                                        alt="img"
                                                                        className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="text-center text-base font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Justin Cross</h4>
                                                                    <p className="text-xs tracking-wide text-gray-500">31/01/2024, 12:00 AM</p>
                                                                    <div className="mb-16 mt-4 sm:mt-7">
                                                                        <h6 className="mb-2 inline-block text-base font-bold">Nature Photography</h6>
                                                                        <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="sm:flex">
                                                                <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                                    <img
                                                                        src="/assets/images/profile-16.jpeg"
                                                                        alt="img"
                                                                        className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="text-center text-xl font-bold text-primary ltr:sm:text-left rtl:sm:text-right">Laurie Fox</h4>

                                                                    <div className="mb-16 mt-4 sm:mt-7">
                                                                        <h6 className="mb-2 inline-block text-lg font-bold">Create new Project</h6>
                                                                        <p className="font-semibold text-white-dark ltr:pl-8 rtl:pr-8">
                                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        <div className="mt-10">
                                                            <textarea id="addNoteArea" rows={10} className="form-textarea" placeholder="Enter Note"></textarea>
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <button type="button" className="btn btn-primary">
                                                                Add Note
                                                            </button>
                                                        </div>
                                                    </div>
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

export default memo(LeadCreateModal);
