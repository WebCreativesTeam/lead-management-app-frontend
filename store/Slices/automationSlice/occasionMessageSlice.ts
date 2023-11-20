import { LeadStatusSecondaryEndpoint } from '../../../utils/Types/index';
import { IOccasionMessage, OccasionMessageInitialStateProps, SourceDataType, UserDataType, ILeadStatus } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: OccasionMessageInitialStateProps = {
    data: [] as IOccasionMessage[],
    sourceList: [] as SourceDataType[],
    leadStatusList: [] as LeadStatusSecondaryEndpoint[],
    singleData: {} as IOccasionMessage,
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

const occasionMessageSlice = createSlice({
    initialState,
    name: 'occasionMessage',
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
            const findRequestedData: IOccasionMessage | undefined = state.data.find((item: IOccasionMessage) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IOccasionMessage;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: IOccasionMessage | undefined = state.data.find((item: IOccasionMessage) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IOccasionMessage;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: IOccasionMessage | undefined = state.data.find((item: IOccasionMessage) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IOccasionMessage;
            }
        },
        getAllOccasionMessages(state, action: PayloadAction<IOccasionMessage[]>) {
            state.data = action.payload;
        },
        getAllLeadStatusForOccasionMessage(state, action: PayloadAction<LeadStatusSecondaryEndpoint[]>) {
            state.leadStatusList = action.payload;
        },
        getAllSourceForOccasionMessage(state, action: PayloadAction<SourceDataType[]>) {
            state.sourceList = action.payload;
        },

        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setOccasionMessageReadPermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setOccasionMessageCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setOccasionMessageUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setOccasionMessageDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setOccasionMessageDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllOccasionMessages,
    setDisableBtn,
    setFetching,
    setOccasionMessageCreatePermission,
    setOccasionMessageDeletePermission,
    setOccasionMessageReadPermission,
    setOccasionMessageUpdatePermission,
    setOccasionMessageDataLength,
    getAllLeadStatusForOccasionMessage,
    getAllSourceForOccasionMessage,
} = occasionMessageSlice.actions;
export default occasionMessageSlice.reducer;
