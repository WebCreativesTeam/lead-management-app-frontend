import { LeadStatusSecondaryEndpoint } from '../../../utils/Types/index';
import { IScheduleMessage, ScheduleMessageInitialStateProps, SourceDataType, UserDataType, ILeadStatus } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ScheduleMessageInitialStateProps = {
    data: [] as IScheduleMessage[],
    sourceList: [] as SourceDataType[],
    leadStatusList: [] as LeadStatusSecondaryEndpoint[],
    singleData: {} as IScheduleMessage,
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

const scheduleMessageSlice = createSlice({
    initialState,
    name: 'scheduleMessage',
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
            const findRequestedData: IScheduleMessage | undefined = state.data.find((item: IScheduleMessage) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IScheduleMessage;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: IScheduleMessage | undefined = state.data.find((item: IScheduleMessage) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IScheduleMessage;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: IScheduleMessage | undefined = state.data.find((item: IScheduleMessage) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IScheduleMessage;
            }
        },
        getAllScheduleMessages(state, action: PayloadAction<IScheduleMessage[]>) {
            state.data = action.payload;
        },
        getAllLeadStatusForScheduleMessage(state, action: PayloadAction<LeadStatusSecondaryEndpoint[]>) {
            state.leadStatusList = action.payload;
        },
        getAllSourceForScheduleMessage(state, action: PayloadAction<SourceDataType[]>) {
            state.sourceList = action.payload;
        },

        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setScheduleMessageReadPermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setScheduleMessageCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setScheduleMessageUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setScheduleMessageDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setScheduleMessageDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllScheduleMessages,
    setDisableBtn,
    setFetching,
    setScheduleMessageCreatePermission,
    setScheduleMessageDeletePermission,
    setScheduleMessageReadPermission,
    setScheduleMessageUpdatePermission,
    setScheduleMessageDataLength,
    getAllLeadStatusForScheduleMessage,
    getAllSourceForScheduleMessage,
} = scheduleMessageSlice.actions;
export default scheduleMessageSlice.reducer;
