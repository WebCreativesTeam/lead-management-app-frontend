import { IEmails, EmailsInitialStateProps } from '@/utils/Types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: EmailsInitialStateProps = {
    data: [] as IEmails[],
    singleData: {} as IEmails,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
};

const emailSlice = createSlice({
    initialState,
    name: 'emails',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: IEmails | undefined = state.data.find((item: IEmails) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IEmails;
            }
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: IEmails | undefined = state.data.find((item: IEmails) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IEmails;
            }
        },
        getAllEmails(state, action) {
            state.data = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
    },
});

export const { setDeleteModal, setViewModal, getAllEmails, setDisableBtn, setFetching } = emailSlice.actions;
export default emailSlice.reducer;
