import { PolicyDataType, UserDataType, UserInitialStateProps } from '@/utils/Types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: UserInitialStateProps = {
    data: [] as UserDataType[],
    policies:[] as PolicyDataType[],
    singleData: {} as UserDataType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    policyModal: false,
    isBtnDisabled: false,
    isFetching: false,
    deactivateModal: false,
    deactivateValue: false,
};

const userSlice = createSlice({
    initialState,
    name: 'user',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: UserDataType | undefined = state.data.find((item: UserDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as UserDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: UserDataType | undefined = state.data.find((item: UserDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as UserDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: UserDataType | undefined = state.data.find((item: UserDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as UserDataType;
            }
        },
        setPolicyModal(state, action) {
            const { open, id } = action.payload;
            state.policyModal = open;
            const findRequestedData: UserDataType | undefined = state.data.find((item: UserDataType) => item.id === id);

            if (findRequestedData && state.policyModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as UserDataType;
            }
        },
        setDeactivateModal(state, action) {
            const { open, id, value } = action.payload;
            state.deactivateModal = open;
            state.deactivateValue = value;
            const findRequestedData: UserDataType | undefined = state.data.find((item: UserDataType) => item.id === id);

            if (findRequestedData && state.deactivateModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as UserDataType;
            }
        },
        getAllUsers(state, action) {
            state.data = action.payload;
        },
        getAllPolicies(state, action) {
            state.policies = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
    },
});

export const { setCreateModal, setDeleteModal, setEditModal, setViewModal, getAllUsers, setDisableBtn, setFetching, setPolicyModal, setDeactivateModal,getAllPolicies } = userSlice.actions;
export default userSlice.reducer;
