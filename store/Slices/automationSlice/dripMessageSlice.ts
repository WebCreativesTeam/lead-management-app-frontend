import { LeadStatusSecondaryEndpoint } from '../../../utils/Types/index';
import { IDripMessage, DripMessageInitialStateProps, SourceDataType, UserDataType, ILeadStatus } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: DripMessageInitialStateProps = {
    data: [] as IDripMessage[],
    sourceList: [] as SourceDataType[],
    leadStatusList: [] as LeadStatusSecondaryEndpoint[],
    singleData: {} as IDripMessage,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    userPolicyArr: [] as string[],
    totalRecords: 0,
};

const dripMessageSlice = createSlice({
    initialState,
    name: 'dripMessage',
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
            const findRequestedData: IDripMessage | undefined = state.data.find((item: IDripMessage) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IDripMessage;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: IDripMessage | undefined = state.data.find((item: IDripMessage) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IDripMessage;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: IDripMessage | undefined = state.data.find((item: IDripMessage) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IDripMessage;
            }
        },
        getAllDripMessages(state, action: PayloadAction<IDripMessage[]>) {
            state.data = action.payload;
        },
        getAllLeadStatusForDripMessage(state, action: PayloadAction<LeadStatusSecondaryEndpoint[]>) {
            state.leadStatusList = action.payload;
        },
        getAllSourceForDripMessage(state, action: PayloadAction<SourceDataType[]>) {
            state.sourceList = action.payload;
        },

        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setDripMessageReadPermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setDripMessageCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setDripMessageUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setDripMessageDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setDripMessageDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllDripMessages,
    setDisableBtn,
    setFetching,
    setDripMessageCreatePermission,
    setDripMessageDeletePermission,
    setDripMessageReadPermission,
    setDripMessageUpdatePermission,
    setDripMessageDataLength,
    getAllLeadStatusForDripMessage,
    getAllSourceForDripMessage,
} = dripMessageSlice.actions;
export default dripMessageSlice.reducer;
