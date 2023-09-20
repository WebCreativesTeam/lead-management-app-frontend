import { BranchDataType, BranchInitialStateProps, Permission, UserDataType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: BranchInitialStateProps = {
    data: [] as BranchDataType[],
    singleData: {} as BranchDataType,
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
};

const branchSlice = createSlice({
    initialState,
    name: 'branch',
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
            const findRequestedData: BranchDataType | undefined = state.data.find((item: BranchDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as BranchDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: BranchDataType | undefined = state.data.find((item: BranchDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as BranchDataType;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: BranchDataType | undefined = state.data.find((item: BranchDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as BranchDataType;
            }
        },
        getAllBranches(state, action) {
            state.data = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setBranchReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setBranchCreatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPolicy;
        },
        setBranchUpdatePolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPolicy;
        },
        setBranchDeletePolicy(state, action) {
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
    getAllBranches,
    setDisableBtn,
    setFetching,
    setBranchCreatePolicy,
    setBranchDeletePolicy,
    setBranchReadPolicy,
    setBranchUpdatePolicy,
} = branchSlice.actions;
export default branchSlice.reducer;
