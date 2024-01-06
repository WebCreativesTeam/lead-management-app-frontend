import React, { memo, useEffect, useState } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, IRootState } from '@/store';
import {
    setEditModal,
    setDisableBtn,
    setFetching,
    getCustomDateFieldsList,
    getAllEmailTemplatesForCampaign,
    getAllWhatsappTemplatesForCampaign,
    getAllSmsTemplatesForCampaign,
} from '@/store/Slices/campaignSlice';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { campaignSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '../__Shared/Loader';
import { GetMethodResponseType, ICustomField, ILeadStatus, LeadStatusSecondaryEndpoint, ProductSecondaryEndpointType, SourceDataType } from '@/utils/Types';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import 'flatpickr/dist/flatpickr.css';
import { platformListRawData, sendToDropdown } from '@/utils/Raw Data';

type SelectOptionsType = {
    value: string;
    label: string;
};

const CampaignEditModal = () => {
    const { editModal, isBtnDisabled, isFetching, sourceList, customDateFields, leadStatusList, singleData, leadProductList, smsTemplateList, emailTemplateList, whatsappTemplateList } = useSelector(
        (state: IRootState) => state.campaign
    );
    const [customFieldList, setCustomFieldList] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [leadStatusDropdown, setLeadStatusDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [sourceDropdown, setSourceDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [defaultSendToValue, setDefaultSendToValue] = useState({} as SelectOptionsType);
    const [defaultProductValue, setDefaultProductValue] = useState({} as SelectOptionsType);
    const [defaultSourceValue, setDefaultSourceValue] = useState({} as SelectOptionsType);
    const [defaultLeadStatusValue, setDefaultLeadStatusValue] = useState({} as SelectOptionsType);
    const [defaultCustomDateValue, setDefaultCustomDateValue] = useState({} as SelectOptionsType);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [smsTemplateDropdown, setSmsTemplateDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [emailTemplateDropdown, setEmailTemplateDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [whatsappTemplateDropdown, setWhatsappTemplateDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [platformDropdown, setPlatformDropdown] = useState<SelectOptionsType[]>(platformListRawData);

    useEffect(() => {
        formik.setFieldValue('date', singleData?.date);
        formik.setFieldValue('name', singleData?.name);
        formik.setFieldValue('hour', singleData?.hour);
        formik.setFieldValue('sendAfter', singleData?.sendAfter);
        formik.setFieldValue('sendBefore', singleData?.sendBefore);
        formik.setFieldValue('customDateId', singleData?.customDateId);
        formik.setFieldValue('sendTo', singleData?.sendTo);
        if (singleData.isAllStatus) {
            formik.setFieldValue('isAllStatus', singleData?.isAllStatus);
        } else {
            formik.setFieldValue('statusId', singleData?.status?.id);
        }
        if (singleData.isAllProduct) {
            formik.setFieldValue('isAllProduct', singleData?.isAllProduct);
        } else {
            formik.setFieldValue('productId', singleData?.productId);
        }
        if (singleData.isAllSource) {
            formik.setFieldValue('isAllSource', singleData?.isAllSource);
        } else {
            formik.setFieldValue('sourceId', singleData?.sourceId);
        }
        formik.setFieldValue('isActive', singleData?.isActive);
        formik.setFieldValue('instance', singleData?.instance);

        const findSendToDefaultValue: SelectOptionsType | undefined = sendToDropdown.find((item: SelectOptionsType) => item.value === singleData?.sendTo);
        if (findSendToDefaultValue) {
            setDefaultSendToValue(findSendToDefaultValue);
        }

        const findProductDefaultValue: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item.value === singleData?.productId);
        if (findProductDefaultValue) {
            setDefaultProductValue(findProductDefaultValue);
        } else {
            setDefaultProductValue({ label: 'All', value: 'All' });
        }

        const findSourceDefaultValue: SelectOptionsType | undefined = sourceDropdown.find((item: SelectOptionsType) => item.value === singleData?.sourceId);
        if (findSourceDefaultValue) {
            setDefaultSourceValue(findSourceDefaultValue);
        } else {
            setDefaultSourceValue({ label: 'All', value: 'All' });
        }

        const findLeadStatusDefaultValue: SelectOptionsType | undefined = leadStatusDropdown.find((item: SelectOptionsType) => item.value === singleData?.status?.id);
        if (findLeadStatusDefaultValue) {
            setDefaultLeadStatusValue(findLeadStatusDefaultValue);
        } else {
            setDefaultLeadStatusValue({ label: 'All', value: 'All' });
        }

        const findCustomDateDefaultValue: SelectOptionsType | undefined = customFieldList.find((item: SelectOptionsType) => item.value === singleData?.customDateId);
        if (findCustomDateDefaultValue) {
            setDefaultCustomDateValue(findCustomDateDefaultValue);
        }
    }, [singleData]);

    const dispatch = useDispatch<AppDispatch>();
    const formik = useFormik({
        initialValues: {
            date: '',
            name: '',
            hour: '',
            sendAfter: '',
            sendBefore: '',
            type: '',
            customDateId: '',
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
            isAllSource: false,
            isAllProduct: false,
        },
        validationSchema: campaignSchema,
        validateOnChange: true,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            const campaignEditObj: any = {
                name: value.name,
                hour: value.hour,
                sendTo: value.sendTo,
                instance: value.instance,
            };
            if (value.productId === 'All' && value.sourceId === 'All') {
                campaignEditObj.isAllSource = true;
                campaignEditObj.isAllProduct = true;
            } else if (value.productId === 'All' && value.sourceId !== 'All') {
                campaignEditObj.isAllProduct = true;
                campaignEditObj.sourceId = value.sourceId;
            } else if (value.productId !== 'All' && value.sourceId === 'All') {
                campaignEditObj.isAllSource = true;
                campaignEditObj.productId = value.productId;
            }
            if (singleData.type === 'SCHEDULED') {
                campaignEditObj.date = value.date;
            } else if (singleData.type === 'DRIP') {
                campaignEditObj.sendAfter = value.sendAfter.toString();
            } else {
                campaignEditObj.customDateId = value.customDateId;
                campaignEditObj.sendBefore = value.sendBefore.toString();
            }
            if (value.sendTo === 'LEAD') {
                if (value.statusId === 'All') {
                    campaignEditObj.isAllStatus = true;
                } else {
                    campaignEditObj.statusId = value.statusId;
                }
            }
            console.log(campaignEditObj);
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('campaign/' + singleData?.id, campaignEditObj);
                dispatch(setEditModal({ open: false }));
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
        const editCustomFieldDropdown: SelectOptionsType[] = customDateFields?.map((item: ICustomField) => {
            return { label: item?.label, value: item?.id };
        });
        setCustomFieldList(editCustomFieldDropdown);
    }, [customDateFields]);

    useEffect(() => {
        const editLeadStatusDropdown: SelectOptionsType[] = leadStatusList.map((item: ILeadStatus) => {
            return { label: item?.name, value: item?.id };
        });
        editLeadStatusDropdown.unshift({
            label: 'All',
            value: 'All',
        });
        setLeadStatusDropdown(editLeadStatusDropdown);
    }, [leadStatusList]);

    useEffect(() => {
        const editSourceDropdown: SelectOptionsType[] = sourceList?.map((item: SourceDataType) => {
            return { value: item.id, label: item.name };
        });
        editSourceDropdown.unshift({
            label: 'All',
            value: 'All',
        });
        setSourceDropdown(editSourceDropdown);
    }, [sourceList]);

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

    function padTo2Digits(num: number) {
        return String(num).padStart(2, '0');
    }

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

    useEffect(() => {
        const selectedPlatform = formik?.values?.instance?.map((item) => item.platform);
        const filteredDropdown = platformListRawData?.filter((item) => !selectedPlatform?.includes(item?.value));
        setPlatformDropdown(filteredDropdown);
    }, [formik.values.instance]);

    return (
        <Modal
            open={editModal}
            onClose={() => {
                dispatch(setEditModal({ open: false }));
            }}
            onDiscard={() => {
                dispatch(setEditModal({ open: false }));
                formik.resetForm();
            }}
            size="large"
            onSubmit={() => formik.submitForm()}
            title="Update Campaign"
            isBtnDisabled={
                formik.values.name &&
                formik.values.sendTo &&
                (formik.values.sourceId || formik.values.isAllSource) &&
                (formik.values.productId || formik.values.isAllProduct) &&
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
                                    <Select placeholder={singleData?.type} value={singleData?.type} isDisabled />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="editCampaignName">Campaign Name</label>
                                    <input
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                        id="editCampaignName"
                                        name="name"
                                        type="text"
                                        placeholder="Campaign Name"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                {singleData?.type === 'SCHEDULED' && (
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
                                {singleData?.type === 'DRIP' && (
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

                                {singleData?.type === 'OCCASIONAL' && (
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

                                {singleData?.type === 'OCCASIONAL' && (
                                    <div className="flex-1">
                                        <label htmlFor="customDateId">Date</label>
                                        <Select
                                            placeholder="Select Date"
                                            options={customFieldList}
                                            onChange={(data: any) => formik.setFieldValue('customDateId', data.value)}
                                            defaultValue={defaultCustomDateValue}
                                        />
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
                                    <Select placeholder="Send To" options={sendToDropdown} onChange={(data: any) => formik.setFieldValue('sendTo', data.value)} defaultValue={defaultSendToValue} />
                                </div>
                                {formik.values.sendTo === 'LEAD' && (
                                    <div className="flex-1">
                                        <label htmlFor="statusId">Lead Status</label>
                                        <Select
                                            placeholder="Select Lead Status"
                                            options={leadStatusDropdown}
                                            onChange={(data: any) => formik.setFieldValue('statusId', data.value)}
                                            defaultValue={defaultLeadStatusValue}
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
                                        defaultValue={defaultSourceValue}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="productId">Product</label>
                                    <Select
                                        placeholder="Select Product"
                                        options={productDropdown}
                                        onChange={(data: any) => formik.setFieldValue('productId', data.value)}
                                        defaultValue={defaultProductValue}
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
                                                        defaultValue={platformListRawData?.find((item: SelectOptionsType) => item?.value === singleData?.instance[index]?.platform)}
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
                                                            defaultValue={
                                                                singleData?.instance?.[index]?.platform === 'WhatsApp'
                                                                    ? whatsappTemplateDropdown?.find((item: SelectOptionsType) => item?.value === singleData?.instance[index]?.templateId)
                                                                    : singleData?.instance?.[index]?.platform === 'SMS'
                                                                    ? smsTemplateDropdown?.find((item: SelectOptionsType) => item?.value === singleData?.instance[index]?.templateId)
                                                                    : emailTemplateDropdown?.find((item: SelectOptionsType) => item?.value === singleData?.instance[index]?.templateId)
                                                            }
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

export default memo(CampaignEditModal);
