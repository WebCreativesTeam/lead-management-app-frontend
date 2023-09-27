import { LeadPriorityType, LeadPriorityInitialStateProps, UserDataType } from '@/utils/Types';
import { showToastAlert, fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: LeadPriorityInitialStateProps = {
    data: [] as LeadPriorityType[],
    singleData: {} as LeadPriorityType,
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
    totalRecords: 0,
};

const leadPrioritySlice = createSlice({
    initialState,
    name: 'lead priority',
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
            const findRequestedData: LeadPriorityType | undefined = state.data.find((item: LeadPriorityType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadPriorityType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: LeadPriorityType | undefined = state.data.find((item: LeadPriorityType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadPriorityType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            const findRequestedData: LeadPriorityType | undefined = state.data.find((item: LeadPriorityType) => item.id === id);
            if (findRequestedData?.isDefault === true) {
                showToastAlert('Please make other option default to Delete this Priority');
                return;
            }
            state.deleteModal = open;
            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadPriorityType;
            }
        },
        setDefaultPriorityModal(state, action) {
            const { open, id, switchValue } = action.payload;
            if (switchValue === false) {
                showToastAlert('default Priority already selected');
                return;
            }
            state.defaultPriorityModal = open;
            const findRequestedData: LeadPriorityType | undefined = state.data.find((item: LeadPriorityType) => item.id === id);

            if (findRequestedData && state.defaultPriorityModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadPriorityType;
            }
        },
        getAllLeadPriorities(state, action) {
            state.data = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setLeadPriorityReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setLeadPriorityCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setLeadPriorityUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setLeadPriorityDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setChangeDefaultLeadPriorityPermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToChangeDefaultPriority = verifyPolicy;
        },
        setLeadPriorityDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllLeadPriorities,
    setDisableBtn,
    setFetching,
    setDefaultPriorityModal,
    setLeadPriorityCreatePolicy,
    setLeadPriorityDeletePolicy,
    setLeadPriorityReadPolicy,
    setLeadPriorityUpdatePolicy,
    setChangeDefaultLeadPriorityPermission,
    setLeadPriorityDataLength
} = leadPrioritySlice.actions;
export default leadPrioritySlice.reducer;
