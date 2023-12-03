/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/campaignSlice';
import { dummyTemplateListRawData, platformListRawData } from '@/utils/Raw Data';
import { useFormik } from 'formik';
import { campaignSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { SelectOptionsType, SourceDataType, ICountryData, UserListSecondaryEndpointType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const CampaignEditModal = () => {
    const { editModal, isBtnDisabled, singleData, isFetching, sourceList } = useSelector((state: IRootState) => state.campaign);

    const dispatch = useDispatch();

    const sourceDropdown: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
        return { value: item.id, label: item.name };
    });

    useEffect(() => {
        const { campaignName, source } = singleData;
        setFieldValue('campaignName', campaignName);
        setFieldValue('source', source);
    }, [singleData]);

    const initialValues = {
        scheduleDateAndTime: '',
        name: '',
    };
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: campaignSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                const editCampaignObj = {
                    scheduleDateAndTime: '',
                    name: '',
                };
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('Campaign/' + singleData.id, editCampaignObj);

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
            title="Edit Scheduled Message"
            onSubmit={() => submitForm()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={values.name && values.scheduleDateAndTime && !isBtnDisabled ? false : true}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="createScheduleName">Schedule Name</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    id="createScheduleName"
                                    name="name"
                                    type="text"
                                    placeholder="Schedule Name"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex-1">
                                <label>Schedule Date & Time</label>
                                <Flatpickr
                                    data-enable-time
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: 'auto',
                                    }}
                                    id="scheduleDateAndTime"
                                    placeholder="Schedule Date & Time"
                                    name="scheduleDateAndTime"
                                    className="form-input"
                                    onChange={(e) => setFieldValue('scheduleDateAndTime', e)}
                                    value={values.scheduleDateAndTime}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="source">Source</label>
                                <Select placeholder="Select Source" options={sourceDropdown} onChange={(data: any) => setFieldValue('source', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="product">Product</label>
                                <Select placeholder="Select Product" options={sourceDropdown} onChange={(data: any) => setFieldValue('product', data.value)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="platform">Platform</label>
                                <Select placeholder="Select PlatForm" options={platformListRawData} onChange={(data: any) => setFieldValue('source', data.value)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="template">Template</label>
                                <div className="flex flex-1 gap-3">
                                    <Select placeholder="Select Template" options={dummyTemplateListRawData} onChange={(data: any) => setFieldValue('template', data.value)} className="flex-1" />
                                    <button type="button" className="btn btn-outline-primary">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(CampaignEditModal);
