import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/userSlice';
import { Permission } from '@/utils/Types';
import { IRootState } from '@/store';

const UserViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.user);
    const dispatch = useDispatch();
    const { email, firstName, lastName, permissions } = singleData;

    return (
        <ViewModal
            title="View User Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            size="large"
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">First Name</span>
                            <p className="flex-[3]">{firstName}</p>
                        </li>
                        <li className="flex">
                            <span className="flex-1 text-lg font-bold"> Last Name</span>
                            <p className="flex-[3]">{lastName}</p>
                        </li>
                        <li className="flex">
                            <span className="flex-1 text-lg font-bold"> Email</span>
                            <p className="flex-[3] break-all">{email}</p>
                        </li>
                        <li className="flex flex-col sm:flex-row">
                            <span className="flex-1 text-lg font-bold">Permissions</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1">
                                {permissions?.map((item:string, i: number) => {
                                    return (
                                        <span key={i} className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 break-words ring-1 ring-inset ring-blue-700/10">
                                            {item}
                                        </span>
                                    );
                                })}
                                {permissions?.length === 0 && <p>No permission given</p>}
                            </div>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(UserViewModal);
