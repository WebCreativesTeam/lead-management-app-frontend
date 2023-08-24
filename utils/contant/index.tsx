import Swal from 'sweetalert2';

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
