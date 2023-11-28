import { ICustomField, CustomFieldInitialStateProps, UserDataType, IFiedlListType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CustomFieldInitialStateProps = {
    data: [] as ICustomField[],
    singleData: {} as ICustomField,
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
    fieldsList: [] as IFiedlListType[],
};

const customFieldSlice = createSlice({
    initialState,
    name: 'customField',
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
            const findRequestedData: ICustomField | undefined = state.data.find((item: ICustomField) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ICustomField;
            }
        },
        setEditModal(state, action: PayloadAction<{ id?: string; open: boolean }>) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: ICustomField | undefined = state.data.find((item: ICustomField) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ICustomField;
            }
        },
        setCreateModal(state, action: PayloadAction<boolean>) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action: PayloadAction<{ id?: string; open: boolean }>) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: ICustomField | undefined = state.data.find((item: ICustomField) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ICustomField;
            }
        },
        getAllCustomField(state, action) {
            state.data = action.payload;
        },
        getAllFieldsList(state, action: PayloadAction<IFiedlListType[]>) {
            state.fieldsList = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setCustomFieldReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setCustomFieldCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setCustomFieldUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setCustomFieldDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setCustomFieldDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllCustomField,
    setDisableBtn,
    setFetching,
    setCustomFieldCreatePolicy,
    setCustomFieldDeletePolicy,
    setCustomFieldReadPolicy,
    setCustomFieldUpdatePolicy,
    setCustomFieldDataLength,
    getAllFieldsList,
} = customFieldSlice.actions;
export default customFieldSlice.reducer;
