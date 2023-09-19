import { IEmailTemplate, EmailsInitialStateProps } from '@/utils/Types';
import { fetchUserPermissionArray } from '@/utils/contant';
import { createSlice } from '@reduxjs/toolkit';

const initialState: EmailsInitialStateProps = {
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
};

const emailTemplateSlice = createSlice({
    initialState,
    name: 'email template',
    extraReducers(builder) {
        builder.addCase(fetchUserPermissionArray.fulfilled, (state, action) => {
            if (action.payload) {
                state.userPolicyArr = action.payload;
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
        getAllEmailTemplates(state, action) {
            state.data = action.payload;
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
} = emailTemplateSlice.actions;
export default emailTemplateSlice.reducer;
