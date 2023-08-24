import React, { memo } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setCreateModal, setDisableBtn, setFetching } from '@/store/Slices/sourceSlice';
import { useFormik } from 'formik';
import { sourceSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';

const CreateSourceModal = () => {
    const createModal: boolean = useSelector((state: IRootState) => state.source.createModal);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.source.isBtnDisabled);
    const dispatch = useDispatch();
    const initialValues = {
        name: '',
    };
    const { values, handleChange, submitForm, handleSubmit, handleBlur, resetForm } = useFormik({
        initialValues,
        validationSchema: sourceSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().post('sources', { name: value.name });
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
            size="medium"
            onSubmit={() => submitForm()}
            title="Create Source"
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            disabledDiscardBtn={isBtnDisabled}
            content={
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="createSource">Source Name</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="createSource" name="name" type="text" placeholder="Source Name" className="form-input" />
                    </div>
                </form>
            }
        />
    );
};

export default memo(CreateSourceModal);
