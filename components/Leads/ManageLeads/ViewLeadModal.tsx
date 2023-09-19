import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/leadSlice/manageLeadSlice';
import { IRootState } from '@/store';

const LeadViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.lead);
    const dispatch = useDispatch();
    const { createdAt, description, status, updatedAt, DOB, branch, contact, estimatedBudget, estimatedDate, facebookCampaignName, job, priority, reference, serviceInterestedIn, source } = singleData;

    const reqData: any = {
        branch: branch?.name,
        contact: contact?.name,
        source: source?.name,
        ['Estimate Budget']: estimatedBudget,
        description,
        reference,
        job,
        ['Facebook Campaign Name']: facebookCampaignName,
        ['Service Interested']: serviceInterestedIn,
        priority: priority?.name,
        ['Lead Created']: new Date(createdAt).toLocaleString(),
        ['Lead Updated']: new Date(updatedAt).toLocaleString(),
        ['Lead Estimate Date']: new Date(estimatedDate).toLocaleString(),
        DOB: new Date(DOB).toLocaleString(),
        ['Lead Status']: status?.name,
    };

    return (
        <ViewModal
            title="View Lead Detail"
            open={viewModal}
            size='large'
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

export default memo(LeadViewModal);
