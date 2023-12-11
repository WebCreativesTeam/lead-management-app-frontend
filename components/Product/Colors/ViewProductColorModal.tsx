import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/productColorSlice';
import { IRootState } from '@/store';

const ProductColorViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.productColor);
    const dispatch = useDispatch();

    return (
        <ViewModal
            title="View Color Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Staus Name</span>
                            <p className="flex-[2]">
                                <span
                                    className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`}
                                    style={{ color: singleData?.value, backgroundColor: singleData?.value + '20' }}
                                >
                                    {singleData?.name}
                                </span>
                            </p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Status Created</span>
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

export default memo(ProductColorViewModal);
