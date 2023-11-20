import React, { memo } from 'react';
import ViewModal from '../../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/scheduleMessageSlice';
import { IRootState } from '@/store';

const ScheduleMessageViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.scheduleMessage);
    const dispatch = useDispatch();
    const { leadStatus, platform, product, schedule, scheduleName, source, status, template } = singleData;

    const reqData: any = {
        ['Schedule Name']: scheduleName,
        source,
        product,
        ['schedule time']: schedule,
        ['Active Status']: status ? 'Active' : 'Not Active',
        ['Lead Status']: leadStatus,
        Platforms: platform?.join(' , '),
        template,
    };

    return (
        <ViewModal
            title="View Schedule Message Detail"
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

export default memo(ScheduleMessageViewModal);
