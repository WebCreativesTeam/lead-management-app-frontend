import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, IRootState } from '@/store';
import { getCustomDateFieldsList, setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/campaignSlice';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { campaignSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import { ICustomField, ILeadStatus, LeadStatusSecondaryEndpoint, SourceDataType } from '@/utils/Types';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import 'flatpickr/dist/flatpickr.css';
import { campaignTypeList, platformListRawData, sendToDropdown } from '@/utils/Raw Data';
import ToggleSwitch from '../__Shared/ToggleSwitch';

type SelectOptionsType = {
    value: string;
    label: string;
};

const CampaignCreateModal = () => {
    const { createModal, isBtnDisabled, isFetching, sourceList, customDateFields, leadStatusList } = useSelector((state: IRootState) => state.campaign);
    const [customFieldList, setCustomFieldList] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [leadStatusDropdown, setLeadStatusDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

    const dispatch = useDispatch<AppDispatch>();
    const formik = useFormik({
        initialValues: {
            date: '',
            name: '',
            hour: '',
            sendAfter: '',
            sendBefore: '',
            type: '',
            customDate: '',
            sendTo: '',
            statusId: '',
            isActive: false,
            instance: [
                {
                    platform: '',
                    templateId: '',
                },
            ],
            sourceId: '',
            productId: '',
        },
        validationSchema: campaignSchema,
        validateOnChange: true,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            const campaignCreateObj: any = {
                name: value.name,
                hour: value.hour,
                type: value.type,
                sendTo: value.sendTo,
                sourceId: value.sourceId,
                productId: value.productId,
                instance: value.instance,
                isActive: value.isActive,
            };
            if (value.type === 'SCHEDULED') {
                campaignCreateObj.date = value.date;
            } else if (value.type === 'DRIP') {
                campaignCreateObj.sendAfter = value.sendAfter.toString();
            } else {
                campaignCreateObj.customDateId = value.customDate;
                campaignCreateObj.sendBefore = value.sendBefore.toString();
            }
            if (value.sendTo === 'LEAD') {
                campaignCreateObj.statusId = value.statusId;
            }
            console.log(campaignCreateObj);
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('campaign', campaignCreateObj);
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

    useEffect(() => {
        formik.setFieldValue('statusId', 'All');
        formik.setFieldValue('sourceId', 'All');
        formik.setFieldValue('productId', 'All');
    }, []);

    useEffect(() => {
        const createCustomFieldDropdown: SelectOptionsType[] = customDateFields.map((item: ICustomField) => {
            return { label: item?.label, value: item?.id };
        });
        setCustomFieldList(createCustomFieldDropdown);
    }, [customDateFields]);

    useEffect(() => {
        const createLeadStatusDropdown: SelectOptionsType[] = leadStatusList.map((item: ILeadStatus) => {
            return { label: item?.name, value: item?.id };
        });
        createLeadStatusDropdown.unshift({
            label: 'All',
            value: 'All',
        });
        setLeadStatusDropdown(createLeadStatusDropdown);
    }, [leadStatusList]);

    useEffect(() => {
        const createSourceDropdown: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
            return { value: item.id, label: item.name };
        });
        createSourceDropdown.unshift({
            label: 'All',
            value: 'All',
        });
        setSourceDropdown(createSourceDropdown);
    }, [sourceList]);

    function padTo2Digits(num: number) {
        return String(num).padStart(2, '0');
    }
    return (
        <Modal
            open={createModal}
            onClose={() => {
                dispatch(setCreateModal(false));
            }}
            onDiscard={() => {
                dispatch(setCreateModal(false));
                formik.resetForm();
            }}
            size="large"
            onSubmit={() => formik.submitForm()}
            title="Add Campaign"
            isBtnDisabled={
                formik.values.name &&
                formik.values.hour &&
                formik.values.type &&
                formik.values.sendTo &&
                formik.values.sourceId &&
                formik.values.productId &&
                formik.values.instance[formik.values.instance.length - 1].platform &&
                formik.values.instance[formik.values.instance.length - 1].templateId &&
                formik.values.instance.length <= 3 &&
                !isBtnDisabled
                    ? false
                    : true
            }
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <FormikProvider value={formik}>
                        <form className="space-y-5" onSubmit={formik.handleSubmit}>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <label>Campaign Type</label>
                                    <Select
                                        placeholder="Select Campaign Type"
                                        options={campaignTypeList}
                                        onChange={(data: any) => {
                                            formik.setFieldValue('type', data.value);
                                            if (data.value === 'OCCASIONAL' && customDateFields.length <= 0) {
                                                dispatch(getCustomDateFieldsList());
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="createCampaignName">Campaign Name</label>
                                    <input
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                        id="createCampaignName"
                                        name="name"
                                        type="text"
                                        placeholder="Campaign Name"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                {formik.values.type === 'SCHEDULED' && (
                                    <div className="flex-1">
                                        <label>Choose Date</label>
                                        <Flatpickr
                                            data-enable-time={false}
                                            options={{
                                                enableTime: false,
                                                dateFormat: 'Y-m-d H:i',
                                                position: 'auto',
                                            }}
                                            id="date"
                                            placeholder="Choose Date"
                                            name="date"
                                            className="form-input"
                                            onChange={(e) => formik.setFieldValue('date', e[0].toISOString())}
                                            value={formik.values.date}
                                        />
                                    </div>
                                )}
                                {formik.values.type === 'DRIP' && (
                                    <div className="flex-1">
                                        <label htmlFor="sendAfter">Send After</label>
                                        <input
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.sendAfter}
                                            id="sendAfter"
                                            name="sendAfter"
                                            type="number"
                                            placeholder="Send After"
                                            className="form-input"
                                        />
                                    </div>
                                )}

                                {formik.values.type === 'OCCASIONAL' && (
                                    <div className="flex-1">
                                        <label htmlFor="sendBefore">Send Before</label>
                                        <input
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.sendBefore}
                                            id="sendBefore"
                                            name="sendBefore"
                                            type="number"
                                            placeholder="Send Before"
                                            className="form-input"
                                        />
                                    </div>
                                )}

                                {formik.values.type === 'OCCASIONAL' && (
                                    <div className="flex-1">
                                        <label htmlFor="customDate">Date</label>
                                        <Select placeholder="Select Date" options={customFieldList} onChange={(data: any) => formik.setFieldValue('customDate', data.value)} />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <label>Hour</label>
                                    <Flatpickr
                                        data-enable-time
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: 'H:i',
                                            time_24hr: true,
                                        }}
                                        id="hour"
                                        placeholder="Select Hour"
                                        name="hour"
                                        className="form-input"
                                        onChange={(e) => formik.setFieldValue('hour', padTo2Digits(e[0].getHours()) + ':' + padTo2Digits(e[0].getMinutes()))}
                                        value={formik.values.hour}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="sendTo">Send To</label>
                                    <Select
                                        placeholder="Send To"
                                        options={sendToDropdown}
                                        onChange={(data: any) => {
                                            formik.setFieldValue('sendTo', data.value);
                                            formik.setFieldValue('statusId', 'All');
                                        }}
                                    />
                                </div>
                                {formik.values.sendTo === 'LEAD' && (
                                    <div className="flex-1">
                                        <label htmlFor="statusId">Lead Status</label>
                                        <Select
                                            placeholder="Select Lead Status"
                                            options={leadStatusDropdown}
                                            onChange={(data: any) => formik.setFieldValue('statusId', data.value)}
                                            defaultValue={{ label: 'All', value: 'All' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="source">Source</label>
                                    <Select
                                        placeholder="Select Source"
                                        options={sourceDropdown}
                                        onChange={(data: any) => formik.setFieldValue('sourceId', data.value)}
                                        defaultValue={{ label: 'All', value: 'All' }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="productId">Product</label>
                                    <Select
                                        placeholder="Select Product"
                                        options={sourceDropdown}
                                        onChange={(data: any) => formik.setFieldValue('productId', data.value)}
                                        defaultValue={{ label: 'All', value: 'All' }}
                                    />
                                </div>
                            </div>
                            <FieldArray
                                name="instance"
                                render={(arrayHelpers) => (
                                    <div className="my-6">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary rounded"
                                                onClick={() => arrayHelpers.push({ platform: '', templateId: '' })}
                                                disabled={
                                                    formik.values.instance[formik.values.instance.length - 1].platform &&
                                                    formik.values.instance[formik.values.instance.length - 1].templateId &&
                                                    formik.values.instance.length < 3
                                                        ? false
                                                        : true
                                                }
                                            >
                                                Add Instance
                                            </button>
                                        </div>
                                        {formik.values.instance.map((instance, index) => (
                                            <div key={index} className="my-2 flex flex-1 flex-col gap-4 sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="platform">Platform</label>
                                                    <Select
                                                        placeholder="Select PlatForm"
                                                        options={platformListRawData}
                                                        onChange={(data: any) => formik.setFieldValue(`instance[${index}].platform`, data.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="template">Template</label>
                                                    <div className="flex flex-1 gap-3">
                                                        <Select
                                                            placeholder="Select Template"
                                                            options={sourceDropdown.slice(1)}
                                                            onChange={(data: any) => formik.setFieldValue(`instance[${index}].templateId`, data.value)}
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-end">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => arrayHelpers.remove(index)}>
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />

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
                        </form>
                    </FormikProvider>
                )
            }
        />
    );
};

export default memo(CampaignCreateModal);
