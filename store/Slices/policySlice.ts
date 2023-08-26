import { Permission, PolicyDataType, PolicyInitialStateProps } from '@/utils/Types';
import { showToastAlert } from '@/utils/contant';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: PolicyInitialStateProps = {
    data: [] as PolicyDataType[],
    permissions: [] as Permission[],
    singleData: {} as PolicyDataType,
    createModal: false,
    editModal: false,
    deleteModal: false,
    viewModal: false,
    defaultPolicyModal: false,
    isBtnDisabled: false,
    isFetching: false,
    permissionKeyArr: [] as string[],
};

const policySlice = createSlice({
    initialState,
    name: 'policy',
    reducers: {
        setViewModal(state, action) {
            const { open, id } = action.payload;
            state.viewModal = open;
            const findRequestedData: PolicyDataType | undefined = state.data.find((item: PolicyDataType) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as PolicyDataType;
            }
        },
        setEditModal(state, action) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: PolicyDataType | undefined = state.data.find((item: PolicyDataType) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
                state.permissionKeyArr = findRequestedData.permissions;
            } else {
                state.singleData = {} as PolicyDataType;
                state.permissionKeyArr = [];
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
            state.permissionKeyArr = [];
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: PolicyDataType | undefined = state.data.find((item: PolicyDataType) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as PolicyDataType;
            }
        },
        setDefaultPolicyModal(state, action) {
            const { open, id, switchValue } = action.payload;
            if (switchValue === false) {
                showToastAlert('default policy already selected');
                return;
            }
            state.defaultPolicyModal = open;
            const findRequestedData: PolicyDataType | undefined = state.data.find((item: PolicyDataType) => item.id === id);

            if (findRequestedData && state.defaultPolicyModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as PolicyDataType;
            }
        },
        setPermissionKeyArr(state, action: PayloadAction<{ key: string; switchValue: boolean }>) {
            const { key, switchValue } = action.payload;
            if (switchValue) {
                state.permissionKeyArr.push(key);
            } else {
                const index = state.permissionKeyArr.indexOf(key);
                if (index > -1) {
                    state.permissionKeyArr.splice(index, 1);
                }
            }
        },
        getAllPolicies(state, action) {
            state.data = action.payload;
        },
        getAllPermissions(state, action) {
            state.permissions = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
    },
});

export const { setCreateModal, setDeleteModal, setEditModal, setViewModal, getAllPolicies, setDisableBtn, setFetching, getAllPermissions, setPermissionKeyArr, setDefaultPolicyModal } =
    policySlice.actions;
export default policySlice.reducer;
