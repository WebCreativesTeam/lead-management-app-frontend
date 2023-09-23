import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/emailSlice/emailLogSlice';
import { IRootState } from '@/store';

const EmailLogViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.emailLog);
    const dispatch = useDispatch();

    const { createdAt, updatedAt, message, receiverEmail, senderEmail, senderName, subject } = singleData;

    const reqData: any = {
        ['Sender Email']: senderEmail,
        ['Sender Name']: senderName,
        ['Receiver Email']: receiverEmail,
        Message: message,
        Subject: subject,
        ['Email Created']: new Date(createdAt).toLocaleString(),
        ['Email Updated']: new Date(updatedAt).toLocaleString(),
    };
    return (
        <ViewModal
            title="View Email Log"
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

export default memo(EmailLogViewModal);
