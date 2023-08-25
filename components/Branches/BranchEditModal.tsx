/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/branchSlice';
import { countryData, namePrefix } from '@/utils/Raw Data';
import { useFormik } from 'formik';
import { branchSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { BranchDataType, SelectOptionsType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';

const BranchEditModal = () => {
    const editModal: boolean = useSelector((state: IRootState) => state.branch.editModal);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.branch.isBtnDisabled);
    const singleBranch: BranchDataType = useSelector((state: IRootState) => state.branch.singleData);
    const [defaultState, setDefaultState] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultCity, setDefaultCity] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultCountry, setDefaultCountry] = useState<SelectOptionsType>({} as SelectOptionsType);

    const dispatch = useDispatch();
    useEffect(() => {
        setFieldValue('name', singleBranch?.name);
        setFieldValue('address', singleBranch?.address);
        setFieldValue('state', singleBranch?.state);
        setFieldValue('country', singleBranch?.country);
        setFieldValue('city', singleBranch?.city);

        const findState: any = countryData.find((item: SelectOptionsType) => item.value === singleBranch?.state);
        setDefaultState(findState);

        const findCity: any = countryData.find((item: SelectOptionsType) => item.value === singleBranch?.city);
        setDefaultCity(findCity);

        const findCountry: any = countryData.find((item: SelectOptionsType) => item.value === singleBranch.country);
        setDefaultCountry(findCountry);
    }, [singleBranch]);

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
                await new ApiClient().patch('branches/' + singleBranch.id, value);

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
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="createBranch">Branch Name</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="createBranch" name="name" type="text" placeholder="Branch Name" className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="createAddress">Address</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.address} id="createAddress" name="address" type="text" placeholder="Branch Address" className="form-input" />
                    </div>
                    <section className="flex flex-col  gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="country">Select Country</label>
                            <Select placeholder="select country" defaultValue={defaultCountry} options={countryData} onChange={(data: any) => setFieldValue('country', data.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="state">Select State</label>
                            <Select placeholder="select state" defaultValue={defaultState} options={countryData} onChange={(data: any) => setFieldValue('state', data.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="state">Select City</label>
                            <Select placeholder="select city" defaultValue={defaultCity} options={countryData} onChange={(data: any) => setFieldValue('city', data.value)} />
                        </div>
                    </section>
                </form>
            }
        />
    );
};

export default memo(BranchEditModal);
