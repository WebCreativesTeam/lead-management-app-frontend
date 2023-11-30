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

    const { values, handleChange, handleSubmit, setFieldValue, handleBlur, errors } = useFormik({
        initialValues: {},
        validationSchema: customFieldTabSchema,
        validateOnChange: true,
        // enableReinitialize: true,
        onSubmit: async (value, action) => {
            // dispatch(setFetching(true));
            try {
                // console.log(createLeadObj);
                // await new ApiClient().post('lead', createLeadObj);
                console.log(value);
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
    console.log(values);
    return (
        <div>
            Errors: {JSON.stringify(errors)}
            <form onSubmit={handleSubmit}>
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {customFieldsList?.map((item: ICustomField, index: number) => {
                        return (
                            item?.active &&
                            !item?.conditional && (
                                <div key={index}>
                                    <label htmlFor={item?.id}>{item?.label}</label>
                                    {item?.fieldType === 'TEXT' && item?.active && (
                                        <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // value={values.id}
                                            name={`${item?.id}&${item?.label}`}
                                            type="text"
                                            placeholder={item?.label}
                                            className="form-input"
                                        />
                                    )}
                                    {item?.fieldType === 'NUMBER' && item?.active && (
                                        <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // value={values.id}
                                            id={item?.id}
                                            name={`${item?.id}&${item?.label}`}
                                            type="number"
                                            placeholder={'Enter ' + item?.label}
                                            className="form-input"
                                        />
                                    )}
                                    {item?.fieldType === 'FILE' && item?.active && (
                                        <input
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // value={values.id}
                                            id={item?.id}
                                            name={`${item?.id}&${item?.label}`}
                                            type="file"
                                            placeholder={'Enter ' + item?.label}
                                            className="form-input"
                                        />
                                    )}
                                    {item?.fieldType === 'SELECT' && item?.active && (
                                        <Select
                                            placeholder={`Select ${item?.label}`}
                                            options={item?.options?.map((item) => {
                                                return { label: item.name, value: item.value };
                                            })}
                                            onChange={(data: any) => setFieldValue(`${item?.id}&${item?.label}`, data.value)}
                                        />
                                    )}
                                    {item?.fieldType === 'DATE' && item?.active && (
                                        <Flatpickr
                                            data-enable-time
                                            options={{
                                                enableTime: true,
                                                dateFormat: 'Y-m-d H:i',
                                                position: 'auto',
                                            }}
                                            id={item?.id}
                                            placeholder={`Select ${item?.label}`}
                                            name={`${item?.id}&${item?.label}`}
                                            className="form-input"
                                            onChange={(e) => setFieldValue(item?.id, e)}
                                            // value={values.startDate}
                                        />
                                    )}
                                    {item?.fieldType === 'RADIO' && item?.active && (
                                        <div className="flex gap-x-5">
                                            {item?.options?.map((item2, index) => {
                                                return (
                                                    <div key={index}>
                                                        <input
                                                            type="radio"
                                                            name={`${item?.id}&${item?.label}`}
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
                                    {item?.fieldType === 'CHECKBOX' && item?.active && (
                                        <div className="flex items-center gap-x-5">
                                            {item?.options?.map((item2, index) => {
                                                return (
                                                    <div key={index}>
                                                        <input
                                                            type="checkbox"
                                                            name={`${item?.id}&${item2?.value}`}
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
