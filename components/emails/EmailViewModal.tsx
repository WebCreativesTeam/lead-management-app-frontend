import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/emailSlice';
import { IRootState } from '@/store';

const EmailViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.emails);
    const dispatch = useDispatch();

    const EmailViewObject: any = {
        Name: singleData?.name,
        Subject: singleData?.subject,
        Message: <div dangerouslySetInnerHTML={{ __html: singleData?.message }} />,
        ['Templated Created']: new Date(singleData?.createdAt).toLocaleString(),
        ['Templated Updated']: new Date(singleData?.updatedAt).toLocaleString(),
    };

    return (
        <ViewModal
            title="View Template Detail"
            open={viewModal}
            size="large"
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
                    <ul className="flex flex-col gap-4">
                        {Object.keys(EmailViewObject).map((item: string, i: number) => {
                            return (
                                <li className="flex flex-wrap" key={i}>
                                    <span className="flex-1 text-lg font-bold">{item}</span>
                                    <p className="flex-[2]">{EmailViewObject[item]}</p>
                                </li>
                            );
                        })}
                    </ul>
                </>
            }
        />
    );
};

export default memo(EmailViewModal);
