import { IProduct, ProductColorSecondaryEndpointType, ProductInitialStateProps, UserDataType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ProductInitialStateProps = {
    data: [] as IProduct[],
    singleData: {} as IProduct,
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
    colors: [] as ProductColorSecondaryEndpointType[],
};

const productSlice = createSlice({
    initialState,
    name: 'product',
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
            const findRequestedData: IProduct | undefined = state.data.find((item: IProduct) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IProduct;
            }
        },
        setEditModal(state, action: PayloadAction<{ id?: string; open: boolean }>) {
            const { open, id } = action.payload;
            state.editModal = open;
            const findRequestedData: IProduct | undefined = state.data.find((item: IProduct) => item.id === id);

            if (findRequestedData && state.editModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IProduct;
            }
        },
        setCreateModal(state, action) {
            state.createModal = action.payload;
        },
        setDeleteModal(state, action) {
            const { open, id } = action.payload;
            state.deleteModal = open;
            const findRequestedData: IProduct | undefined = state.data.find((item: IProduct) => item.id === id);

            if (findRequestedData && state.deleteModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IProduct;
            }
        },
        getAllProducts(state, action) {
            state.data = action.payload;
        },
        getAllProductColorForProduct(state, action: PayloadAction<ProductColorSecondaryEndpointType[]>) {
            state.colors = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setProductReadPolicy(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPermission;
        },
        setProductCreatePolicy(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToCreate = verifyPermission;
        },
        setProductUpdatePolicy(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToUpdate = verifyPermission;
        },
        setProductDeletePolicy(state, action) {
            const verifyPermission: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToDelete = verifyPermission;
        },
        setProductDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const {
    setCreateModal,
    setDeleteModal,
    setEditModal,
    setViewModal,
    getAllProducts,
    setDisableBtn,
    setFetching,
    setProductCreatePolicy,
    setProductDeletePolicy,
    setProductReadPolicy,
    setProductUpdatePolicy,
    setProductDataLength,
    getAllProductColorForProduct,
} = productSlice.actions;
export default productSlice.reducer;
