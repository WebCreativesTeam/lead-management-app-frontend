import { PolicyDataType, UserDataType, UserInitialStateProps } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: UserInitialStateProps = {
    data: [] as UserDataType[],
    policies: [] as PolicyDataType[],
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
    isAbleToRead: false,
    isAbleToCreate: false,
    isAbleToUpdate: false,
    isAbleToDelete: false,
    isAbleToUpdatePolicy: false,
    isAbleToChangeActiveStatus: false,
    userPolicyArr: [] as string[],
};

const userSlice = createSlice({
    initialState,
    name: 'user',
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
        setUserReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setUserCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setUserUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setUserDeletePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPolicy;
        },
        setChangeUsersPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdatePolicy = verifyPolicy;
        },
        setChangeActiveStatusPermission(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToChangeActiveStatus = verifyPolicy;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllUsers,
    setDisableBtn,
    setFetching,
    setPolicyModal,
    setDeactivateModal,
    getAllPolicies,
    setUserCreatePolicy,
    setUserDeletePolicy,
    setUserReadPolicy,
    setUserUpdatePolicy,
    setChangeUsersPolicy,
    setChangeActiveStatusPermission,
} = userSlice.actions;
export default userSlice.reducer;
