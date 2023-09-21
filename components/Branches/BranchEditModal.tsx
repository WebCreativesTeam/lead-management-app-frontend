/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/branchSlice';
import { useFormik } from 'formik';
import { branchSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import countryJson from '@/utils/Raw Data/select-address.json';
import { ICountryData, SelectOptionsType } from '@/utils/Types';

const BranchEditModal = () => {
    const { editModal, isBtnDisabled, singleData, isFetching } = useSelector((state: IRootState) => state.branch);
    const [defaultState, setDefaultState] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultCountry, setDefaultCountry] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [countries, setCountries] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [states, setStates] = useState<SelectOptionsType[] | undefined>([] as SelectOptionsType[]);
    const [selectedCountry, setSelectedCountry] = useState<string[]>([]);

    const dispatch = useDispatch();
    useEffect(() => {
        setFieldValue('name', singleData?.name);
        setFieldValue('address', singleData?.address);
        setFieldValue('state', singleData?.state);
        setFieldValue('country', singleData?.country);
        setFieldValue('city', singleData?.city);

        const creatCountryJsonList: SelectOptionsType[] = countryJson.countries.map((data: ICountryData) => {
            return { value: data.country, label: data.country };
        });

        const findSelectedCountryStates: ICountryData | undefined = countryJson?.countries?.find((data) => {
            return data.country === singleData.country;
        });

        if (findSelectedCountryStates) {
            const findStates: SelectOptionsType[] = findSelectedCountryStates.states.map((state: string) => {
                return { value: state, label: state };
            });
            const findState: SelectOptionsType | undefined = findStates.find((item: SelectOptionsType) => item.value === singleData?.state);
            if (findState) {
                setDefaultState(findState);
            }
        }

        const findCountry: SelectOptionsType | undefined = creatCountryJsonList.find((item: SelectOptionsType) => item.value === singleData.country);
        if (findCountry) {
            setDefaultCountry(findCountry);
        }
    }, [singleData]);

    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues: {
            name: '',
            address: '',
            city: '',
            state: '',
            country: '',
        },
        validationSchema: branchSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('branch/' + singleData.id, value);

                action.resetForm();
                dispatch(setEditModal({ open: false }));
            } catch (error: any) {
                if (typeof error?.response?.data?.message === 'object') {
                    showToastAlert(error?.response?.data?.message.join(' , '));
                } else if (error?.response?.data?.message) {
                    showToastAlert(error?.response?.data?.message);
                } else if (error?.response?.data) {
                    showToastAlert(error?.response?.data);
                }
                showToastAlert(error?.response?.data?.message);
            }
            dispatch(setDisableBtn(false));
            dispatch(setFetching(false));
        },
    });

    useEffect(() => {
        const creatCountryJsonList: SelectOptionsType[] = countryJson.countries.map((data: ICountryData) => {
            return { value: data.country, label: data.country };
        });
        setCountries(creatCountryJsonList);

        const findCountry: SelectOptionsType | undefined = creatCountryJsonList.find((item: SelectOptionsType) => item.value === values.country);
        if (findCountry) {
            setDefaultCountry(findCountry);
        }

        const findSelectedCountryStates: ICountryData | undefined = countryJson?.countries?.find((data) => {
            return data.country === values.country;
        });

        if (findSelectedCountryStates) {
            setSelectedCountry(findSelectedCountryStates.states);
        }

        if (findSelectedCountryStates) {
            const findStates: SelectOptionsType[] = findSelectedCountryStates.states.map((state: string) => {
                return { value: state, label: state };
            });
            setStates(findStates);
        }
    }, [values.country]);

    const handleDiscard = () => {
        dispatch(setEditModal({ open: false }));
        resetForm();
    };

    return (
        <Modal
            open={editModal}
            onClose={() => dispatch(setEditModal({ open: false }))}
            size="large"
            onDiscard={handleDiscard}
            title="Edit Branch"
            onSubmit={() => submitForm()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={values.name && values.address && values.city && values.state && values.country && !isBtnDisabled ? false : true}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="createBranch">Branch Name</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="createBranch" name="name" type="text" placeholder="Branch Name" className="form-input" />
                        </div>
                        <div className="flex flex-col  gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="country">Select Country</label>
                                <Select placeholder="select country" defaultValue={defaultCountry} options={countries} onChange={(data: any) => setFieldValue('country', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="state">Select State</label>
                                <Select
                                    placeholder="select state"
                                    value={selectedCountry.includes(defaultState.value) ? defaultState : null}
                                    options={states}
                                    onChange={(data: any) => {
                                        setFieldValue('state', data.value);
                                        setDefaultState({ value: data.value, label: data.value });
                                    }}
                                />
                            </div>
                        </div>
                        <section className="flex flex-col  gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="updateBranchCity">City</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.city} id="updateBranchCity" name="city" type="text" placeholder="Enter City" className="form-input" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="createAddress">Address</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                    id="createAddress"
                                    name="address"
                                    type="text"
                                    placeholder="Branch Address"
                                    className="form-input"
                                />
                            </div>
                        </section>
                    </form>
                )
            }
        />
    );
};

export default memo(BranchEditModal);
