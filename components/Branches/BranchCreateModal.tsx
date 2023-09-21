import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/branchSlice';
import { useFormik } from 'formik';
import { branchSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import countryJson from '@/utils/Raw Data/select-address.json';
import { ICountryData, SelectOptionsType } from '@/utils/Types';

const BranchCreateModal = () => {
    const { isFetching, createModal, isBtnDisabled } = useSelector((state: IRootState) => state.branch);
    const [countries, setCountries] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [states, setStates] = useState<SelectOptionsType[] | undefined>([] as SelectOptionsType[]);
    const dispatch = useDispatch();

    const { values, handleChange, submitForm, handleSubmit, setFieldValue, handleBlur, resetForm } = useFormik({
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
                const { address, city, country, name, state } = value;
                const createBranchObj = {
                    name,
                    address,
                    city,
                    state,
                    country,
                };
                await new ApiClient().post('branch', createBranchObj);
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
            setCountries([]);
            setStates([]);
        },
    });
    const handleDiscard = () => {
        dispatch(setCreateModal(false));
        resetForm();
    };
    useEffect(() => {
        const creatCountryJsonList: SelectOptionsType[] = countryJson.countries.map((data: ICountryData) => {
            return { value: data.country, label: data.country };
        });
        setCountries(creatCountryJsonList);

        const findSelectedCountryStates: ICountryData | undefined = countryJson?.countries?.find((data) => {
            return data.country === values.country;
        });

        if (findSelectedCountryStates) {
            const findStates: SelectOptionsType[] = findSelectedCountryStates.states.map((state: string) => {
                return { value: state, label: state };
            });
            setStates(findStates);
        }
    }, [values.country]);


    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={handleDiscard}
            size="large"
            onSubmit={() => submitForm()}
            title="Create Branch"
            isBtnDisabled={values.name && values.address && values.city && values.state && values.country && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
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
                                <Select placeholder="select country" options={countries} onChange={(data: any) => setFieldValue('country', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="state">Select State</label>
                                <Select placeholder="select state" options={states} onChange={(data: any) => setFieldValue('state', data.value)} />
                            </div>
                        </div>
                        <section className="flex flex-col  gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="createBranchCity">City</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.city} id="createBranchCity" name="city" type="text" placeholder="Enter City" className="form-input" />
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

export default memo(BranchCreateModal);
