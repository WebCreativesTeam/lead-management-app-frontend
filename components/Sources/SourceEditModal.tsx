/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import Modal from '../__Shared/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { setEditModal, setDisableBtn, setFetching } from '@/store/Slices/sourceSlice';
import { useFormik } from 'formik';
import { sourceSchema } from '@/utils/schemas';
import { ApiClient } from '@/utils/http';
import { SourceDataType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';

const SourceEditModal = () => {
    const editModal: boolean = useSelector((state: IRootState) => state.source.editModal);
    const isBtnDisabled: boolean = useSelector((state: IRootState) => state.source.isBtnDisabled);
    const singleSource: SourceDataType = useSelector((state: IRootState) => state.source.singleData);

    const dispatch = useDispatch();
    useEffect(() => {
        setFieldValue('name', singleSource?.name);
    }, [singleSource]);

    const { values, handleChange, submitForm, handleSubmit, setFieldValue, errors, handleBlur, resetForm } = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: sourceSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (value, action) => {
            dispatch(setFetching(true));
            try {
                dispatch(setDisableBtn(true));
                await new ApiClient().patch('sources/' + singleSource.id, { name: value.name });

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
            size="medium"
            onDiscard={handleDiscard}
            title="Edit Source"
            onSubmit={() => submitForm()}
            disabledDiscardBtn={isBtnDisabled}
            isBtnDisabled={values.name && !isBtnDisabled ? false : true}
            content={
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="editSource">Source Name</label>
                        <input onChange={handleChange} onBlur={handleBlur} value={values.name} id="editSource" name="name" type="text" placeholder="Source Name" className="form-input" />
                    </div>
                </form>
            }
        />
    );
};

export default memo(SourceEditModal);
