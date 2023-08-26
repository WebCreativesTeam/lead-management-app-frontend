import { ContactDataType, ContactInitialStateProps } from '@/utils/Types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ContactInitialStateProps = {
    data: [] as ContactDataType[],
    singleData: {} as ContactDataType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
};

const contactSlice = createSlice({
    initialState,
    name: 'contact',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: ContactDataType | undefined = state.data.find((item: ContactDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ContactDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: ContactDataType | undefined = state.data.find((item: ContactDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ContactDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: ContactDataType | undefined = state.data.find((item: ContactDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ContactDataType;
            }
        },
        getAllContacts(state, action) {
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

export const { setCreateModal, setDeleteModal, setEditModal, setViewModal, getAllContacts,setDisableBtn,setFetching } = contactSlice.actions;
export default contactSlice.reducer;
