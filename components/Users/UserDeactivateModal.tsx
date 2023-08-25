import { IRootState } from '@/store';
import { setDeactivateModal, setDisableBtn, setFetching } from '@/store/Slices/userSlice';
import { UserDataType } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { Close } from '@/utils/icons';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UserDeactivateModal = () => {
    const deactivateModal: boolean = useSelector((state: IRootState) => state.user.deactivateModal);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.user.isBtnDisabled);
    const deactivateValue: boolean = useSelector((state: IRootState) => state.user.deactivateValue);
    const singleUser: UserDataType = useSelector((state: IRootState) => state.user.singleData);
    const dispatch = useDispatch();

    const onDeactivateUser = async () => {
        dispatch(setFetching(true));
        dispatch(setDisableBtn(true));
        const deactivateUser: UserDataType = await new ApiClient().patch(`users/${singleUser.id}/internal`, { isActive: deactivateValue });
        if (Object.keys(deactivateUser).length === 0) {
            dispatch(setDisableBtn(false));
            return;
        }
        dispatch(setDisableBtn(false));
        dispatch(setDeactivateModal({ open: false }));
        dispatch(setFetching(false));
    };
    return (
        <div className="mb-5">
            <Transition appear show={deactivateModal} as={Fragment}>
                <Dialog as="div" open={deactivateModal} onClose={() => dispatch(setDeactivateModal(false))}>
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
                                        <h5 className="text-lg font-bold">{deactivateValue ? 'Activate' : 'Deactivate'} User</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => dispatch(setDeactivateModal({ open: false }))}>
                                            <Close />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="text-center text-xl">Are you sure you want to {deactivateValue ? 'activate' : 'deactivate'} this user?</div>
                                        <div className="mt-8 flex items-center justify-center">
                                            <button
                                                type="button"
                                                className={`btn btn-outline-${deactivateValue ? 'danger' : 'success'}`}
                                                onClick={() => dispatch(setDeactivateModal({ open: false }))}
                                                disabled={isBtnDisabled}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn ${deactivateValue ? 'btn-success' : 'btn-danger'} rtl:mr-4" ltr:ml-4`}
                                                onClick={onDeactivateUser}
                                                disabled={isBtnDisabled}
                                            >
                                                {deactivateValue ? 'Activate' : 'Deactivate'} User
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

export default UserDeactivateModal;
