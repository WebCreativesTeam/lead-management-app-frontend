import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/policySlice';
import { Permission, PolicyDataType } from '@/utils/Types';
import { IRootState } from '@/store';

const PolicyViewModal = () => {
    const {viewModal,singleData,permissions }= useSelector((state: IRootState) => state.policy);
    const dispatch = useDispatch();

    const givenPermissions: Permission[] = permissions?.filter((item: Permission) => {
        return singleData?.permissions?.includes(item?.key);
    });

    return (
        <ViewModal
            title="View Policy Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            size="large"
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Policy Name</span>
                            <p className="flex-[3]">{singleData?.name}</p>
                        </li>
                        <li className="flex">
                            <span className="flex-1 text-lg font-bold"> Policy Description</span>
                            <p className="flex-[3]">{singleData?.description}</p>
                        </li>
                        <li className="flex">
                            <span className="flex-1 text-lg font-bold">Permissions</span>
                            <div className="grid flex-[3] grid-cols-3 gap-x-3 gap-y-1">
                                {givenPermissions?.map((item: Permission, i: number) => {
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

export default memo(PolicyViewModal);
