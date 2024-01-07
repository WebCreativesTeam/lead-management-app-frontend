import { IRootState } from '@/store';
import { ICustomField } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { getYupSchemaFromMetaData } from './yupValidationSchema';
import { setEditModal } from '@/store/Slices/leadSlice/manageLeadSlice';

const EditCustomFieldsTab: React.FC = () => {
    const { customFieldsList, singleData, leadNoteList } = useSelector((state: IRootState) => state.lead);
    const customFieldTabSchema = getYupSchemaFromMetaData(customFieldsList, [], []);
    const [errorObj, setErrorObj] = useState({} as any);
    const dispatch = useDispatch();

    const { values, handleChange, handleSubmit, setFieldValue, handleBlur, setFieldTouched, touched, submitForm } = useFormik({
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
            case 'eq': {
                // if (value[item?.parentId] === item?.parentValue || value[item?.parentId]?.includes(item?.parentValue)) {
                //     setErrorObj((preVal: any) => {
                //         return { ...preVal, [item?.id]: `${item?.label} is required` };
                //     });
                // }
                return value[item?.parentId] === item?.parentValue || value[item?.parentId]?.includes(item?.parentValue);
            }
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

    useEffect(() => {
        let createErrorObj = {} as any;
        for (let index = 0; index < customFieldsList.length; index++) {
            if (!customFieldsList[index].conditional && customFieldsList[index].required && customFieldsList[index].active) {
                createErrorObj[customFieldsList[index].id] = `${customFieldsList[index].label} is Required`;
            }
        }
        setErrorObj(createErrorObj);
    }, [customFieldsList]);


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
                                                onChange={
                                                    //     (e) => {
                                                    //     handleChange(item?.id);
                                                    //     if (e.target.value.trim().length > 0 && item?.required) {
                                                    //         setErrorObj((preVal: any) => {
                                                    //             return { ...preVal, [item?.id]: undefined };
                                                    //         });
                                                    //     } else {
                                                    //         setErrorObj((preVal: any) => {
                                                    //             return { ...preVal, [item?.id]: `${item?.label} is required` };
                                                    //         });
                                                    //     }
                                                    // }
                                                    handleChange
                                                }
                                                onBlur={(e) => {
                                                    handleBlur(item?.id);
                                                    setFieldTouched(item?.id, true);
                                                    if (!e.target.value.trim() && item?.required) {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: `${item?.label} is required` };
                                                        });
                                                    } else {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: undefined };
                                                        });
                                                    }
                                                }}
                                                name={item?.id}
                                                type="text"
                                                placeholder={item?.label}
                                                className="form-input"
                                                defaultValue={singleData.customFields[item?.id]}
                                            />
                                            {item?.required && touched[item?.id] && errorObj[item?.id]?.length > 0 && <span className="text-sm text-danger">{errorObj[item?.id]?.toString()}</span>}
                                        </>
                                    )}
                                    {item?.fieldType === 'NUMBER' && (
                                        <>
                                            <input
                                                onChange={
                                                    // (e) => {
                                                    // handleChange(item?.id);
                                                    // if (e.target.value.trim().length > 0 && item?.required) {
                                                    //     setErrorObj((preVal: any) => {
                                                    //         return { ...preVal, [item?.id]: undefined };
                                                    //     });
                                                    // } else {
                                                    //     setErrorObj((preVal: any) => {
                                                    //         return { ...preVal, [item?.id]: `${item?.label} is required` };
                                                    //     });
                                                    // }
                                                    // }
                                                    handleChange
                                                }
                                                onBlur={(e) => {
                                                    setFieldTouched(item?.id, true);
                                                    handleBlur(item?.id);
                                                    if (!e.target.value.trim()) {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: `${item?.label} is required` };
                                                        });
                                                    } else {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: undefined };
                                                        });
                                                    }
                                                }}
                                                name={item?.id}
                                                type="number"
                                                placeholder={'Enter ' + item?.label}
                                                className="form-input"
                                                defaultValue={singleData.customFields[item?.id]}
                                            />
                                            {item?.required && touched[item?.id] && errorObj[item?.id] && <span className="text-sm  text-danger">{errorObj[item?.id]?.toString()}</span>}
                                        </>
                                    )}
                                    {item?.fieldType === 'FILE' && (
                                        <input onChange={handleChange} onBlur={handleBlur} name={item?.id} type="file" placeholder={'Enter ' + item?.label} className="form-input" />
                                    )}
                                    {item?.fieldType === 'SELECT' && (
                                        <>
                                            <Select
                                                placeholder={`Select ${item?.label}`}
                                                options={item?.options?.map((item) => {
                                                    return { label: item.name, value: item.value };
                                                })}
                                                onChange={(data: any) => {
                                                    setFieldValue(item?.id, data.value);
                                                    if (data?.value && item?.required) {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: undefined };
                                                        });
                                                    }
                                                }}
                                                onBlur={() => {
                                                    setFieldTouched(item?.id, true);
                                                    if (!values[item?.id] && item?.required) {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: `${item?.label} is required` };
                                                        });
                                                    }
                                                }}
                                                defaultValue={{ value: singleData.customFields[item?.id], label: singleData.customFields[item?.id] }}
                                            />
                                            {item?.required && touched[item?.id] && errorObj[item?.id] && <span className="text-sm text-danger">{errorObj[item?.id]?.toString()}</span>}
                                        </>
                                    )}
                                    {item?.fieldType === 'DATE' && (
                                        <>
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
                                                onChange={(e) => {
                                                    setFieldValue(item?.id, e[0].toISOString());
                                                    if (e[0].toISOString() && item?.required) {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: undefined };
                                                        });
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    setFieldTouched(item?.id, true);
                                                    if ((!e.target.value || !singleData.customFields[item?.id]) && item?.required) {
                                                        setErrorObj((preVal: any) => {
                                                            return { ...preVal, [item?.id]: `${item?.label} is required` };
                                                        });
                                                    }
                                                }}
                                                defaultValue={singleData.customFields[item?.id]}
                                            />
                                            {item?.required && touched[item?.id] && errorObj[item?.id] && <span className="text-sm text-danger">{errorObj[item?.id]?.toString()}</span>}
                                        </>
                                    )}
                                    {item?.fieldType === 'RADIO' && (
                                        <>
                                            <div className="flex flex-wrap gap-x-5">
                                                {item?.options?.map((item2, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <input
                                                                type="radio"
                                                                name={item?.id}
                                                                className="peer form-radio"
                                                                id={item?.id}
                                                                value={item2?.value}
                                                                // defaultChecked={item2.value === }
                                                                onChange={(e) => {
                                                                    handleChange(item?.id);
                                                                    if (e.target.value && item?.required) {
                                                                        setErrorObj((preVal: any) => {
                                                                            return { ...preVal, [item?.id]: undefined };
                                                                        });
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    setFieldTouched(item?.id, true);
                                                                    if (e.target.value && item?.required) {
                                                                        setErrorObj((preVal: any) => {
                                                                            return { ...preVal, [item?.id]: undefined };
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            <label className="inline-flex">{item2?.name}</label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {item?.required && touched[item?.id] && errorObj[item?.id] && <div className="text-sm text-danger">{errorObj[item?.id]?.toString()}</div>}
                                        </>
                                    )}
                                    {item?.fieldType === 'CHECKBOX' && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-x-5">
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
                                                                onBlur={() => {
                                                                    setFieldTouched(item?.id, true);
                                                                    if (values[item?.id]?.length > 0) {
                                                                        setErrorObj((preVal: any) => {
                                                                            return { ...preVal, [item?.id]: undefined };
                                                                        });
                                                                    } else {
                                                                        setErrorObj((preVal: any) => {
                                                                            return { ...preVal, [item?.id]: `${item?.label} is required` };
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            <label className="inline-flex" htmlFor={item?.id}>
                                                                {item2?.name}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {item?.required && touched[item.id] && errorObj[item?.id] && <span className="text-sm  text-danger">{errorObj[item?.id]?.toString()}</span>}
                                        </>
                                    )}
                                </div>
                            )
                        );
                    })}
                </div>
                <div className="mt-8 flex items-center justify-end">
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                            dispatch(setEditModal({ open: false }));
                        }}
                        disabled={false}
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        className="btn  btn-primary cursor-pointer ltr:ml-4 rtl:mr-4"
                        disabled={!Object.values(errorObj).every((value) => value === undefined)}
                        onClick={() => submitForm()}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCustomFieldsTab;
