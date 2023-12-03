import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/customFieldSlice';
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

const EditCustomFieldModal = () => {
    const { editModal, isBtnDisabled, isFetching, fieldsList, singleData } = useSelector((state: IRootState) => state.customField);
    const [fieldsListDropdown, setFieldsListDropdown] = useState<SelectOptionsType[]>([]);
    const [parentFieldDropdown, setParentFieldDropdown] = useState<SelectOptionsType[]>([]);
    const [defaultFieldType, setDefaultFieldType] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultField, setDefaultField] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultOperator, setDefaultOperator] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultParentValue, setDefaultParentValue] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [parentFieldType, setParentFieldType] = useState<string>('');

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            label: '',
            fieldType: '',
            order: '',
            withCondition: singleData.conditional,
            options: [
                {
                    name: '',
                    value: '',
                },
            ],
            field: '',
            parentValue: '',
            isActive: singleData.active,
            isRequired: singleData.required,
            operator: '',
        },
        validationSchema: customFieldSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                const editCustomFieldObject: any = {
                    label: value.label,
                    fieldType: value.fieldType,
                    order: Math.abs(+value.order).toString(),
                    required: value.isRequired,
                    active: value.isActive,
                };

                if (value.withCondition && (value.fieldType === 'SELECT' || value.fieldType === 'CHECKBOX' || value.fieldType === 'RADIO')) {
                    editCustomFieldObject.options = value.options;
                    editCustomFieldObject.operator = value.operator;
                    editCustomFieldObject.parentId = value.field;
                    editCustomFieldObject.conditional = true;
                    editCustomFieldObject.parentValue = value.parentValue;
                } else if (value.withCondition) {
                    editCustomFieldObject.operator = value.operator;
                    editCustomFieldObject.parentId = value.field;
                    editCustomFieldObject.conditional = true;
                    editCustomFieldObject.parentValue = value.parentValue;
                } else if (value.fieldType === 'SELECT' || value.fieldType === 'CHECKBOX' || value.fieldType === 'RADIO') {
                    editCustomFieldObject.options = value.options;
                }

                dispatch(setDisableBtn(true));
                await new ApiClient().patch('custom-field/' + singleData.id, editCustomFieldObject);
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
    useEffect(() => {
        const createFieldListDropdown: SelectOptionsType[] = fieldsList?.map(({ id, label }: IFiedlListType) => {
            return { label, value: id };
        });
        setFieldsListDropdown(createFieldListDropdown);
    }, [fieldsList]);

    // console.log('singleData', singleData);
    console.log('ParentFieldDropdown', parentFieldDropdown);

    const getCustomFieldById = async (id: string | undefined) => {
        setIsLoading(true);
        if (id) {
            const res: { status: string; data: ICustomField } = await new ApiClient().get('custom-field/' + id);
            const customField: ICustomField = res?.data;
            if (typeof customField === 'undefined') {
                setIsLoading(false);
                return;
            }
            setParentFieldType(customField?.fieldType);
            if (customField.fieldType === 'SELECT' || customField.fieldType === 'CHECKBOX' || customField.fieldType === 'RADIO') {
                const parentValueDropdown: SelectOptionsType[] = customField?.options?.map(({ name, value }: Options) => {
                    return { label: name, value };
                });
                setParentFieldDropdown(parentValueDropdown);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getCustomFieldById(singleData.parentId);
    }, [singleData?.parentId]);
    useEffect(() => {
        const findDefualtFieldType: SelectOptionsType | undefined = FieldTypesList.find((item: SelectOptionsType) => item.value === singleData?.fieldType);
        if (findDefualtFieldType) {
            setDefaultFieldType(findDefualtFieldType);
        }
        const findDefualtField: SelectOptionsType | undefined = fieldsListDropdown.find((item: SelectOptionsType) => item.value === singleData.parentId);
        if (findDefualtField) {
            setDefaultField(findDefualtField);
        }
        const findDefualtOperator: SelectOptionsType | undefined = OperatorsList.find((item: SelectOptionsType) => item.value === singleData.operator);
        if (findDefualtOperator) {
            setDefaultOperator(findDefualtOperator);
        }

        formik.setFieldValue('operator', defaultOperator.value);
        formik.setFieldValue('label', singleData.label);
        formik.setFieldValue('order', singleData.order);
        formik.setFieldValue('fieldType', singleData.fieldType);
        formik.setFieldValue('field', singleData.parentId);
        formik.setFieldValue('options', singleData.options);
        if (singleData.fieldType === 'SELECT' || singleData.fieldType === 'CHECKBOX' || singleData.fieldType === 'RADIO') {
            const findDefualtParentValue: SelectOptionsType | undefined = parentFieldDropdown.find((item: SelectOptionsType) => item.value === singleData?.parentValue);
            if (findDefualtParentValue) {
                setDefaultParentValue(findDefualtParentValue);
            }
        } else {
            formik.setFieldValue('parentValue', singleData.parentValue);
        }
    }, [defaultOperator, fieldsListDropdown, singleData, parentFieldDropdown, defaultParentValue]);

    const { field, label, operator, options, order, parentValue, withCondition } = formik.values;

    useEffect(() => {
        if (
            (formik.values.fieldType === 'SELECT' || formik.values.fieldType === 'CHECKBOX' || formik.values.fieldType === 'RADIO') &&
            !options[options.length - 1].name &&
            !options[options.length - 1].value
        ) {
            dispatch(setDisableBtn(true));
        } else {
            dispatch(setDisableBtn(false));
        }
    }, [dispatch, formik.values.fieldType, options]);

    useEffect(() => {
        if (withCondition && (!field || !operator || !parentValue)) {
            dispatch(setDisableBtn(true));
        } else {
            dispatch(setDisableBtn(false));
        }
    }, [dispatch, field, operator, parentValue, withCondition]);

    console.log(defaultParentValue.label);
    return (
        <Modal
            open={editModal}
            onClose={() => {
                dispatch(setEditModal({ open: false }));
            }}
            onDiscard={() => {
                dispatch(setEditModal({ open: false }));
                formik.resetForm();
            }}
            size="large"
            onSubmit={() => formik.submitForm()}
            title="Edit Custom Fields"
            isBtnDisabled={label && formik.values.fieldType && order && !isBtnDisabled ? false : true}
            content={
                isFetching || isLoading ? (
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
                                        defaultValue={defaultFieldType}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="editOrder">Order</label>
                                    <input
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.order}
                                        id="editOrder"
                                        name="order"
                                        type="text"
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
                                                    disabled={!formik.values.options[formik.values.options.length - 1].name || !formik.values.options[formik.values.options.length - 1].value}
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
                                            defaultValue={defaultField}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="parentValue">Parent Field Value</label>
                                        {parentFieldType === 'SELECT' || parentFieldType === 'CHECKBOX' || parentFieldType === 'RADIO' ? (
                                            defaultParentValue.label && (
                                                <Select
                                                    placeholder="Parent Field Value"
                                                    options={parentFieldDropdown}
                                                    onChange={(data: any) => formik.setFieldValue('parentValue', data.value)}
                                                    defaultValue={defaultParentValue}
                                                />
                                            )
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
                                        <Select
                                            placeholder="Operator"
                                            options={OperatorsList}
                                            onChange={(data: any) => formik.setFieldValue('operator', data.value)}
                                            isSearchable={false}
                                            defaultValue={defaultOperator}
                                        />
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

export default memo(EditCustomFieldModal);
