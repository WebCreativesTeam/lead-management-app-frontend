import React, { memo } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/customFieldSlice';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { customFieldSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import Select from 'react-select';
import { FieldTypesList } from '@/utils/Raw Data';
import ToggleSwitch from '../__Shared/ToggleSwitch';

const CreateCustomFieldModal = () => {
    const { createModal, isBtnDisabled, isFetching } = useSelector((state: IRootState) => state.customField);

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            label: '',
            fieldType: '',
            order: '',
            withCondition: false,
            options: [
                {
                    text: '',
                    value: '',
                },
            ],
        },
        validationSchema: customFieldSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('customField', { name: value.label });
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
                formik.resetForm();
            }}
            size="large"
            onSubmit={() => formik.submitForm()}
            title="Create Custom Field"
            isBtnDisabled={formik.values.label && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <FormikProvider value={formik}>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div className="flex flex-col  gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="createLabel">Label</label>
                                    <input
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.label}
                                        id="createLabel"
                                        name="label"
                                        type="text"
                                        placeholder="Enter Label"
                                        className="form-input"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="country">Field Type</label>
                                    <Select placeholder="Field Type" options={FieldTypesList} onChange={(data: any) => formik.setFieldValue('fieldType', data.value)} />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="createOrder">Order</label>
                                    <input
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.order}
                                        id="createOrder"
                                        name="order"
                                        type="number"
                                        placeholder="Enter Order"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            {(formik.values.fieldType === 'Dropdown' || formik.values.fieldType === 'Checkbox' || formik.values.fieldType === 'radioButton') && (
                                <FieldArray
                                    name="options"
                                    render={(arrayHelpers) => (
                                        <div className="my-6">
                                            <div className="flex justify-end">
                                                <button type="button" className="btn btn-primary rounded" onClick={() => arrayHelpers.push({ text: '', value: '' })}>
                                                    Add Options
                                                </button>
                                            </div>
                                            {formik.values.options.map((options, index) => (
                                                <div key={index} className="panel my-6">
                                                    <div className="flex flex-col gap-5">
                                                        <div className="flex flex-col   gap-4 sm:flex-row">
                                                            <div className="flex flex-[2] flex-col gap-4 sm:flex-row">
                                                                <div className="flex-1">
                                                                    <label htmlFor="textForOption1">Text For Option {index + 1}</label>
                                                                    <input
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={formik.values.options[index].text}
                                                                        id="textForOption1"
                                                                        name={`options[${index}].text`}
                                                                        type="text"
                                                                        placeholder={`Enter text for option ${index + 1}`}
                                                                        className="form-input"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label htmlFor="valueForOption1">Value For Option {index + 1}</label>
                                                                    <input
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={formik.values.options[index].value}
                                                                        id="valueForOption1"
                                                                        name={`options[${index}].value`}
                                                                        type="text"
                                                                        placeholder={`Enter value for option ${index + 1}`}
                                                                        className="form-input"
                                                                    />
                                                                </div>
                                                                <div className="flex items-end">
                                                                    <button type="button" className="btn btn-outline-danger" onClick={() => arrayHelpers.remove(index)}>
                                                                        X
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            )}

                            <div className="flex flex-col  gap-4 sm:flex-row">
                                <label className="inline-flex flex-1">
                                    <input type="checkbox" className="form-checkbox" defaultChecked />
                                    <span>Required</span>
                                </label>

                                <div className="flex flex-1 gap-5">
                                    <span>Is Active</span>
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id="custom_switch_checkbox1"
                                            name="isActive"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => null}
                                        />
                                        <ToggleSwitch />
                                    </label>
                                </div>

                                <div className="flex flex-1 gap-5">
                                    <span>Add Condition</span>
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id="custom_switch_checkbox1"
                                            name="addCondition"
                                            checked={formik.values.withCondition}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('withCondition', e.target.checked)}
                                        />
                                        <ToggleSwitch />
                                    </label>
                                </div>
                            </div>
                        </form>
                    </FormikProvider>
                )
            }
        />
    );
};

export default memo(CreateCustomFieldModal);
