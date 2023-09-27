import { EmailLogInitialStateProps, IEmailLog, UserDataType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: EmailLogInitialStateProps = {
    data: [] as IEmailLog[],
    singleData: {} as IEmailLog,
    viewModal: false,
    isBtnDisabled: false,
    isFetching: false,
    isAbleToRead: false,
    userPolicyArr: [] as string[],
    totalRecords: 0,
};

const emailLogSlice = createSlice({
    initialState,
    name: 'emailLog',
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
            const findRequestedData: IEmailLog | undefined = state.data.find((item: IEmailLog) => item.id === id);

            if (findRequestedData && state.viewModal) {
                state.singleData = findRequestedData;
            } else {
                state.singleData = {} as IEmailLog;
            }
        },
        getAllEmailLogs(state, action) {
            state.data = action.payload;
        },
        setDisableBtn(state, action) {
            state.isBtnDisabled = action.payload;
        },
        setFetching(state, action) {
            state.isFetching = action.payload;
        },
        setEmailLogReadPolicy(state, action) {
            const verifyPolicy: boolean = state.userPolicyArr.includes(action.payload);
            state.isAbleToRead = verifyPolicy;
        },
        setEmailLogDataLength(state, action: PayloadAction<number>) {
            state.totalRecords = action.payload;
        },
    },
});

export const { setViewModal, getAllEmailLogs, setDisableBtn, setFetching, setEmailLogReadPolicy,setEmailLogDataLength } = emailLogSlice.actions;
export default emailLogSlice.reducer;
