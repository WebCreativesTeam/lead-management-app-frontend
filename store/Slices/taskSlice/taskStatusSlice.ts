import { TaskStatusInitialStateProps, TaskStatusType } from '@/utils/Types';
import { fetchUserPermissionArray, showToastAlert } from '@/utils/contant';
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
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    isAbleToChangeDefaultStatus:false,
    userPolicyArr: [] as string[],
};

const taskStatusSlice = createSlice({
    initialState,
    name: 'task status',
    extraReducers(builder) {
        builder.addCase(fetchUserPermissionArray.fulfilled, (state, action) => {
            if (action.payload) {
                state.userPolicyArr = action.payload;
            }
        });
    },
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
            if (findRequestedData?.isDefault === true) {
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
        setTaskStatusReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setTaskStatusCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setTaskStatusUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setTaskStatusDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setChangeDefaultTaskStatusPermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToChangeDefaultStatus = verifyPolicy;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllTaskStatus,
    setDisableBtn,
    setFetching,
    setDefaultStatusModal,
    setTaskStatusCreatePolicy,
    setTaskStatusDeletePolicy,
    setTaskStatusReadPolicy,
    setTaskStatusUpdatePolicy,
    setChangeDefaultTaskStatusPermission
} = taskStatusSlice.actions;
export default taskStatusSlice.reducer;
