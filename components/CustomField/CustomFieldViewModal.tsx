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
            title="View Custom Field Detail"
            open={viewModal}
            size="medium"
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Field Label</span>
                            <p className="flex-1">{singleData?.label}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Field Type</span>
                            <p className="flex-1">{singleData?.fieldType}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Order</span>
                            <p className="flex-1">{singleData?.order}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">field Required</span>
                            <p className="flex-1">{singleData?.required ? 'Required' : 'optional'}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Activate Status</span>
                            <p className="flex-1">{singleData?.active ? 'Active' : 'Not Active'}</p>
                        </li>
                        {singleData?.conditional && (
                            <li className="flex flex-wrap">
                                <span className="flex-1 text-lg font-bold">conditional Operator</span>
                                <p className="flex-1">{singleData?.operator}</p>
                            </li>
                        )}
                        {singleData?.options?.length>0 && (
                            <li className="flex flex-wrap">
                                <span className="flex-1 text-lg font-bold">Options</span>
                                <p className="flex-1">
                                    {singleData?.options
                                        ?.map((item) => {
                                            return item.name;
                                        })
                                        .join(' , ')}
                                </p>
                            </li>
                        )}
                    </ul>
                </>
            }
        />
    );
};

export default memo(CustomFieldViewModal);
