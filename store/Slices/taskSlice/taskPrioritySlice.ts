import { TaskPriorityType, TaskPriorityInitialStateProps } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import { createSlice } from '@reduxjs/toolkit';

const initialState: TaskPriorityInitialStateProps = {
    data: [] as TaskPriorityType[],
    singleData: {} as TaskPriorityType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    defaultPriorityModal: false,
};

const taskPrioritySlice = createSlice({
    initialState,
    name: 'task priority',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: TaskPriorityType | undefined = state.data.find((item: TaskPriorityType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskPriorityType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: TaskPriorityType | undefined = state.data.find((item: TaskPriorityType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskPriorityType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            const findRequestedData: TaskPriorityType | undefined = state.data.find((item: TaskPriorityType) => item.id === id);
            if (findRequestedData?.isDefault === true) {
                showToastAlert('Please make other option default to Delete this Priority');
                return;
            }
            state.deleteModal = open;
            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskPriorityType;
            }
        },
        setDefaultPriorityModal(state, action) {
            const { open, id, switchValue } = action.payload;
            if (switchValue === false) {
                showToastAlert('default Priority already selected');
                return;
            }
            state.defaultPriorityModal = open;
            const findRequestedData: TaskPriorityType | undefined = state.data.find((item: TaskPriorityType) => item.id === id);

            if (findRequestedData && state.defaultPriorityModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskPriorityType;
            }
        },
        getAllTaskPriorities(state, action) {
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

export const { setCreateModal, setDeleteModal, setEditModal, setViewModal, getAllTaskPriorities, setDisableBtn, setFetching, setDefaultPriorityModal } = taskPrioritySlice.actions;
export default taskPrioritySlice.reducer;
