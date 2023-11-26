import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/customFieldSlice';
import { IRootState } from '@/store';

const CustomFieldViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.customField);
    const dispatch = useDispatch();

    return (
        <ViewModal
            title="View CustomField Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">CustomField Name</span>
                            <p className="flex-[2]">{singleData?.label}</p>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(CustomFieldViewModal);
