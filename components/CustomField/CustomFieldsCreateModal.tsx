import React, { memo, useEffect, useState } from 'react';
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
import { FieldTypesList, OperatorsList } from '@/utils/Raw Data';
import ToggleSwitch from '../__Shared/ToggleSwitch';
import { ICustomField, IFiedlListType, SelectOptionsType } from '@/utils/Types';

type Options = {
    name: string;
    value: string;
};

const CreateCustomFieldModal = () => {
    const { createModal, isBtnDisabled, isFetching, fieldsList } = useSelector((state: IRootState) => state.customField);
    const [fieldsListDropdown, setFieldsListDropdown] = useState<SelectOptionsType[]>([]);
    const [parentFieldDropdown, setParentFieldDropdown] = useState<SelectOptionsType[]>([]);
    const [fieldType, setFieldType] = useState<string>('');

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            label: '',
            fieldType: '',
            order: '',
            withCondition: false,
            options: [
                {
                    name: '',
                    value: '',
                },
            ],
            field: '',
            parentValue: '',
            isActive: false,
            isRequired: false,
            operator: '',
        },
        validationSchema: customFieldSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                const createCustomFieldObject: any = {
                    label: value.label,
                    fieldType: value.fieldType,
                    order: Math.abs(+value.order).toString(),
                    required: value.isRequired,
                    active: value.isActive,
                };

                if (value.withCondition && (value.fieldType === 'SELECT' || value.fieldType === 'CHECKBOX' || value.fieldType === 'RADIO')) {
                    createCustomFieldObject.options = value.options;
                    createCustomFieldObject.operator = value.operator;
                    createCustomFieldObject.parentId = value.field;
                    createCustomFieldObject.conditional = true;
                    createCustomFieldObject.parentValue = value.parentValue;
                } else if (value.withCondition) {
                    createCustomFieldObject.operator = value.operator;
                    createCustomFieldObject.parentId = value.field;
                    createCustomFieldObject.conditional = true;
                    createCustomFieldObject.parentValue = value.parentValue;
                } else if (value.fieldType === 'SELECT' || value.fieldType === 'CHECKBOX' || value.fieldType === 'RADIO') {
                    createCustomFieldObject.options = value.options;
                }

                console.log(createCustomFieldObject);

                dispatch(setDisableBtn(true));
                await new ApiClient().post('custom-field', createCustomFieldObject);
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

    console.log(formik.values);
    useEffect(() => {
        const createFieldListDropdown: SelectOptionsType[] = fieldsList?.map(({ id, label }: IFiedlListType) => {
            return { label, value: id };
        });
        setFieldsListDropdown(createFieldListDropdown);
    }, [fieldsList]);

    const getCustomFieldById = async (id: string) => {
        const res: { status: string; data: ICustomField } = await new ApiClient().get('custom-field/' + id);
        const customField: ICustomField = res?.data;
        if (typeof customField === 'undefined') {
            alert('undefined');
            return;
        }
        setFieldType(customField.fieldType);
        if (customField.fieldType === 'SELECT' || customField.fieldType === 'CHECKBOX' || customField.fieldType === 'RADIO') {
            const parentValueDropdown: SelectOptionsType[] = customField?.options?.map(({ name, value }: Options) => {
                return { label: name, value };
            });
            setParentFieldDropdown(parentValueDropdown);
        }
    };

    const { field, label, operator, order, parentValue, withCondition } = formik.values;

    useEffect(() => {
        if (withCondition && (!field || !operator || !parentValue)) {
            dispatch(setDisableBtn(true));
        } else {
            dispatch(setDisableBtn(false));
        }
    }, [dispatch, field, operator, parentValue, withCondition]);

    useEffect(() => {
        if (withCondition) {
            formik.setFieldValue('field', '');
            formik.setFieldValue('parentValue', '');
            formik.setFieldValue('operator', '');
        }
    }, [withCondition]);

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
            isBtnDisabled={label && formik.values.fieldType && order && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <FormikProvider value={formik}>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div className="flex flex-col  gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="fieldLabel">Label</label>
                                    <input
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.label}
                                        id="fieldLabel"
                                        name="label"
                                        type="text"
                                        placeholder="Enter Label"
                                        className="form-input"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="country">Field Type</label>
                                    <Select
                                        placeholder="Field Type"
                                        options={FieldTypesList}
                                        onChange={(data: any) => {
                                            formik.setFieldValue('fieldType', data.value);
                                        }}
                                    />
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
                            {(formik.values.fieldType === 'SELECT' || formik.values.fieldType === 'CHECKBOX' || formik.values.fieldType === 'RADIO') && (
                                <FieldArray
                                    name="options"
                                    render={(arrayHelpers) => (
                                        <div className="my-6">
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary rounded"
                                                    onClick={() => arrayHelpers.push({ name: '', value: '' })}
                                                    disabled={!formik.values.options[formik.values.options.length - 1].name && !formik.values.options[formik.values.options.length - 1].value}
                                                >
                                                    Add Options
                                                </button>
                                            </div>
                                            {formik.values.options.map((options, index) => (
                                                <div key={index} className="panel my-6">
                                                    <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                                                        <div className="flex-1">
                                                            <label htmlFor={`textForOption${index + 1}`}>Text For Option {index + 1}</label>
                                                            <input
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.options[index].name}
                                                                id={`textForOption${index + 1}`}
                                                                name={`options[${index}].name`}
                                                                type="text"
                                                                placeholder={`Enter text for option ${index + 1}`}
                                                                className="form-input"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor={`valueForOption${index + 1}`}>Value For Option {index + 1}</label>
                                                            <input
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.options[index].value}
                                                                id={`valueForOption${index + 1}`}
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
                                            ))}
                                        </div>
                                    )}
                                />
                            )}

                            <div className="flex flex-col  gap-4 sm:flex-row">
                                <label className="inline-flex flex-1">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        name="isRequired"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('isRequired', e.target.checked)}
                                        checked={formik.values.isRequired}
                                    />
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('isActive', e.target.checked)}
                                            checked={formik.values.isActive}
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
                                            name="withCondition"
                                            checked={formik.values.withCondition}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('withCondition', e.target.checked)}
                                        />
                                        <ToggleSwitch />
                                    </label>
                                </div>
                            </div>
                            {formik.values.withCondition && (
                                <div className="flex flex-col  gap-4 sm:flex-row">
                                    <div className="flex-1">
                                        <label htmlFor="Field">Field</label>
                                        <Select
                                            placeholder="Field"
                                            options={fieldsListDropdown}
                                            onChange={(data: any) => {
                                                formik.setFieldValue('field', data.value);
                                                getCustomFieldById(data.value);
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="parentValue">Parent Field Value</label>
                                        {fieldType === 'SELECT' || fieldType === 'CHECKBOX' || fieldType === 'RADIO' ? (
                                            <Select placeholder="Parent Field Value" options={parentFieldDropdown} onChange={(data: any) => formik.setFieldValue('parentValue', data.value)} />
                                        ) : (
                                            <input
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.parentValue}
                                                id="parentValue"
                                                name="parentValue"
                                                type="text"
                                                placeholder="Enter Parent Field Value"
                                                className="form-input"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="country">Operator</label>
                                        <Select placeholder="Operator" options={OperatorsList} onChange={(data: any) => formik.setFieldValue('operator', data.value)} isSearchable={false} />
                                    </div>
                                </div>
                            )}
                        </form>
                    </FormikProvider>
                )
            }
        />
    );
};

export default memo(CreateCustomFieldModal);
