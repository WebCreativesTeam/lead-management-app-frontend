import React, { Fragment } from 'react';
import { ModalProps } from './modal.types';
import { Dialog, Transition } from '@headlessui/react';
import { Close } from '@/components/icons';

const Modal = ({ content, onClose, onDiscard, onSubmit, open, title, btnDiscardText = 'Discard', btnSubmitText = 'Submit', isBtnDisabled, size = 'medium', disabledDiscardBtn }: ModalProps) => {
    return (
        <div className="mb-5">
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" open={open} onClose={onDiscard}>
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
                                <Dialog.Panel
                                    as="div"
                                    className="panel my-8 w-full overflow-visible rounded-lg border-0 p-0 text-black dark:text-white-dark"
                                    style={{ maxWidth: size === 'medium' ? '32rem' : size === 'large' ? '48rem' : size === 'xLarge' ? '72rem' : size }}
                                >
                                    <div className="flex items-center justify-between rounded-t-lg bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">{title}</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={onClose}>
                                            <Close />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        {content}
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-outline-danger" onClick={onDiscard} disabled={disabledDiscardBtn}>
                                                {btnDiscardText}
                                            </button>
                                            <button type="submit" className="btn  btn-primary cursor-pointer ltr:ml-4 rtl:mr-4" disabled={isBtnDisabled} onClick={onSubmit}>
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

export default Modal;
