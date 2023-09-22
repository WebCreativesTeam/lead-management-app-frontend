import React, { memo } from 'react';
import Modal from '@/components/__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/leadSlice/manageLeadSlice';
import { useFormik } from 'formik';
import { leadSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Loader from '@/components/__Shared/Loader';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { SelectOptionsType, BranchDataType, SourceDataType, ContactDataType, ILeadPriority } from '@/utils/Types';

const LeadCreateModal = () => {
    const dispatch = useDispatch();
    const { isFetching, createModal, isBtnDisabled, leadPriorityList, leadBranchList, leadContactsList, leadSourceList } = useSelector((state: IRootState) => state.lead);

    const initialValues = {
        reference: '',
        priority: {
            value: '',
            label: '',
        },
        estimatedDate: '',
        estimatedBudget: '',
        branch: {
            value: '',
            label: '',
        },
        contact: {
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
                const createLeadObj = {
                    estimatedDate: new Date(value.estimatedDate).toISOString(),
                    description: value.description,
                    estimatedBudget: +value.estimatedBudget,
                    sourceId: values.source.value,
                    priorityId: values.priority.value,
                    branchId: value.branch.value,
                    contactId: values.contact.value,
                    reference: value.reference,
                    DOB: new Date(value.DOB).toISOString(),
                    facebookCampaignName: value.facebookCampaignName,
                    serviceInterestedIn: value.serviceInterestedIn,
                    job: value.job,
                };
                console.log(createLeadObj);
                await new ApiClient().post('lead', createLeadObj);
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

    const leadPriorityDropdown: SelectOptionsType[] = leadPriorityList?.map((item: ILeadPriority) => {
        return { value: item.id, label: item.name };
    });

    const leadBranchDropdown: SelectOptionsType[] = leadBranchList?.map((item: BranchDataType) => {
        return { value: item.id, label: item.name };
    });

    const leadContactDropdown: SelectOptionsType[] = leadContactsList?.map((item: ContactDataType) => {
        return { value: item.id, label: item.name };
    });

    const leadSourceDropdown: SelectOptionsType[] = leadSourceList?.map((item: SourceDataType) => {
        return { value: item.id, label: item.name };
    });

    const showAlert = async () => {
        if (errors.description) {
            showToastAlert(errors.description);
        } else if (errors.reference) {
            showToastAlert(errors.reference);
        } else if (errors.job) {
            showToastAlert(errors.job);
        } else if (errors.estimatedBudget) {
            showToastAlert(errors.estimatedBudget);
        } else if (errors.facebookCampaignName) {
            showToastAlert(errors.facebookCampaignName);
        } else if (errors.serviceInterestedIn) {
            showToastAlert(errors.serviceInterestedIn);
        }
    };
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
            onSubmit={() => {
                errors && showAlert();
                submitForm();
            }}
            title="Create Lead"
            isBtnDisabled={
                values.DOB &&
                values.contact.value &&
                values.estimatedDate &&
                values.source.value &&
                values.branch.value &&
                values.priority.value &&
                values.description &&
                values.estimatedBudget &&
                values.reference &&
                values.facebookCampaignName &&
                values.serviceInterestedIn &&
                values.job &&
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
                                    placeholder="Estimate Date"
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
                                    placeholder="Date Of Birth"
                                    onChange={(e) => setFieldValue('DOB', e)}
                                    value={values.DOB}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="leadBranch">Select Branch</label>
                                <Select placeholder="Select Branch" options={leadBranchDropdown} id="leadBranch" onChange={(e) => setFieldValue('branch', e)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="leadSource">Select Source</label>
                                <Select placeholder="Select Source" options={leadSourceDropdown} id="leadSource" onChange={(e) => setFieldValue('source', e)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <label htmlFor="leadPriority">Lead Priority</label>
                                <Select placeholder="Select lead priority" options={leadPriorityDropdown} id="leadPriority" onChange={(e) => setFieldValue('priority', e)} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="leadContact">Lead Contact</label>
                                <Select placeholder="Select Contact" options={leadContactDropdown} id="leadContact" onChange={(e) => setFieldValue('contact', e)} />
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
                        <div>
                            <label htmlFor="leadJob">Job</label>
                            <input onChange={handleChange} onBlur={handleBlur} value={values.job} id="leadJob" name="job" type="text" placeholder="Enter Job" className="form-input" />
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

export default memo(LeadCreateModal);
