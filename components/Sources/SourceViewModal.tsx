import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/sourceSlice';
import { SourceDataType } from '@/utils/Types';
import { IRootState } from '@/store';

const SourceViewModal = () => {
    const viewModal: boolean = useSelector((state: IRootState) => state.source.viewModal);
    const singleSource: SourceDataType = useSelector((state: any) => state?.source?.singleData);
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
                            <p className="flex-[2]">{singleSource.name}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Source Created</span>
                            <p className="flex-[2]">{new Date(singleSource.createdAt).toLocaleString()}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Last Updated</span>
                            <p className="flex-[2]">{new Date(singleSource.updatedAt).toLocaleString()}</p>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(SourceViewModal);
