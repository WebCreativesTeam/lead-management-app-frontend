import {
    ICampaign,
    CampaignInitialStateProps,
    SourceDataType,
    UserDataType,
    GetMethodResponseType,
    ICustomField,
    LeadStatusSecondaryEndpoint,
    ILeadStatus,
    ProductSecondaryEndpointType,
} from '@/utils/Types';
import { PAGE_SIZES, fetchUserInfo } from '@/utils/contant';
import { ApiClient } from '@/utils/http';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: CampaignInitialStateProps = {
    data: [] as ICampaign[],
    sourceList: [] as SourceDataType[],
    leadStatusList: [] as ILeadStatus[],
    singleData: {} as ICampaign,
    leadProductList: [] as ProductSecondaryEndpointType[],
    emailTemplateList: [] as ProductSecondaryEndpointType[],
    whatsappTemplateList: [] as ProductSecondaryEndpointType[],
    smsTemplateList: [] as ProductSecondaryEndpointType[],
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
    isAbleToActivateCampaign: false,
    userPolicyArr: [] as string[],
    totalRecords: 0,
    customDateFields: [] as ICustomField[],
    pageSize: PAGE_SIZES[0],
    page: 1,
};

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
        setEditModal(state, action: PayloadAction<{ open: boolean; id?: string }>) {
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
            let srNoArray: number[] = [];
            for (let i = state.pageSize * state.page - state.pageSize; i <= state.pageSize * state.page; i++) {
                srNoArray.push(i);
            }
            srNoArray.shift();
            if (action.payload.length > 0) {
                const serializedData = action.payload?.map((item, index) => {
                    return { ...item, srNo: srNoArray[index] };
                });
                state.data = serializedData;
            }
        },
        setPage(state, { payload }: PayloadAction<number>) {
            state.page = payload;
        },
        setPageSize(state, { payload }: PayloadAction<number>) {
            state.pageSize = payload;
        },
        getAllLeadStatusForCampaign(state, action: PayloadAction<ILeadStatus[]>) {
            state.leadStatusList = action.payload;
        },
        getAllSourceForCampaign(state, action: PayloadAction<SourceDataType[]>) {
            state.sourceList = action.payload;
        },
        getAllProductsForCampaign(state, action: PayloadAction<ProductSecondaryEndpointType[]>) {
            state.leadProductList = action.payload;
        },
        getAllEmailTemplatesForCampaign(state, action: PayloadAction<ProductSecondaryEndpointType[]>) {
            state.emailTemplateList = action.payload;
        },
        getAllWhatsappTemplatesForCampaign(state, action: PayloadAction<ProductSecondaryEndpointType[]>) {
            state.whatsappTemplateList = action.payload;
        },
        getAllSmsTemplatesForCampaign(state, action: PayloadAction<ProductSecondaryEndpointType[]>) {
            state.smsTemplateList = action.payload;
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
        setCampaignCreatePermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setCampaignUpdatePermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setCampaignDeletePermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setCampaignActivationPermission(state, action: PayloadAction<string>) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToActivateCampaign = verifyPermission;
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
    getAllProductsForCampaign,
    setCampaignActivationPermission,
    getAllEmailTemplatesForCampaign,
    getAllWhatsappTemplatesForCampaign,
    getAllSmsTemplatesForCampaign,
    setPageSize,
    setPage,
} = campaignSlice.actions;
export default campaignSlice.reducer;
