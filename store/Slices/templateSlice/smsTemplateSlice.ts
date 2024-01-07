import { ISmsTemplate, SmsTemplateInitialStateProps, UserDataType } from '@/utils/Types';
import { PAGE_SIZES, fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: SmsTemplateInitialStateProps = {
    data: [] as ISmsTemplate[],
    singleData: {} as ISmsTemplate,
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

const smsTemplateSlice = createSlice({
    initialState,
    name: 'Sms Template',
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
            const findRequestedData: ISmsTemplate | undefined = state.data.find((item: ISmsTemplate) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ISmsTemplate;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: ISmsTemplate | undefined = state.data.find((item: ISmsTemplate) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ISmsTemplate;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            const findRequestedData: ISmsTemplate | undefined = state.data.find((item: ISmsTemplate) => item.id === id);
            state.deleteModal = open;
            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ISmsTemplate;
            }
        },
        getAllSmsTemplates(state, action: PayloadAction<ISmsTemplate[]>) {
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
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setSmsTemplateReadPermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setSmsTemplateCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setSmsTemplateUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setSmsTemplateDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setSmsTemplateDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllSmsTemplates,
    setDisableBtn,
    setFetching,
    setSmsTemplateCreatePermission,
    setSmsTemplateDataLength,
    setSmsTemplateDeletePermission,
    setSmsTemplateReadPermission,
    setSmsTemplateUpdatePermission,
    setPageSize,
    setPage,
} = smsTemplateSlice.actions;
export default smsTemplateSlice.reducer;
