import { SourceDataType, SourceInitialStateProps } from '@/utils/Types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: SourceInitialStateProps = {
    data: [] as SourceDataType[],
    singleData: {} as SourceDataType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
};

const sourceSlice = createSlice({
    initialState,
    name: 'source',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: SourceDataType | undefined = state.data.find((item: SourceDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as SourceDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: SourceDataType | undefined = state.data.find((item: SourceDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as SourceDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: SourceDataType | undefined = state.data.find((item: SourceDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as SourceDataType;
            }
        },
        getAllSources(state, action) {
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

export const { setCreateModal, setDeleteModal, setEditModal, setViewModal, getAllSources, setDisableBtn, setFetching } = sourceSlice.actions;
export default sourceSlice.reducer;
