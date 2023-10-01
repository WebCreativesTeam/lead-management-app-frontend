import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/templateSlice/whatsappTemplateSlice';
import { IRootState } from '@/store';

const WhatsappTemplateViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.whatsappTemplate);
    const dispatch = useDispatch();

    return (
        <ViewModal
            title="View Whatsapp Template Detail"
            open={viewModal}
            size="large"
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Name</span>
                            <p className="flex-[2]">
                                <span>{singleData?.name}</span>
                            </p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Message</span>
                            <p className="flex-[2]">
                                <span>{singleData?.message}</span>
                            </p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Created</span>
                            <p className="flex-[2]">{new Date(singleData.createdAt).toLocaleString()}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Last Updated</span>
                            <p className="flex-[2]">{new Date(singleData.updatedAt).toLocaleString()}</p>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(WhatsappTemplateViewModal);
