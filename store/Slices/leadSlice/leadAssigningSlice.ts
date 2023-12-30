import { ILeadAssignment, SourceDataType, UserDataType, LeadAssignmentInitialStateProps, UserListSecondaryEndpointType, ProductSecondaryEndpointType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: LeadAssignmentInitialStateProps = {
    data: [] as ILeadAssignment[],
    singleData: {} as ILeadAssignment,
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
    isAbleToActivate: false,
    leadAssignmentActivationModal: false,
    totalRecords: 0,
    userPolicyArr: [] as string[],
    usersList: [] as UserListSecondaryEndpointType[],
    productList: [] as ProductSecondaryEndpointType[],
};

const leadAssignmentSlice = createSlice({
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
            const findRequestedData: ILeadAssignment | undefined = state.data.find((item: ILeadAssignment) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ILeadAssignment;
            }
        },
        setEditModal(state, action: PayloadAction<{ open: boolean; id?: string }>) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: ILeadAssignment | undefined = state.data.find((item: ILeadAssignment) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ILeadAssignment;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: ILeadAssignment | undefined = state.data.find((item: ILeadAssignment) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ILeadAssignment;
            }
        },

        getAllLeadAssignments(state, action) {
            state.data = action.payload;
        },
        getAllSourceForLeadAssignment(state, action) {
            state.sourceList = action.payload;
        },
        getAllUsersForLeadAssignment(state, action: PayloadAction<UserListSecondaryEndpointType[]>) {
            state.usersList = action.payload;
        },
        getAllProductsForLeadAssignment(state, action: PayloadAction<ProductSecondaryEndpointType[]>) {
            state.productList = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setLeadAssignmentReadPermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setLeadAssignmentCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setLeadAssignmentUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setLeadAssignmentDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setLeadAssignmentActivationPermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToActivate = verifyPermission;
        },
        setLeadAssignmentDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
        setLeadAssignmentActivationModal(state, action: PayloadAction<{ open: boolean; id?: string }>) {
            const { open, id } = action.payload;
            state.leadAssignmentActivationModal = open;
            const findRequestedData: ILeadAssignment | undefined = state.data.find((item: ILeadAssignment) => item.id === id);

            if (findRequestedData && state.leadAssignmentActivationModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ILeadAssignment;
            }
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllLeadAssignments,
    setDisableBtn,
    setFetching,
    setLeadAssignmentCreatePermission,
    setLeadAssignmentDeletePermission,
    setLeadAssignmentReadPermission,
    setLeadAssignmentUpdatePermission,
    getAllSourceForLeadAssignment,
    setLeadAssignmentDataLength,
    getAllUsersForLeadAssignment,
    getAllProductsForLeadAssignment,
    setLeadAssignmentActivationPermission,
    setLeadAssignmentActivationModal,
} = leadAssignmentSlice.actions;

export default leadAssignmentSlice.reducer;
