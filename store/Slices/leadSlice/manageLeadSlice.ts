import {
    LeadDataType,
    ManageLeadInitialStateProps,
    LeadPrioritySecondaryEndpoint,
    LeadStatusSecondaryEndpoint,
    SourceDataType,
    UserDataType,
    ContactListSecondaryEndpoint,
    BranchListSecondaryEndpoint,
    ICustomField,
    ProductSecondaryEndpointType,
} from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ManageLeadInitialStateProps = {
    data: [] as LeadDataType[],
    singleData: {} as LeadDataType,
    singlePriority: {} as LeadPrioritySecondaryEndpoint,
    singleStatus: {} as LeadStatusSecondaryEndpoint,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    leadPriorityList: [] as LeadPrioritySecondaryEndpoint[],
    leadStatusList: [] as LeadStatusSecondaryEndpoint[],
    leadContactsList: [] as ContactListSecondaryEndpoint[],
    leadBranchList: [] as BranchListSecondaryEndpoint[],
    leadSourceList: [] as SourceDataType[],
    customFieldsList: [] as ICustomField[],
    leadProductList: [] as ProductSecondaryEndpointType[],
    changePriorityModal: false,
    changeStatusModal: false,
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    userPolicyArr: [] as string[],
    totalRecords: 0,
};

const manageLeadSlice = createSlice({
    initialState,
    name: 'manage leads',
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
            const findRequestedData: LeadDataType | undefined = state.data.find((item: LeadDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadDataType;
            }
        },
        setEditModal(state, action: PayloadAction<{ open: boolean; id?: string }>) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: LeadDataType | undefined = state.data.find((item: LeadDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: LeadDataType | undefined = state.data.find((item: LeadDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as LeadDataType;
            }
        },
        setChangePriorityModal(state, action) {
            const { priorityId, leadId, open } = action.payload;
            state.changePriorityModal = open;
            const findRequestedData: LeadDataType | undefined = state.data.find((item: LeadDataType) => item.id === leadId);

            const findSinglePriority: LeadPrioritySecondaryEndpoint | undefined = state?.leadPriorityList.find((item: LeadPrioritySecondaryEndpoint) => item.id === priorityId);

            if (findRequestedData && state.changePriorityModal && findSinglePriority) {
                state.singleData = findRequestedData;
                state.singlePriority = findSinglePriority;
            } else {
                state.singleData = {} as LeadDataType;
            }
        },
        setChangeStatusModal(state, action) {
            const { statusId, leadId, open } = action.payload;
            state.changeStatusModal = open;
            const findRequestedData: LeadDataType | undefined = state.data.find((item: LeadDataType) => item.id === leadId);

            const findSingleStatus: LeadStatusSecondaryEndpoint | undefined = state?.leadStatusList?.find((item: LeadStatusSecondaryEndpoint) => item.id === statusId);

            if (findRequestedData && state.changeStatusModal && findSingleStatus) {
                state.singleData = findRequestedData;
                state.singleStatus = findSingleStatus;
            } else {
                state.singleData = {} as LeadDataType;
            }
        },
        getAllLeads(state, action) {
            state.data = action.payload;
        },
        getAllContactsForLead(state, action) {
            state.leadContactsList = action.payload;
        },
        getAllProductsForLead(state, action: PayloadAction<ProductSecondaryEndpointType[]>) {
            state.leadProductList = action.payload;
        },
        getAllBranchForLead(state, action) {
            state.leadBranchList = action.payload;
        },
        getAllSourceForLead(state, action) {
            state.leadSourceList = action.payload;
        },
        getAllLeadPriorities(state, action) {
            state.leadPriorityList = action.payload;
        },
        getAllLeadStatus(state, action) {
            state.leadStatusList = action.payload;
        },
        getAllCustomFieldsForLeads(state, action) {
            state.customFieldsList = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setLeadReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setLeadCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setLeadUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setLeadDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setLeadDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllLeads,
    setDisableBtn,
    setFetching,
    getAllLeadPriorities,
    getAllLeadStatus,
    setChangePriorityModal,
    setChangeStatusModal,
    setLeadCreatePolicy,
    setLeadDeletePolicy,
    setLeadReadPolicy,
    setLeadUpdatePolicy,
    getAllContactsForLead,
    getAllBranchForLead,
    getAllSourceForLead,
    setLeadDataLength,
    getAllCustomFieldsForLeads,
    getAllProductsForLead,
} = manageLeadSlice.actions;
export default manageLeadSlice.reducer;
