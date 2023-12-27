/* eslint-disable @next/next/no-img-element */
import React, { Fragment, memo } from 'react';
import { IRootState } from '@/store';
import { setActiveTab, setCreateModal, setIsOverviewTabDisabled, setOverViewFormData } from '@/store/Slices/leadSlice/manageLeadSlice';
import Loader from '@/components/__Shared/Loader';
import 'flatpickr/dist/flatpickr.css';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { Home, Note, Setting, Close } from '@/utils/icons';
import CustomFieldsTab from './CustomFieldsTab';
import CreateOverviewForm from './CreateOverviewForm';
import { useDispatch, useSelector } from 'react-redux';
import { OverviewFormType } from '@/utils/Types';

const LeadCreateModal = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal, activeTab, isOverviewTabDisabled } = useSelector((state: IRootState) => state.lead);

    return (
        <Transition appear show={createModal} as={Fragment}>
            <Dialog
                as="div"
                open={createModal}
                onClose={() => {
                    dispatch(setCreateModal(false));
                    dispatch(setIsOverviewTabDisabled(false));
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
                                            dispatch(setIsOverviewTabDisabled(false));
                                            dispatch(setActiveTab(0));
                                            dispatch(setOverViewFormData({} as OverviewFormType));
                                        }}
                                    >
                                        <Close />
                                    </button>
                                </div>
                                <div className="p-5">
                                    {isFetching ? (
                                        <Loader />
                                    ) : (
                                        <Tab.Group selectedIndex={activeTab}>
                                            <Tab.List className="mb-8 flex flex-col flex-wrap gap-2 sm:flex-row">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${
                                                                selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white disabled:bg-slate-200 disabled:hover:text-black`}
                                                            disabled={isOverviewTabDisabled}
                                                            onClick={() => dispatch(setActiveTab(0))}
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
                                                            } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white `}
                                                            onClick={() => dispatch(setActiveTab(1))}
                                                        >
                                                            <Setting />
                                                            Custom Fields
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
