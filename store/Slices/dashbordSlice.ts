import { LeadStatusSecondaryEndpoint } from '@/utils/Types';
import { DashboardInitialStateProps, SourceDataType, UserDataType, ILeadStatus, IFollowup } from '@/utils/Types';
import { PAGE_SIZES, fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: DashboardInitialStateProps = {
    todayFollowUps: [] as IFollowup[],
    tomorrowFollowUps: [] as IFollowup[],
    pendingFollowUps: [] as IFollowup[],
    sourceList: [] as SourceDataType[],
    leadStatusList: [] as LeadStatusSecondaryEndpoint[],
    singleData: {} as IFollowup,
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
    pageSize: PAGE_SIZES[0],
    page: 1,
};

const dashboardSlice = createSlice({
    initialState,
    name: 'dashboard',
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
            const findRequestedData: IFollowup | undefined = state.todayFollowUps.find((item: IFollowup) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IFollowup;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: IFollowup | undefined = state.todayFollowUps.find((item: IFollowup) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IFollowup;
            }
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: IFollowup | undefined = state.todayFollowUps.find((item: IFollowup) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IFollowup;
            }
        },
        getAllTodayFollowups(state, action: PayloadAction<IFollowup[]>) {
            state.todayFollowUps = action.payload;
        },
        getAllTomorrowFollowups(state, action: PayloadAction<IFollowup[]>) {
            state.tomorrowFollowUps = action.payload;
        },
        getAllPendingFollowups(state, action: PayloadAction<IFollowup[]>) {
            state.todayFollowUps = action.payload;
        },
        getAllLeadStatusForDashboard(state, action: PayloadAction<LeadStatusSecondaryEndpoint[]>) {
            state.leadStatusList = action.payload;
        },
        getAllSourceForDashboard(state, action: PayloadAction<SourceDataType[]>) {
            state.sourceList = action.payload;
        },

        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setDashboardReadPermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setDashboardCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setDashboardUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setDashboardDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setDashboardDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllTodayFollowups,
    getAllTomorrowFollowups,
    getAllPendingFollowups,
    setDisableBtn,
    setFetching,
    setDashboardCreatePermission,
    setDashboardDeletePermission,
    setDashboardReadPermission,
    setDashboardUpdatePermission,
    setDashboardDataLength,
    getAllLeadStatusForDashboard,
    getAllSourceForDashboard,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
