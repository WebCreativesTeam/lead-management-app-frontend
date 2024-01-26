import Loader from '@/components/__Shared/Loader';
import Modal from '@/components/__Shared/Modal';
import { IRootState } from '@/store';
import { setDisableBtn, setFetching, setSmsTemplateModal } from '@/store/Slices/leadSlice/manageLeadSlice';
import { GetMethodResponseType, SelectOptionsType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import { ApiClient } from '@/utils/http';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

const SmsTemplateModal = () => {
    const { isBtnDisabled, isFetching, smsTemplateModal } = useSelector((state: IRootState) => state.lead);
    const [templateId, setTemplateId] = useState<any>('');
    const [templateDropdown, setTemplateDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const dispatch = useDispatch();

    const onSubmitPolicy = async () => {
        dispatch(setFetching(true));
        try {
            // const selectedPolicyArr = defaultSelectedPolicy.map((policy: SelectOptionsType) => {
            //     return policy.value;
            // });
            dispatch(setDisableBtn(true));
            // await new ApiClient().post(process.env.NEXT_PUBLIC_API_LINK + 'user/' + singleData?.id + '/policy', { policiesId: selectedPolicyArr });
            dispatch(setSmsTemplateModal({ open: false }));
        } catch (error: any) {
            if (typeof error?.response?.data?.message === 'object') {
                showToastAlert(error?.response?.data?.message.join(' , '));
            } else {
                showToastAlert(error?.response?.data?.message);
            }
            showToastAlert(error?.response?.data?.message);
        }
        dispatch(setDisableBtn(false));
        dispatch(setFetching(false));
    };

    useEffect(() => {
        getAllTemplates();
    }, []);

    //get products list
    const getAllTemplates = async () => {
        const templateList: GetMethodResponseType = await new ApiClient().get('sms-template/list');

        const templates: { id: string; name: string }[] = templateList?.data;
        if (templates) {
            const templateDropdown: SelectOptionsType[] = templates.map((item) => {
                return { label: item?.name, value: item?.id };
            });
            setTemplateDropdown(templateDropdown);
        }
    };

    return (
        <Modal
            open={smsTemplateModal}
            onClose={() => dispatch(setSmsTemplateModal({ open: false }))}
            size="medium"
            onDiscard={() => dispatch(setSmsTemplateModal({ open: false }))}
            title="Send Sms Template"
            onSubmit={() => onSubmitPolicy()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={isBtnDisabled ? true : false}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <div className="text-center text-xl">
                        <Select placeholder="Select Sms Template" options={templateDropdown} isSearchable={false} onChange={(e: any) => setTemplateId(e.value)} />
                    </div>
                )
            }
        />
    );
};

export default SmsTemplateModal;
