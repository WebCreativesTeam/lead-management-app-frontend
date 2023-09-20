import { LeadStatusInitialStateProps, LeadStatusType, UserDataType } from '@/utils/Types';
import { fetchUserInfo, showToastAlert } from '@/utils/contant';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: LeadStatusInitialStateProps = {
    data: [] as LeadStatusType[],
    singleData: {} as LeadStatusType,
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
    isAbleToChangeDefaultStatus: false,
    userPolicyArr: [] as string[],
};

const leadStatusSlice = createSlice({
    initialState,
    name: 'lead status',
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
            const findRequestedData: LeadStatusType | undefined = state.data.find((item: LeadStatusType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadStatusType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: LeadStatusType | undefined = state.data.find((item: LeadStatusType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadStatusType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            const findRequestedData: LeadStatusType | undefined = state.data.find((item: LeadStatusType) => item.id === id);
            if (findRequestedData?.isDefault === true) {
                showToastAlert('Please make other option default to Delete this Status');
                return;
            }
            state.deleteModal = open;
            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadStatusType;
            }
        },
        setDefaultStatusModal(state, action) {
            const { open, id, switchValue } = action.payload;
            if (switchValue === false) {
                showToastAlert('default Status already selected');
                return;
            }
            state.defaultStatusModal = open;
            const findRequestedData: LeadStatusType | undefined = state.data.find((item: LeadStatusType) => item.id === id);

            if (findRequestedData && state.defaultStatusModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadStatusType;
            }
        },
        getAllLeadStatus(state, action) {
            state.data = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setLeadStatusReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setLeadStatusCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setLeadStatusUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setLeadStatusDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setChangeDefaultLeadStatusPermission(state, action) {
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
    getAllLeadStatus,
    setDisableBtn,
    setFetching,
    setDefaultStatusModal,
    setLeadStatusCreatePolicy,
    setLeadStatusDeletePolicy,
    setLeadStatusReadPolicy,
    setLeadStatusUpdatePolicy,
    setChangeDefaultLeadStatusPermission,
} = leadStatusSlice.actions;
export default leadStatusSlice.reducer;
