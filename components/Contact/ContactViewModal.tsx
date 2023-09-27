import React, { memo } from 'react';
import ViewModal from '../__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/contactSlice';
import { IRootState } from '@/store';

const ContactViewModal = () => {
    const { viewModal, singleData } = useSelector((state: IRootState) => state.contacts);
    const dispatch = useDispatch();
    const { location, assignedTo, comment, createdAt, email, facebookProfile, industry, name, phoneNumber, position, source, title, twitterProfile, updatedAt, website, addedBy } = singleData;

    const reqData: any = {
        name: title + ' ' + name,
        email,
        phoneNumber,
        industry,
        position,
        ['Assigned To']: `${assignedTo?.firstName} ${assignedTo?.lastName} (${assignedTo?.email})`,
        ['source Name']: source?.name,
        ['Added By']: `${addedBy?.firstName} ${addedBy?.lastName} (${addedBy?.email})`,
        twitterProfile,
        facebookProfile,
        website,
        address: location?.address,
        city: location?.city,
        state: location?.state,
        country: location?.country,
        comment,
        createdAt: new Date(createdAt).toLocaleString(),
        updatedAt: new Date(updatedAt).toLocaleString(),
    };

    return (
        <ViewModal
            title="View Contact Detail"
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

export default memo(ContactViewModal);
