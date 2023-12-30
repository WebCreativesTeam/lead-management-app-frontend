import React, { memo, useEffect, useState } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/leadSlice/leadAssigningSlice';
import { IRootState } from '@/store';
import { UserListSecondaryEndpointType } from '@/utils/Types';

type ResType = {
    userId: UserListSecondaryEndpointType | undefined;
    percentage: string;
};

const LeadAssignmentViewModal = () => {
    const { viewModal, singleData, usersList } = useSelector((state: IRootState) => state.leadAssignment);
    const dispatch = useDispatch();
    const [resUsers, setResUsers] = useState<ResType[]>([] as ResType[]);

    useEffect(() => {
        const resultArray: ResType[] = singleData?.userPercentages.map((item) => ({
            userId: usersList.find((user) => user.id === item.userId),
            percentage: item.percentage,
        }));
        setResUsers(resultArray);
    }, []);

    return (
        <ViewModal
            title="View Lead Assignment Detail"
            open={viewModal}
            onClose={() => dispatch(setViewModal({ open: false }))}
            size="large"
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Lead Assignment Name</span>
                            <p className="flex-[2]">{singleData?.name}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Source</span>
                            <p className="flex-[2]">{singleData?.source?.name}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Product</span>
                            <p className="flex-[2]">{singleData?.product?.name}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">Is Active</span>
                            <p className="flex-[2]">{singleData?.isActive? "Active" : "Not Active"}</p>
                        </li>
                        <li className="flex flex-wrap">
                            <span className="flex-1 text-lg font-bold">User Percentage</span>
                            <div className="flex-[2]">
                                {resUsers?.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <span className="font-bold">{`${item?.userId?.firstName} ${item?.userId?.lastName} : `}</span>
                                            <span>{item?.percentage}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </li>
                    </ul>
                </>
            }
        />
    );
};

export default memo(LeadAssignmentViewModal);
