import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/userSlice';
import { Permission, UserDataType } from '@/utils/Types';
import { IRootState } from '@/store';

const UserViewModal = () => {
    const viewModal: boolean = useSelector((state: IRootState) => state.user.viewModal);
    const singleUser: UserDataType = useSelector((state: any) => state?.user?.singleData);
    const dispatch = useDispatch();
    const { deactivatedAt, email, firstName, id, isActive, isVerified, lastName, permissions, policiesIncluded } = singleUser;

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
                        <li className="flex">
                            <span className="flex-1 text-lg font-bold">Permissions</span>
                            <div className="grid flex-[3] grid-cols-3 gap-x-3 gap-y-1">
                                {permissions?.map((item: Permission, i: number) => {
                                    return (
                                        <span key={i} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {item.value}
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
