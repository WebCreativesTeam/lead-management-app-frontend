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
import { ICustomField, ILeadStatus, ProductSecondaryEndpointType, SourceDataType } from '@/utils/Types';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import 'flatpickr/dist/flatpickr.css';
import { campaignTypeList, platformListRawData, sendToDropdown } from '@/utils/Raw Data';

type SelectOptionsType = {
    value: string;
    label: string;
};

const CampaignCreateModal = () => {
    const { createModal, isBtnDisabled, isFetching, sourceList, customDateFields, leadStatusList, leadProductList, smsTemplateList, whatsappTemplateList, emailTemplateList } = useSelector(
        (state: IRootState) => state.campaign
    );
    const [customFieldList, setCustomFieldList] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [leadStatusDropdown, setLeadStatusDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [platformDropdown, setPlatformDropdown] = useState<SelectOptionsType[]>(platformListRawData);
    const [smsTemplateDropdown, setSmsTemplateDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [emailTemplateDropdown, setEmailTemplateDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [whatsappTemplateDropdown, setWhatsappTemplateDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

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
            isAllSource: true,
            isAllProduct: true,
            isAllStatus: false,
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
                instance: value.instance,
            };
            if (value.isAllSource && value.isAllProduct) {
                campaignCreateObj.isAllSource = true;
                campaignCreateObj.isAllProduct = true;
            } else if (!value.isAllSource && value.isAllProduct) {
                campaignCreateObj.isAllProduct = true;
                campaignCreateObj.sourceId = value.sourceId;
            } else if (value.isAllSource && !value.isAllProduct) {
                campaignCreateObj.isAllSource = true;
                campaignCreateObj.productId = value.productId;
            } else if (!value.isAllSource && !value.isAllProduct) {
                campaignCreateObj.isAllSource = false;
                campaignCreateObj.isAllProduct = false;
                campaignCreateObj.productId = value.productId;
                campaignCreateObj.sourceId = value.sourceId;
            }
            if (value.type === 'SCHEDULED') {
                campaignCreateObj.date = value.date;
            } else if (value.type === 'DRIP') {
                campaignCreateObj.sendAfter = value.sendAfter.toString();
            } else {
                campaignCreateObj.customDateId = value.customDate;
                campaignCreateObj.sendBefore = value.sendBefore.toString();
            }
            if (value.sendTo === 'LEAD') {
                if (value.isAllStatus) {
                    campaignCreateObj.isAllStatus = true;
                } else {
                    campaignCreateObj.statusId = value.statusId;
                    campaignCreateObj.isAllStatus = false;
                }
            }
            console.log("campaignCreateObj",campaignCreateObj);
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

    //* sms template dropdown
    useEffect(() => {
        const selectedPlatform = formik.values.instance.map((item) => item.platform);
        const filteredDropdown = platformListRawData.filter((item) => !selectedPlatform?.includes(item?.value));
        setPlatformDropdown(filteredDropdown);
    }, [formik.values.instance]);

    useEffect(() => {
        const createCustomFieldDropdown: SelectOptionsType[] = customDateFields?.map((item: ICustomField) => {
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
        const createProductDropdown: SelectOptionsType[] = leadProductList?.map((item) => {
            return { label: item?.name, value: item?.id };
        });
        createProductDropdown.unshift({
            label: 'All',
            value: 'All',
        });
        setProductDropdown(createProductDropdown);
    }, [leadProductList]);

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

    //* sms template list
    useEffect(() => {
        if (Object.keys(smsTemplateList).length > 0) {
            const createSmsTemplateDropdown: SelectOptionsType[] = smsTemplateList?.map((item: ProductSecondaryEndpointType) => {
                return { value: item.id, label: item.name };
            });
            setSmsTemplateDropdown(createSmsTemplateDropdown);
        }
    }, [smsTemplateList]);

    //* whatsapp template list
    useEffect(() => {
        if (Object.keys(whatsappTemplateList).length > 0) {
            const createWhatsappTemplateDropdown: SelectOptionsType[] = whatsappTemplateList?.map((item: ProductSecondaryEndpointType) => {
                return { value: item.id, label: item.name };
            });
            setWhatsappTemplateDropdown(createWhatsappTemplateDropdown);
        }
    }, [whatsappTemplateList]);

    //* email template list
    useEffect(() => {
        if (Object.keys(emailTemplateList).length > 0) {
            const createEmailTemplateDropdown: SelectOptionsType[] = emailTemplateList?.map((item: ProductSecondaryEndpointType) => {
                return { value: item.id, label: item.name };
            });
            setEmailTemplateDropdown(createEmailTemplateDropdown);
        }
    }, [emailTemplateList]);

    function padTo2Digits(num: number) {
        return String(num).padStart(2, '0');
    }

    console.log(formik.values)

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
                (formik.values.productId || formik.values.isAllProduct) &&
                (formik.values.sourceId || formik.values.isAllSource) &&
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
                                            formik.setFieldValue('isAllStatus', true);
                                        }}
                                    />
                                </div>
                                {formik.values.sendTo === 'LEAD' && (
                                    <div className="flex-1">
                                        <label htmlFor="statusId">Lead Status</label>
                                        <Select
                                            placeholder="Select Lead Status"
                                            options={leadStatusDropdown}
                                            onChange={(data: any) => {
                                                if (data.value === 'All') {
                                                    formik.setFieldValue('isAllStatus', true);
                                                } else {
                                                    formik.setFieldValue('statusId', data.value);
                                                    formik.setFieldValue('isAllStatus', false);
                                                }
                                            }}
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
                                        onChange={(data: any) => {
                                            if (data.value === 'All') {
                                                formik.setFieldValue('isAllSource', true);
                                            } else {
                                                formik.setFieldValue('sourceId', data.value);
                                                formik.setFieldValue('isAllSource', false);
                                            }
                                        }}
                                        defaultValue={{ label: 'All', value: 'All' }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="productId">Product</label>
                                    <Select
                                        placeholder="Select Product"
                                        options={productDropdown}
                                        onChange={(data: any) => {
                                            if (data.value === 'All') {
                                                formik.setFieldValue('isAllProduct', true);
                                            } else {
                                                formik.setFieldValue('productId', data.value);
                                                formik.setFieldValue('isAllProduct', false);
                                            }
                                        }}
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
                                                        options={platformDropdown}
                                                        onChange={(data: any) => formik.setFieldValue(`instance[${index}].platform`, data.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="template">Template</label>
                                                    <div className="flex flex-1 gap-3">
                                                        <Select
                                                            placeholder="Select Template"
                                                            options={
                                                                formik.values.instance[index].platform === 'WhatsApp'
                                                                    ? whatsappTemplateDropdown
                                                                    : formik.values.instance[index].platform === 'Email'
                                                                    ? emailTemplateDropdown
                                                                    : smsTemplateDropdown
                                                            }
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
                        </form>
                    </FormikProvider>
                )
            }
        />
    );
};

export default memo(CampaignCreateModal);
