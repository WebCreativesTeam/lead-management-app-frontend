import { IEmailTemplate, EmailTemplateInitialStateProps, UserDataType } from '@/utils/Types';
import { PAGE_SIZES, fetchUserInfo } from '@/utils/contant';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: EmailTemplateInitialStateProps = {
    data: [] as IEmailTemplate[],
    singleData: {} as IEmailTemplate,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    isAbleToCreate: false,
    isAbleToDelete: false,
    isAbleToRead: false,
    isAbleToUpdate: false,
    userPolicyArr: [] as string[],
    totalRecords: 0,
    pageSize: PAGE_SIZES[0],
    page: 1,
};

const emailTemplateSlice = createSlice({
    initialState,
    name: 'email template',
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
            const findRequestedData: IEmailTemplate | undefined = state.data.find((item: IEmailTemplate) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IEmailTemplate;
            }
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: IEmailTemplate | undefined = state.data.find((item: IEmailTemplate) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IEmailTemplate;
            }
        },
        getAllEmailTemplates(state, action: PayloadAction<IEmailTemplate[]>) {
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
        setEmailTemplateReadPermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setEmailTemplateCreatePermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setEmailTemplateUpdatePermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setEmailTemplateDeletePermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setEmailTemplateDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setDeleteModal,
    setViewModal,
    getAllEmailTemplates,
    setDisableBtn,
    setFetching,
    setEmailTemplateCreatePermission,
    setEmailTemplateDeletePermission,
    setEmailTemplateReadPermission,
    setEmailTemplateUpdatePermission,
    setEmailTemplateDataLength,
    setPageSize,
    setPage,
} = emailTemplateSlice.actions;
export default emailTemplateSlice.reducer;
