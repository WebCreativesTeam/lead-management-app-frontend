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
        contact: `${contact?.title} ${contact?.name} (${contact?.email})`,
        source: source?.name,
        ['Estimate Budget']: estimatedBudget,
        description,
        reference,
        job,
        ['Facebook Campaign Name']: facebookCampaignName,
        ['Service Interested']: serviceInterestedIn,
        priority: (
            <>
                <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: priority?.color, backgroundColor: priority?.color + '20' }}>
                    {priority?.name}
                </span>
            </>
        ),
        ['Lead Created']: new Date(createdAt).toLocaleString(),
        ['Lead Updated']: new Date(updatedAt).toLocaleString(),
        ['Lead Estimate Date']: new Date(estimatedDate).toLocaleString(),
        DOB: new Date(DOB).toLocaleString(),
        ['Lead Status']: (
            <>
                <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: status?.color, backgroundColor: status?.color + '20' }}>
                    {status?.name}
                </span>
            </>
        ),
    };

    return (
        <ViewModal
            title="View Lead Detail"
            open={viewModal}
            size="large"
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
