import { ICampaign, CampaignInitialStateProps, SourceDataType, UserDataType, GetMethodResponseType, ICustomField, LeadStatusSecondaryEndpoint, ILeadStatus } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { ApiClient } from '@/utils/http';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: CampaignInitialStateProps = {
    data: [] as ICampaign[],
    sourceList: [] as SourceDataType[],
    leadStatusList: [] as ILeadStatus[],
    singleData: {} as ICampaign,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    campaignActivationModal: false,
    isBtnDisabled: false,
    isFetching: false,
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    userPolicyArr: [] as string[],
    totalRecords: 0,
    customDateFields: [] as ICustomField[],
};

// const getCustomDateFieldsList = async () => {
//     const res: GetMethodResponseType = await new ApiClient().get('custom-field?fieldType=DATE');
//     const customDateFields: ICustomField[] = res?.data;
//     if (typeof customDateFields === 'undefined') {
//         dispatch(getAllCustomDates([] as ICustomField[]));
//         return;
//     }
//     dispatch(getAllCustomDates(customDateFields));
// };

export const getCustomDateFieldsList = createAsyncThunk('getCustomDates', async () => {
    const res: GetMethodResponseType = await new ApiClient().get('custom-field?fieldType=DATE');
    const customDateFields: ICustomField[] = res?.data;
    return customDateFields;
});

const campaignSlice = createSlice({
    initialState,
    name: 'campaign',
    extraReducers(builder) {
        builder.addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserDataType>) => {
            if (action.payload) {
                state.userPolicyArr = action.payload.permissions;
            }
        });
        builder.addCase(getCustomDateFieldsList.fulfilled, (state, action: PayloadAction<ICustomField[]>) => {
            state.customDateFields = action.payload;
            state.isFetching = false;
        });
        builder.addCase(getCustomDateFieldsList.pending, (state) => {
            state.isFetching = true;
        });
        builder.addCase(getCustomDateFieldsList.rejected, (state) => {
            state.isFetching = false;
        });
    },
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: ICampaign | undefined = state.data.find((item: ICampaign) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ICampaign;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: ICampaign | undefined = state.data.find((item: ICampaign) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ICampaign;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: ICampaign | undefined = state.data.find((item: ICampaign) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ICampaign;
            }
        },
        setCampaigndActivationModal(state, action: PayloadAction<{ open: boolean; id?: string }>) {
            const { open, id } = action.payload;
            state.campaignActivationModal = open;
            const findRequestedData: ICampaign | undefined = state.data.find((item: ICampaign) => item.id === id);

            if (findRequestedData && state.campaignActivationModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ICampaign;
            }
        },
        getAllCampaigns(state, action: PayloadAction<ICampaign[]>) {
            state.data = action.payload;
        },
        getAllLeadStatusForCampaign(state, action: PayloadAction<ILeadStatus[]>) {
            state.leadStatusList = action.payload;
        },
        getAllSourceForCampaign(state, action: PayloadAction<SourceDataType[]>) {
            state.sourceList = action.payload;
        },

        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setCampaignReadPermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setCampaignCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setCampaignUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setCampaignDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setCampaignDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllCampaigns,
    setDisableBtn,
    setFetching,
    setCampaignCreatePermission,
    setCampaignDeletePermission,
    setCampaignReadPermission,
    setCampaignUpdatePermission,
    setCampaignDataLength,
    getAllLeadStatusForCampaign,
    getAllSourceForCampaign,
    setCampaigndActivationModal,
} = campaignSlice.actions;
export default campaignSlice.reducer;
