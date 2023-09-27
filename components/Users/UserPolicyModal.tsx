/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setDisableBtn, setFetching, setPolicyModal } from '@/store/Slices/userSlice';
import { ApiClient } from '@/utils/http';
import { PolicyDataType, PolicyListSecondaryEndpoint, SelectOptionsType, UserDataType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import Select, { ActionMeta } from 'react-select';
import Loader from '../__Shared/Loader';

const UserPolicyModal = () => {
    const { policyModal, isBtnDisabled, singleData, policies, isFetching } = useSelector((state: IRootState) => state.user);
    const [policiesData, setPoliciesData] = useState<SelectOptionsType[]>([]);
    const [defaultSelectedPolicy, setDefaultSelectedPolicy] = useState<SelectOptionsType[]>([]);

    useEffect(() => {
        handlePolicy();
    }, [singleData]);

    const dispatch = useDispatch();

    const handlePolicy = async () => {
        setPolicyModal(true);
        const createPolicyObj: SelectOptionsType[] = policies.map((policy: PolicyListSecondaryEndpoint) => {
            return { value: policy.id, label: policy.name };
        });
        setPoliciesData(createPolicyObj);

        const selectedPolicyIdArr: string[] = singleData?.policies?.map((item: any) => {
            return item.id;
        });
        console.log(singleData);
        const preSelectedPolicy: SelectOptionsType[] = createPolicyObj.filter((item: SelectOptionsType) => {
            return selectedPolicyIdArr?.includes(item.value);
        });
        setDefaultSelectedPolicy(preSelectedPolicy);
    };

    const handleSelectPolicy = (policies: any | SelectOptionsType, actionMeta: ActionMeta<any>) => {
        setDefaultSelectedPolicy(policies);
    };
    const onSubmitPolicy = async () => {
        dispatch(setFetching(true));
        try {
            const selectedPolicyArr = defaultSelectedPolicy.map((policy: SelectOptionsType) => {
                return policy.value;
            });
            dispatch(setDisableBtn(true));
            await new ApiClient().post(process.env.NEXT_PUBLIC_API_LINK + 'user/' + singleData?.id + '/policy', { policiesId: selectedPolicyArr });
            dispatch(setPolicyModal({ open: false }));
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

    return (
        <Modal
            open={policyModal}
            onClose={() => dispatch(setPolicyModal({ open: false }))}
            size="medium"
            onDiscard={() => dispatch(setPolicyModal({ open: false }))}
            title="User Policy"
            onSubmit={() => onSubmitPolicy()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={isBtnDisabled ? true : false}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <div className="text-center text-xl">
                        <Select placeholder="Select Policy" options={policiesData} isMulti isSearchable={false} onChange={handleSelectPolicy} value={defaultSelectedPolicy} />
                    </div>
                )
            }
        />
    );
};

export default memo(UserPolicyModal);
