import { TaskDataType, ManageTaskInitialStateProps, TaskSelectOptions, UserDataType, LeadDataType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

const initialState: ManageTaskInitialStateProps = {
    data: [] as TaskDataType[],
    singleData: {} as TaskDataType,
    singlePriority: {} as TaskSelectOptions,
    singleStatus: {} as TaskSelectOptions,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    taskPriorityList: [] as TaskSelectOptions[],
    taskStatusList: [] as TaskSelectOptions[],
    usersList: [] as UserDataType[],
    ledsList: [] as LeadDataType[],
    changePriorityModal: false,
    changeStatusModal: false,
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    isAbleToTransferTask: false,
    transferTaskModal:false,
    userPolicyArr: [] as string[],
};

const manageTaskSlice = createSlice({
    initialState,
    name: 'manage tasks',
    extraReducers(builder) {
        builder.addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserDataType>) => {
            if (action.payload) {
                state.userPolicyArr = action.payload.permissions;
            }
        });
    },
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: TaskDataType | undefined = state.data.find((item: TaskDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: TaskDataType | undefined = state.data.find((item: TaskDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskDataType;
            }
        },
        setTransferTaskModal(state, action) {
            const { open, id } = action.payload;
            state.transferTaskModal = open;
            const findRequestedData: TaskDataType | undefined = state.data.find((item: TaskDataType) => item.id === id);

            if (findRequestedData && state.transferTaskModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: TaskDataType | undefined = state.data.find((item: TaskDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as TaskDataType;
            }
        },
        setChangePriorityModal(state, action) {
            const { priorityId, taskId, open } = action.payload;
            state.changePriorityModal = open;
            const findRequestedData: TaskDataType | undefined = state.data.find((item: TaskDataType) => item.id === taskId);

            const findSinglePriority: TaskSelectOptions | undefined = state?.taskPriorityList.find((item: TaskSelectOptions) => item.id === priorityId);

            if (findRequestedData && state.changePriorityModal && findSinglePriority) {
                state.singleData = findRequestedData;
                state.singlePriority = findSinglePriority;
            } else {
                state.singleData = {} as TaskDataType;
            }
        },
        setChangeStatusModal(state, action) {
            const { statusId, taskId, open } = action.payload;
            state.changeStatusModal = open;
            const findRequestedData: TaskDataType | undefined = state.data.find((item: TaskDataType) => item.id === taskId);

            const findSingleStatus: TaskSelectOptions | undefined = state?.taskStatusList?.find((item: TaskSelectOptions) => item.id === statusId);

            if (findRequestedData && state.changeStatusModal && findSingleStatus) {
                state.singleData = findRequestedData;
                state.singleStatus = findSingleStatus;
            } else {
                state.singleData = {} as TaskDataType;
            }
        },
        getAllTasks(state, action) {
            state.data = action.payload;
        },
        getAllUsersForTask(state, action) {
            state.usersList = action.payload;
        },
        getAllLeadsForTask(state, action) {
            state.ledsList = action.payload;
        },
        getAllTaskPriorities(state, action) {
            state.taskPriorityList = action.payload;
        },
        getAllTaskStatus(state, action) {
            state.taskStatusList = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setTaskReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setTaskCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setTaskUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setTaskDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setTaskTransferPermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToTransferTask = verifyPolicy;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllTasks,
    getAllUsersForTask,
    setDisableBtn,
    setFetching,
    getAllTaskPriorities,
    getAllTaskStatus,
    setChangePriorityModal,
    setChangeStatusModal,
    setTaskCreatePolicy,
    setTaskDeletePolicy,
    setTaskReadPolicy,
    setTaskUpdatePolicy,
    getAllLeadsForTask,
    setTaskTransferPermission,
    setTransferTaskModal
} = manageTaskSlice.actions;
export default manageTaskSlice.reducer;
