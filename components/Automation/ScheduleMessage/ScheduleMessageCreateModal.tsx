import React, { memo } from 'react';
import Modal from '../../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/automationSlice/scheduleMessageSlice';
import { useFormik } from 'formik';
import { scheduleMessageSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../../__Shared/Loader';
import { SelectOptionsType, SourceDataType } from '@/utils/Types';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import 'flatpickr/dist/flatpickr.css';
import { dummyTemplateListRawData, platformListRawData } from '@/utils/Raw Data';

const ScheduleMessageCreateModal = () => {
    const { createModal, isBtnDisabled, isFetching, sourceList } = useSelector((state: IRootState) => state.scheduleMessage);

    const dispatch = useDispatch();
    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm, setFieldValue } = useFormik({
        initialValues: {
            scheduleDateAndTime: '',
            name: '',
        },
        validationSchema: scheduleMessageSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('scheduleMessage', { name: value.name });
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

    const sourceDropdown: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
        return { value: item.id, label: item.name };
    });

    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={() => {
                dispatch(setCreateModal(false));
                resetForm();
            }}
            size="large"
            onSubmit={() => submitForm()}
            title="Add Schedule Message"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
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

export default memo(ScheduleMessageCreateModal);
