import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/branchSlice';
import { BranchDataType } from '@/utils/Types';
import { IRootState } from '@/store';

const BranchViewModal = () => {
    const viewModal: boolean = useSelector((state: IRootState) => state.branch.viewModal);
    const singleBranch: BranchDataType = useSelector((state: any) => state.branch.singleData);
    const dispatch = useDispatch();
    const { name, address, city, country, state, createdAt, updatedAt } = singleBranch;

    const reqData: any = {
        name: name,
        address: address,
        city: city,
        state: state,
        country: country,
        created: new Date(createdAt).toLocaleString(),
        ['Last Updated']: new Date(updatedAt).toLocaleString(),
    };

    return (
        <ViewModal
            title="View Branch Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        {Object.keys(reqData).map((item: string, i: number) => {
                            return (
                                <li className="flex flex-wrap" key={i}>
                                    <span className="flex-1 text-lg font-bold capitalize">{item}</span>
                                    <p className="flex-[2]"> {reqData[item]}</p>
                                </li>
                            );
                        })}
                    </ul>
                </>
            }
        />
    );
};

export default memo(BranchViewModal);
