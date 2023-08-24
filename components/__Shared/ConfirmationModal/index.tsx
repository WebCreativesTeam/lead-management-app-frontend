import { Close } from '@/utils/icons';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, memo } from 'react';
import { ConfirmationModalTypes } from './ConfirmationModal.types';

const ConfirmationModal = ({ open, onClose, onSubmit, onDiscard, isBtnDisabled, title, description, btnDiscardText = 'Cancel', btnSubmitText = 'Submit' }: ConfirmationModalTypes) => {
    return (
        <div className="mb-5">
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" open={open} onClose={onClose}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-center justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">{title}</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={onClose}>
                                            <Close />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="text-center text-xl">{description}</div>
                                        <div className="mt-8 flex items-center justify-center">
                                            <button type="button" className="btn btn-outline-success" onClick={onDiscard} disabled={isBtnDisabled}>
                                                {btnDiscardText}
                                            </button>
                                            <button type="button" className="btn btn-danger ltr:ml-4 rtl:mr-4" onClick={onSubmit} disabled={isBtnDisabled}>
                                                {btnSubmitText}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default memo(ConfirmationModal);
