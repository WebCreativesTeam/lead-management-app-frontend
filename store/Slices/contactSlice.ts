import { ContactDataType, ContactInitialStateProps, SourceDataType, UserDataType } from '@/utils/Types';
import { fetchUserInfo, showToastAlert } from '@/utils/contant';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: ContactInitialStateProps = {
    data: [] as ContactDataType[],
    singleData: {} as ContactDataType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    isAbleToCreate: false,
    isAbleToDelete: false,
    isAbleToRead: false,
    isAbleToUpdate: false,
    userPolicyArr: [] as string[],
    usersList: [] as UserDataType[],
    sourceList: [] as SourceDataType[],
};

const contactSlice = createSlice({
    initialState,
    name: 'contact',
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
            const findRequestedData: ContactDataType | undefined = state.data.find((item: ContactDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ContactDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: ContactDataType | undefined = state.data.find((item: ContactDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ContactDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: ContactDataType | undefined = state.data.find((item: ContactDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as ContactDataType;
            }
        },
        getAllContacts(state, action) {
            state.data = action.payload;
        },
        getAllUsersForContact(state, action) {
            state.usersList = action.payload;
        },
        getAllSourceForContact(state, action) {
            state.sourceList = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setContactReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setContactCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setContactUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setContactDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllContacts,
    setDisableBtn,
    setFetching,
    setContactCreatePolicy,
    setContactDeletePolicy,
    setContactReadPolicy,
    setContactUpdatePolicy,
    getAllUsersForContact,
    getAllSourceForContact
} = contactSlice.actions;
export default contactSlice.reducer;
