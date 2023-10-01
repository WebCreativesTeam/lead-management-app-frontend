/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/leadRuleSlice';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { leadRuleSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import { SelectOptionsType, SourceDataType } from '@/utils/Types';

const LeadRuleEditModal = () => {
    const { editModal, singleData, isBtnDisabled, isFetching, sourceList } = useSelector((state: IRootState) => state.leadRule);

    const dispatch = useDispatch();

      const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
   useEffect(() => {
       const sourceOptions: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
           return { value: item.id, label: item.name };
       });
       setSourceDropdown(sourceOptions);
   }, [sourceList]);

    useEffect(() => {
        formik.setFieldValue('name', singleData?.name);
    }, [singleData]);

    const formik = useFormik({
        initialValues: {
            name: '',
            isLeadAdded: false,
            isLeadEdited: false,
            steps: [
                {
                    setDays: '',
                    sendByEmail: false,
                    sendBySms: false,
                    sendByWhatsapp: false,
                },
            ],
        },
        validationSchema: leadRuleSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('lead-rule', { name: value.name });
                dispatch(setEditModal({ open: false }));
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
    const handleDiscard = () => {
        dispatch(setEditModal({ open: false }));
        formik.resetForm();
    };
    return (
        <Modal
            open={editModal}
            onClose={() => dispatch(setEditModal({ open: false }))}
            size="xLarge"
            onDiscard={handleDiscard}
            title="Edit Rule"
            onSubmit={() => formik.submitForm()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={formik.values.name && !isBtnDisabled ? false : true}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <FormikProvider value={formik}>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="createLeadRule">Rule Name</label>
                                <input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    id="createLeadRule"
                                    name="name"
                                    type="text"
                                    placeholder="Rule Name"
                                    className="form-input"
                                />
                            </div>
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
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('isLeadAdded', e.target.checked)}
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
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('isEdited', e.target.checked)}
                                                />
                                                <span className="peer-checked:text-success">Lead Edited</span>
                                            </label>
                                        </div>
                                    </div>
                                </section>
                                <div className="flex-1">
                                    <label htmlFor="state">Source</label>
                                    <Select placeholder="Select Source" options={sourceDropdown} onChange={(data: any) => formik.setFieldValue('source', data.value)} />
                                </div>
                            </div>
                            <FieldArray
                                name="steps"
                                render={(arrayHelpers) => (
                                    <div className="my-6">
                                        {formik.values.steps.map((step, index) => (
                                            <div key={index} className="panel my-6">
                                                <div className="my-3 flex">
                                                    <div className="flex-grow"></div>
                                                    <div className="flex gap-8">
                                                        <input
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.steps[index].setDays}
                                                            name={`steps[${index}].setDays`}
                                                            type="number"
                                                            placeholder="Days"
                                                            className="form-input w-[100px]"
                                                            min={0}
                                                            max={30}
                                                        />
                                                        <button type="button" className="btn btn-outline-danger rounded-s-md" onClick={() => arrayHelpers.remove(index)}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex flex-col gap-4  sm:flex-row">
                                                        <div className="flex h-[38px] flex-1 items-center">
                                                            <label className="mb-0 inline-flex" htmlFor={`steps[${index}].sendByEmail`}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="peer form-checkbox outline-primary"
                                                                    id={`steps[${index}].sendByEmail`}
                                                                    name={`steps[${index}].sendByEmail`}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`steps[${index}].sendByEmail`, e.target.checked)}
                                                                />
                                                                <span className="peer-checked:text-primary">Template Send By Email</span>
                                                            </label>
                                                        </div>
                                                        {formik.values.steps[index].sendByEmail && (
                                                            <div className="flex flex-[2] flex-col gap-4 sm:flex-row">
                                                                <div className="flex-1">
                                                                    <Select
                                                                        placeholder="Select Email Template"
                                                                        options={sourceDropdown}
                                                                        onChange={(data: any) => formik.setFieldValue('source', data.value)}
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Select
                                                                        placeholder="Select Smtp Account"
                                                                        options={sourceDropdown}
                                                                        onChange={(data: any) => formik.setFieldValue('source', data.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-4 sm:flex-row">
                                                        <div className="flex  h-[38px] flex-1 items-center">
                                                            <label className="mb-0 inline-flex" htmlFor={`steps[${index}].sendBySms`}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="peer form-checkbox outline-primary"
                                                                    id={`steps[${index}].sendBySms`}
                                                                    name={`steps[${index}].sendBySms`}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`steps[${index}].sendBySms`, e.target.checked)}
                                                                />
                                                                <span className="peer-checked:text-primary">Template Send By SMS</span>
                                                            </label>
                                                        </div>
                                                        {formik.values.steps[index].sendBySms && (
                                                            <div className="flex flex-[2] flex-col gap-4 sm:flex-row">
                                                                <div className="flex-1 ">
                                                                    <Select
                                                                        placeholder="Select SMS Template"
                                                                        options={sourceDropdown}
                                                                        onChange={(data: any) => formik.setFieldValue('source', data.value)}
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Select
                                                                        placeholder="Select Sms API Type"
                                                                        options={sourceDropdown}
                                                                        onChange={(data: any) => formik.setFieldValue('source', data.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-4 sm:flex-row">
                                                        <div className="flex h-[38px] flex-1 items-center">
                                                            <label className="mb-0 inline-flex" htmlFor={`steps[${index}].sendByWhatsapp`}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="peer form-checkbox outline-primary"
                                                                    id={`steps[${index}].sendByWhatsapp`}
                                                                    name={`steps[${index}].sendByWhatsapp`}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`steps[${index}].sendByWhatsapp`, e.target.checked)}
                                                                />
                                                                <span className="peer-checked:text-primary">Template Send By Whatsapp</span>
                                                            </label>
                                                        </div>
                                                        {formik.values.steps[index].sendByWhatsapp && (
                                                            <div className="flex flex-[2] flex-col gap-4 sm:flex-row">
                                                                <div className="flex-1">
                                                                    <Select
                                                                        placeholder="Select Whatsapp Template"
                                                                        options={sourceDropdown}
                                                                        onChange={(data: any) => formik.setFieldValue('source', data.value)}
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Select
                                                                        placeholder="Select Whatsapp API Type"
                                                                        options={sourceDropdown}
                                                                        onChange={(data: any) => formik.setFieldValue('source', data.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="btn btn-primary rounded-full"
                                            onClick={() => arrayHelpers.push({ days: '', sendByEmail: '', sendBySms: '', sendByWhatsapp: '' })}
                                        >
                                            Add Step
                                        </button>
                                    </div>
                                )}
                            />
                        </form>
                    </FormikProvider>
                )
            }
        />
    );
};

export default memo(LeadRuleEditModal);
