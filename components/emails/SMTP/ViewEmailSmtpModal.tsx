import React, { memo } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/emailSlice/emailSmtpSlice';
import { IRootState } from '@/store';

const EmailSmtpViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.emailSmtp);
    const dispatch = useDispatch();

    const { createdAt, SMTP, email, name, security, updatedAt ,port,host} = singleData;

    const reqData: any = {
        SMTP,
        Email: email,
        Name: name,
        Security: security,
        Port :port,
        Host :host,
        ['Lead Created']: new Date(createdAt).toLocaleString(),
        ['Lead Updated']: new Date(updatedAt).toLocaleString(),
    };
    return (
        <ViewModal
            title="View EmailSmtp Detail"
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

export default memo(EmailSmtpViewModal);
