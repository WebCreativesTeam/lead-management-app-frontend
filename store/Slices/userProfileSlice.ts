import { UserDataType } from '@/utils/Types';
import { fetchUserInfo } from '@/utils/contant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userProfileSlice = createSlice({
    initialState: {
        data: {} as UserDataType,
    },
    name: 'user profile',
    extraReducers(builder) {
        builder.addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserDataType>) => {
            if (action.payload) {
                state.data = action.payload;
            }
        });
    },
    reducers: {},
});

export default userProfileSlice.reducer;
