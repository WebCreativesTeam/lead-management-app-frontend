import { ILeadRules, SourceDataType, UserDataType, LeadRuleInitialStateProps } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: LeadRuleInitialStateProps = {
    data: [] as ILeadRules[],
    singleData: {} as ILeadRules,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    sourceList: [] as SourceDataType[],
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    totalRecords: 0,
    userPolicyArr: [] as string[],
};

const leadRuleSlice = createSlice({
    initialState,
    name: 'lead rules',
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
            const findRequestedData: ILeadRules | undefined = state.data.find((item: ILeadRules) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ILeadRules;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: ILeadRules | undefined = state.data.find((item: ILeadRules) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ILeadRules;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: ILeadRules | undefined = state.data.find((item: ILeadRules) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ILeadRules;
            }
        },

        getAllLeadRules(state, action) {
            state.data = action.payload;
        },
        getAllSourceForLeadRule(state, action) {
            state.sourceList = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setLeadRuleReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setLeadRuleCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setLeadRuleUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setLeadRuleDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setLeadRuleDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllLeadRules,
    setDisableBtn,
    setFetching,
    setLeadRuleCreatePolicy,
    setLeadRuleDeletePolicy,
    setLeadRuleReadPolicy,
    setLeadRuleUpdatePolicy,
    getAllSourceForLeadRule,
    setLeadRuleDataLength,
} = leadRuleSlice.actions;

export default leadRuleSlice.reducer;
