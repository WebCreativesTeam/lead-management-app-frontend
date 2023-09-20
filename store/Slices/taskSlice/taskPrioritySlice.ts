import { TaskPriorityType, TaskPriorityInitialStateProps, UserDataType } from '@/utils/Types';
import { showToastAlert, fetchUserInfo } from '@/utils/contant';
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

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
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    isAbleToChangeDefaultPriority: false,
    userPolicyArr: [] as string[],
};

const taskPrioritySlice = createSlice({
    initialState,
    name: 'task priority',
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
        setTaskPriorityReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setTaskPriorityCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setTaskPriorityUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setTaskPriorityDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setChangeDefaultTaskPriorityPermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToChangeDefaultPriority = verifyPolicy;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllTaskPriorities,
    setDisableBtn,
    setFetching,
    setDefaultPriorityModal,
    setTaskPriorityCreatePolicy,
    setTaskPriorityDeletePolicy,
    setTaskPriorityReadPolicy,
    setTaskPriorityUpdatePolicy,
    setChangeDefaultTaskPriorityPermission,
} = taskPrioritySlice.actions;
export default taskPrioritySlice.reducer;
