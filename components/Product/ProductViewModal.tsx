import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/productSlice';
import { IRootState } from '@/store';

const ProductViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.product);
    const dispatch = useDispatch();

    return (
        <ViewModal
            title="View Product Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Name</span>
                            <p className="flex-[2]">{singleData?.name}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Description</span>
                            <p className="flex-[2]">{singleData?.description}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Sub Products</span>
                            <p className="flex-[2]">{singleData?.subProducts?.map((item) => item?.name).join(' , ')}</p>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(ProductViewModal);
