import { IRootState } from '@/store';
import { ICustomField } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import { useFormik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { getYupSchemaFromMetaData } from './yupValidationSchema';

const CustomFieldsTab = () => {
    const { customFieldsList } = useSelector((state: IRootState) => state.lead);
    const customFieldTabSchema = getYupSchemaFromMetaData(customFieldsList, [], []);

    const { values, handleChange, handleSubmit, setFieldValue, handleBlur, errors, setFieldError } = useFormik({
        initialValues: {} as any,
        validationSchema: customFieldTabSchema,
        validateOnChange: true,
        enableReinitialize: false,
        onSubmit: async (value, action) => {
            // dispatch(setFetching(true));
            try {
                // console.log(createLeadObj);
                // await new ApiClient().post('lead', createLeadObj);
                // console.log(value);
                // action.resetForm();
            } catch (error: any) {
                if (typeof error?.response?.data?.message === 'object') {
                    showToastAlert(error?.response?.data?.message.join(' , '));
                } else {
                    showToastAlert(error?.response?.data?.message);
                }
                showToastAlert(error?.response?.data?.message);
            }
            // dispatch(setDisableBtn(false));
            // dispatch(setFetching(false));
        },
    });

    // Function to evaluate the condition based on the operator
    const evaluateCondition = (value: any, item: ICustomField) => {
        // console.log('value', value[item?.parentId]);
        // console.log('parentValue', item?.parentValue);
        // console.log('operator', item?.operator);

        switch (item?.operator) {
            case 'eq':
                return value[item?.parentId] === item?.parentValue || value[item?.parentId]?.includes(item?.parentValue);
            case 'neq':
                return value[item?.parentId] !== item?.parentValue;
            case 'gt':
                return value[item?.parentId] > item?.parentValue;
            case 'lt':
                return value[item?.parentId] < item?.parentValue;
            case 'gte':
                return value[item?.parentId] >= item?.parentValue;
            case 'lte':
                return value[item?.parentId] <= item?.parentValue;
            default:
                return false;
        }
    };

    // console.log(errors);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {customFieldsList?.map((item: ICustomField, index: number) => {
                        return (
                            ((item?.active && !item?.conditional) || (item?.active && item?.conditional && evaluateCondition(values, item))) && (
                                <div key={index}>
                                    <label htmlFor={item?.id}>
                                        {item?.label} {item?.required && <span className="text-danger">*</span>}
                                    </label>
                                    {item?.fieldType === 'TEXT' && (
                                        <>
                                            <input
                                                onChange={(e) => {
                                                    handleChange(item?.id);
                                                    if (item?.required && !e.target.value.trim()) {
                                                        setFieldError(item?.id, 'Please Enter ' + item?.label);
                                                    } else {
                                                        setFieldError(item?.id, undefined);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    handleBlur(item?.id);
                                                    if (!e.target.value.trim()) {
                                                        setFieldError(item?.id, 'Please Enter ' + item?.label);
                                                    }
                                                }}
                                                name={item?.id}
                                                type="text"
                                                placeholder={item?.label}
                                                className="form-input"
                                            />
                                            {item?.required && <span className="text-sm text-danger">{errors[item?.id]?.toString()}</span>}
                                        </>
                                    )}
                                    {item?.fieldType === 'NUMBER' && (
                                        <>
                                            <input
                                                onChange={(e) => {
                                                    handleChange(item?.id);
                                                    if (item?.required && !e.target.value.trim()) {
                                                        setFieldError(item?.id, 'Please Enter ' + item?.label);
                                                    } else {
                                                        setFieldError(item?.id, undefined);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    handleBlur(item?.id);
                                                    if (!e.target.value.trim()) {
                                                        setFieldError(item?.id, 'Please Enter ' + item?.label);
                                                    }
                                                }}
                                                name={item?.id}
                                                type="number"
                                                placeholder={'Enter ' + item?.label}
                                                className="form-input"
                                            />
                                            {item?.required && <span className="text-sm  text-danger">{errors[item?.id]?.toString()}</span>}
                                        </>
                                    )}
                                    {item?.fieldType === 'FILE' && (
                                        <input onChange={handleChange} onBlur={handleBlur} name={item?.id} type="file" placeholder={'Enter ' + item?.label} className="form-input" />
                                    )}
                                    {item?.fieldType === 'SELECT' && (
                                        <Select
                                            placeholder={`Select ${item?.label}`}
                                            options={item?.options?.map((item) => {
                                                return { label: item.name, value: item.value };
                                            })}
                                            onChange={(data: any) => setFieldValue(item?.id, data.value)}
                                        />
                                    )}
                                    {item?.fieldType === 'DATE' && (
                                        <Flatpickr
                                            data-enable-time
                                            options={{
                                                enableTime: true,
                                                dateFormat: 'Y-m-d H:i',
                                                position: 'auto',
                                            }}
                                            placeholder={`Select ${item?.label}`}
                                            name={item?.id}
                                            className="form-input"
                                            onChange={(e) => setFieldValue(item?.id, e)}
                                        />
                                    )}
                                    {item?.fieldType === 'RADIO' && (
                                        <div className="flex gap-x-5">
                                            {item?.options?.map((item2, index) => {
                                                return (
                                                    <div key={index}>
                                                        <input
                                                            type="radio"
                                                            name={item?.id}
                                                            className="peer form-radio"
                                                            id={item?.id}
                                                            value={item2?.value}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        <label className="inline-flex" htmlFor={item?.id}>
                                                            {item2?.name}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {item?.fieldType === 'CHECKBOX' && (
                                        <div className="flex items-center gap-x-5">
                                            {item?.options?.map((item2, index) => {
                                                return (
                                                    <div key={index}>
                                                        <input
                                                            type="checkbox"
                                                            name={item?.id}
                                                            className="form-checkbox"
                                                            id={item?.id + index}
                                                            value={item2?.value}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        <label className="inline-flex" htmlFor={item?.id}>
                                                            {item2?.name}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        );
                    })}
                </div>
                <input type="submit" className="btn btn-primary" />
            </form>
        </div>
    );
};

export default CustomFieldsTab;
