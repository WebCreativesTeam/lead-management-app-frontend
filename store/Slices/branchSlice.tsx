import { BranchDataType, BranchInitialStateProps } from '@/utils/Types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: BranchInitialStateProps = {
    data: [] as BranchDataType[],
    singleData: {} as BranchDataType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
};

const branchSlice = createSlice({
    initialState,
    name: 'branch',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: BranchDataType | undefined = state.data.find((item: BranchDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as BranchDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: BranchDataType | undefined = state.data.find((item: BranchDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as BranchDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: BranchDataType | undefined = state.data.find((item: BranchDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as BranchDataType;
            }
        },
        getAllBranches(state, action) {
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

export const { setCreateModal, setDeleteModal, setEditModal, setViewModal, getAllBranches, setDisableBtn, setFetching } = branchSlice.actions;
export default branchSlice.reducer;
