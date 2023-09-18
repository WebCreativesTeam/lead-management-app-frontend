import React, { memo } from 'react';
import Modal from '../__Shared/Modal';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/branchSlice';
import { countryData } from '@/utils/Raw Data';
import { useFormik } from 'formik';
import { branchSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';

const BranchCreateModal = () => {
    const createModal: boolean = useSelector((state: IRootState) => state.branch.createModal);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.branch.isBtnDisabled);
    const dispatch = useDispatch();

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
        },
    });
    const handleDiscard = () => {
        dispatch(setCreateModal(false));
        resetForm();
    };
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
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="createBranch">Branch Name</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="createBranch" name="name" type="text" placeholder="Branch Name" className="form-input" />
                    </div>
                    <div className="flex flex-col  gap-4 sm:flex-row">
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
                        <div className="flex-1">
                            <label htmlFor="country">Select Country</label>
                            <Select placeholder="select country" options={countryData} onChange={(data: any) => setFieldValue('country', data.value)} />
                        </div>
                    </div>
                    <section className="flex flex-col  gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="state">Select State</label>
                            <Select placeholder="select state" options={countryData} onChange={(data: any) => setFieldValue('state', data.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="state">Select City</label>
                            <Select placeholder="select city" options={countryData} onChange={(data: any) => setFieldValue('city', data.value)} />
                        </div>
                    </section>
                </form>
            }
        />
    );
};

export default memo(BranchCreateModal);
