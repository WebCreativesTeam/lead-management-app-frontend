import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/campaignSlice';
import { IRootState } from '@/store';

const CampaignViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.campaign);
    const dispatch = useDispatch();
    const { name, isActive, createdAt, sendTo, updatedAt, type } = singleData;

    const reqData: any = {
        ['Campaign Name']: name,
        ['Campaign Type']: `${type?.toLowerCase()} campaign`,
        ['Active Status']: isActive ? 'Active' : 'Not Active',
        ['Send To']: sendTo,
        ['Created Date']: new Date(createdAt).toLocaleString(),
        ['Last Updated']: new Date(updatedAt).toLocaleString(),
    };

    return (
        <ViewModal
            title="View Campaign Details"
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

export default memo(CampaignViewModal);
