import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/sourceSlice';
import { IRootState } from '@/store';

const SourceViewModal = () => {
    const {viewModal,singleData} = useSelector((state: IRootState) => state.source);
    const dispatch = useDispatch();

    return (
        <ViewModal
            title="View Source Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Source Name</span>
                            <p className="flex-[2]">{singleData?.name}</p>
                        </li>
                        {/* <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Source Created</span>
                            <p className="flex-[2]">{new Date(singleData?.createdAt).toLocaleString()}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Last Updated</span>
                            <p className="flex-[2]">{new Date(singleData?.updatedAt).toLocaleString()}</p>
                        </li> */}
                    </ul>
                </>
            }
        />
    );
};

export default memo(SourceViewModal);
