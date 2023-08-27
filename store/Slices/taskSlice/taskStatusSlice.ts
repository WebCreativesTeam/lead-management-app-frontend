import { TaskStatusInitialStateProps, TaskStatusType } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import { createSlice } from '@reduxjs/toolkit';

const initialState: TaskStatusInitialStateProps = {
    data: [] as TaskStatusType[],
    singleData: {} as TaskStatusType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    defaultStatusModal: false,
};

const taskStatusSlice = createSlice({
    initialState,
    name: 'task status',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: TaskStatusType | undefined = state.data.find((item: TaskStatusType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskStatusType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: TaskStatusType | undefined = state.data.find((item: TaskStatusType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskStatusType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            const findRequestedData: TaskStatusType | undefined = state.data.find((item: TaskStatusType) => item.id === id);
            if (findRequestedData?.isDefault ===true) {
                showToastAlert('Please make other option default to Delete this Status');
                return;
            }
            state.deleteModal = open;
            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskStatusType;
            }
        },
        setDefaultStatusModal(state, action) {
            const { open, id, switchValue } = action.payload;
            if (switchValue === false) {
                showToastAlert('default Status already selected');
                return;
            }
            state.defaultStatusModal = open;
            const findRequestedData: TaskStatusType | undefined = state.data.find((item: TaskStatusType) => item.id === id);

            if (findRequestedData && state.defaultStatusModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskStatusType;
            }
        },
        getAllTaskStatus(state, action) {
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

export const { setCreateModal, setDeleteModal, setEditModal, setViewModal, getAllTaskStatus, setDisableBtn, setFetching, setDefaultStatusModal } = taskStatusSlice.actions;
export default taskStatusSlice.reducer;
