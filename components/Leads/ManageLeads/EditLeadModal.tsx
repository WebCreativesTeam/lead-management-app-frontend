/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setDisableBtn, setEditModal, setFetching } from '@/store/Slices/leadSlice/manageLeadSlice';
import { useFormik } from 'formik';
import { leadSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Swal from 'sweetalert2';
import Loader from '@/components/__Shared/Loader';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import { BranchDataType, BranchListSecondaryEndpoint, SelectOptionsType, SourceDataType } from '@/utils/Types';

const LeadEditModal = () => {
    const dispatch = useDispatch();
    const [defaultSource, setDefaultSource] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultBranch, setDefaultBranch] = useState<SelectOptionsType>({} as SelectOptionsType);

    const { isFetching, editModal, isBtnDisabled, singleData, leadSourceList, leadBranchList } = useSelector((state: IRootState) => state.lead);

    const leadSourceDropdown: SelectOptionsType[] = leadSourceList?.map((item: SourceDataType) => {
        return { value: item.id, label: item.name };
    });
    const leadBranchDropdown: SelectOptionsType[] = leadBranchList?.map((item: BranchListSecondaryEndpoint) => {
        return { value: item.id, label: item.name };
    });

    useEffect(() => {
        setFieldValue('DOB', singleData?.DOB);
        setFieldValue('description', singleData?.description);
        setFieldValue('estimatedBudget', singleData?.estimatedBudget);
        setFieldValue('estimatedDate', singleData?.estimatedDate);
        setFieldValue('facebookCampaignName', singleData?.facebookCampaignName);
        setFieldValue('job', singleData?.job);
        setFieldValue('reference', singleData?.reference);
        setFieldValue('serviceInterestedIn', singleData?.serviceInterestedIn);
        setFieldValue('branch', singleData?.branch);
        setFieldValue('source', singleData?.source);

        const findSource: SelectOptionsType | undefined = leadSourceDropdown.find((item: SelectOptionsType) => item?.value === singleData?.source?.id);
        if (findSource) {
            setDefaultSource(findSource);
        }
        const findBranch: SelectOptionsType | undefined = leadBranchDropdown.find((item: SelectOptionsType) => item?.value === singleData?.branch?.id);
        if (findBranch) {
            setDefaultBranch(findBranch);
        }
    }, [singleData]);

    const initialValues = {
        reference: '',
        estimatedDate: '',
        estimatedBudget: '',
        branch: {
            value: '',
            label: '',
        },
        source: {
            value: '',
            label: '',
        },
        description: '',
        DOB: '',
        facebookCampaignName: '',
        serviceInterestedIn: '',
        job: '',
        contactDate: '',
    };
    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: leadSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                const editLeadObj = {
                    estimatedDate: new Date(value.estimatedDate).toISOString(),
                    description: value.description,
                    estimatedBudget: +value.estimatedBudget,
                    sourceId: values.source.value,
                    branchId: value.branch.value,
                    reference: value.reference,
                    DOB: new Date(value.DOB).toISOString(),
                    facebookCampaignName: value.facebookCampaignName,
                    serviceInterestedIn: value.serviceInterestedIn,
                    job: value.job,
                };
                await new ApiClient().patch(`lead/${singleData?.id}`, editLeadObj);
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

    const showAlert = async () => {
        if (errors.description) {
            showToastAlert(errors.description);
        } else if (errors.estimatedBudget) {
            showToastAlert(errors.estimatedBudget);
        } else if (errors.facebookCampaignName) {
            showToastAlert(errors.facebookCampaignName);
        } else if (errors.job) {
            showToastAlert(errors.job);
        } else if (errors.serviceInterestedIn) {
            showToastAlert(errors.serviceInterestedIn);
        } else if (errors.reference) {
            showToastAlert(errors.reference);
        }
    };

    return (
        <Modal
            open={editModal}
            onClose={() => {
                dispatch(setEditModal({ open: false }));
            }}
            onDiscard={() => {
                dispatch(setEditModal({ open: false }));
                resetForm();
            }}
            size="large"
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            title="Edit Lead"
            isBtnDisabled={
                values.DOB &&
                values.description &&
                values.branch &&
                values.estimatedBudget &&
                values.estimatedDate &&
                values.facebookCampaignName &&
                values.job &&
                values.reference &&
                values.serviceInterestedIn &&
                values.source &&
                !isBtnDisabled
                    ? false
                    : true
            }
            disabledDiscardBtn={isBtnDisabled}
            content={
                isFetching ? (
                    <Loader />
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="createLeadReference">Lead Reference</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.reference}
                                    id="createLeadReference"
                                    name="reference"
                                    type="text"
                                    placeholder="Lead Reference"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="leadestimatedBudget">Estimated Budget</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.estimatedBudget}
                                    id="leadestimatedBudget"
                                    name="estimatedBudget"
                                    type="number"
                                    placeholder="Enter estimated Budget"
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label>Estimate Date</label>
                                <Flatpickr
                                    data-enable-time
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: 'auto',
                                    }}
                                    id="leadEstimateDate"
                                    name="startDate"
                                    className="form-input"
                                    onChange={(e) => setFieldValue('estimatedDate', e)}
                                    value={values.estimatedDate}
                                />
                            </div>
                            <div className="flex-1">
                                <label>DOB</label>
                                <Flatpickr
                                    data-enable-time
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: 'auto',
                                    }}
                                    id="DOB"
                                    name="DOB"
                                    className="form-input"
                                    onChange={(e) => setFieldValue('DOB', e)}
                                    value={values.DOB}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="leadBranch">Select Branch</label>
                                <Select placeholder="Select Branch" defaultValue={defaultBranch} options={leadBranchDropdown} id="leadBranch" onChange={(e) => setFieldValue('branch', e)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="leadSource">Select Source</label>
                                <Select placeholder="Select Source" defaultValue={defaultSource} options={leadSourceDropdown} id="leadSource" onChange={(e) => setFieldValue('source', e)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="leadFacebookCampaignName">Facebook Campaign Name</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.facebookCampaignName}
                                    id="leadFacebookCampaignName"
                                    name="facebookCampaignName"
                                    type="text"
                                    placeholder="Facebook Campaign Name"
                                    className="form-input"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="leadServiceInterestedIn">Service Interest</label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.serviceInterestedIn}
                                    id="leadServiceInterestedIn"
                                    name="serviceInterestedIn"
                                    type="text"
                                    placeholder="Service Interest"
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="leadJob">Job</label>
                                <input onChange={handleChange} onBlur={handleBlur} value={values.job} id="leadJob" name="job" type="text" placeholder="Enter Job" className="form-input" />
                            </div>
                            <div className="flex-1">
                                <label>Contact Date</label>
                                <Flatpickr
                                    data-enable-time
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: 'auto',
                                    }}
                                    id="contactDate"
                                    placeholder="Contact Date"
                                    name="contactDate"
                                    className="form-input"
                                    onChange={(e) => setFieldValue('contactDate', e)}
                                    value={values.contactDate}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="leadDescription"> Description</label>
                            <textarea
                                id="leadDescription"
                                rows={5}
                                className="form-textarea"
                                placeholder="Enter Description"
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            ></textarea>
                        </div>
                    </form>
                )
            }
        />
    );
};

export default memo(LeadEditModal);
