import { EyeIcon } from '@/utils/icons';
import React, { memo } from 'react';
import { IFollowUpCard } from './FollowUpCard.types';

const FollowUpCard = ({ title, followUpPercentage, followups, lastWeekFollowUps, color = 'blue' }: IFollowUpCard) => {
    return (
        <div className={`panel from-${color}-500 to-${color}-400 bg-gradient-to-r`} style={{ backgroundImage: `linear-gradient(to right, ${color}, ${color+"95"})` }}>
            <div className="flex justify-between">
                <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">{title}</div>
            </div>
            <div className="mt-5 flex items-center">
                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {followups} </div>
                {/* <div className="badge bg-white/30"> {followUpPercentage} </div> */}
            </div>
            <div className="mt-5 flex items-center font-semibold">
                <EyeIcon />
                {/* Last Week */}
                {lastWeekFollowUps}
            </div>
        </div>
    );
};

export default memo(FollowUpCard);
