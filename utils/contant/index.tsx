import { createAsyncThunk } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import { Permission, UserDataType } from '../Types';
import { ApiClient } from '../http';


export function showToastAlert(errMsg: string) {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
    toast.fire({
        icon: 'error',
        title: errMsg,
        padding: '10px 20px',
    });
}

export const fetchUserPermissionArray: any = createAsyncThunk('user/id', async (arg, thunkApi) => {
    const id: string | null = localStorage.getItem('uid');
    if (id) {
        try {
            const userData: { status: string; data: UserDataType } = await new ApiClient().get('user/' + id);
            return userData?.data?.permissions;
        } catch (error: any) {
            showToastAlert(error?.message);
            return thunkApi.rejectWithValue(error?.message);
        }
    }
});
