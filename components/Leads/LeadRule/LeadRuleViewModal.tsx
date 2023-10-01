import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/leadSlice/leadRuleSlice';
import { IRootState } from '@/store';

const LeadRuleViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.leadRule);
    const dispatch = useDispatch();

    return (
        <ViewModal
            title="View Lead Rule Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Rule Name</span>
                            <p className="flex-[2]">{singleData?.name}</p>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(LeadRuleViewModal);
