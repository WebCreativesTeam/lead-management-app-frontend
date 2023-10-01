import { IWhatsappTemplate, WhatsappTemplateInitialStateProps, UserDataType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WhatsappTemplateInitialStateProps = {
    data: [] as IWhatsappTemplate[],
    singleData: {} as IWhatsappTemplate,
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

const whatsappTemplateSlice = createSlice({
    initialState,
    name: 'Whatsapp Template',
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
            const findRequestedData: IWhatsappTemplate | undefined = state.data.find((item: IWhatsappTemplate) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IWhatsappTemplate;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: IWhatsappTemplate | undefined = state.data.find((item: IWhatsappTemplate) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IWhatsappTemplate;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            const findRequestedData: IWhatsappTemplate | undefined = state.data.find((item: IWhatsappTemplate) => item.id === id);
            state.deleteModal = open;
            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IWhatsappTemplate;
            }
        },
        getAllWhatsappTemplates(state, action) {
            state.data = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setWhatsappTemplateReadPermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setWhatsappTemplateCreatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setWhatsappTemplateUpdatePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setWhatsappTemplateDeletePermission(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setWhatsappTemplateDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllWhatsappTemplates,
    setDisableBtn,
    setFetching,
    setWhatsappTemplateCreatePermission,
    setWhatsappTemplateDataLength,
    setWhatsappTemplateDeletePermission,
    setWhatsappTemplateReadPermission,
    setWhatsappTemplateUpdatePermission,
} = whatsappTemplateSlice.actions;
export default whatsappTemplateSlice.reducer;
