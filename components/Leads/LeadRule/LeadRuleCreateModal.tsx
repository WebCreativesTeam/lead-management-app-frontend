import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadRuleSlice';
import { useFormik } from 'formik';
import { leadRuleSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import { SelectOptionsType, SourceDataType } from '@/utils/Types';

const LeadRuleCreateModal = () => {
    const { createModal, isBtnDisabled, isFetching, sourceList } = useSelector((state: IRootState) => state.leadRule);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

    useEffect(() => {
        const sourceOptions: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
            return { value: item.id, label: item.name };
        });
        setSourceDropdown(sourceOptions);
    }, [sourceList]);

    const dispatch = useDispatch();
    const { values, handleChange, setFieldValue, submitForm, handleSubmit, handleBlur, resetForm, } = useFormik({
        initialValues: {
            name: '',
            isLeadAdded: false,
            isLeadEdited: false,
        },
        validationSchema: leadRuleSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('leadRule', { name: value.name });
                dispatch(setCreateModal(false));
                action.resetForm();
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
        },
    });
    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={() => {
                dispatch(setCreateModal(false));
                resetForm();
            }}
            size="large"
            onSubmit={() => submitForm()}
            title="Create Lead  Rule"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="createLeadRule">LeadRule Name</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="createLeadRule" name="name" type="text" placeholder="Rule Name" className="form-input" />
                        </div>
                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                        <div>
                            <section className="flex flex-col gap-x-9 gap-y-5 sm:flex-row">
                                <p>Apply This Rule when :</p>
                                <div className="flex gap-x-9">
                                    <div>
                                        <label className="inline-flex" htmlFor="leadAdded">
                                            <input
                                                type="checkbox"
                                                className="peer form-checkbox outline-success"
                                                id="leadAdded"
                                                name="isActive"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('isLeadAdded', e.target.checked)}
                                            />
                                            <span className="peer-checked:text-success">Lead Added</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="inline-flex" htmlFor="taskActiveStatus">
                                            <input
                                                type="checkbox"
                                                className="peer form-checkbox outline-success"
                                                id="taskActiveStatus"
                                                name="isActive"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('isEdited', e.target.checked)}
                                            />
                                            <span className="peer-checked:text-success">Lead Edited</span>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <div className="flex-1">
                                <label htmlFor="state">Source</label>
                                <Select placeholder="Select Source" options={sourceDropdown} onChange={(data: any) => setFieldValue('source', data.value)} />
                            </div>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(LeadRuleCreateModal);
