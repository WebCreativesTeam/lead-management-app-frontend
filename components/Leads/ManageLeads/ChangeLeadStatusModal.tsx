// import ConfirmationModal from '@/components/__Shared/ConfirmationModal';
// import Loader from '@/components/__Shared/Loader';
// import { IRootState } from '@/store';
// import { setChangeStatusModal, setDisableBtn, setFetching } from '@/store/Slices/taskSlice/manageTaskSlice';
// import { showToastAlert } from '@/utils/contant';
// import { ApiClient } from '@/utils/http';
// import React, { memo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// const ChangeLeadStatusModal = () => {
//     const dispatch = useDispatch();
//     const { changeStatusModal, isBtnDisabled, singleData, singleStatus, isFetching } = useSelector((state: IRootState) => state.task);

//     const onChangeStatus = async () => {
//         dispatch(setDisableBtn(true));
//         dispatch(setFetching(true));
//         try {
//             await new ApiClient().patch(`task/${singleData?.id}/status`, { status: singleStatus.id });
//             dispatch(setChangeStatusModal({ open: false }));
//         } catch (error: any) {
//             if (typeof error?.response?.data?.message === 'object') {
//                 showToastAlert(error?.response?.data?.message.join(' , '));
//             } else {
//                 showToastAlert(error?.response?.data?.message);
//             }
//             showToastAlert(error?.response?.data?.message);
//         }
//         dispatch(setFetching(false));
//         dispatch(setDisableBtn(false));
//     };
//     return (
//         <ConfirmationModal
//             open={changeStatusModal}
//             onClose={() => dispatch(setChangeStatusModal({ open: false }))}
//             onDiscard={() => dispatch(setChangeStatusModal({ open: false }))}
//             description={
//                 isFetching ? (
//                     <Loader />
//                 ) : (
//                     <>
//                         Are you sure you want to change this Task Status? <br /> It will not revert!
//                     </>
//                 )
//             }
//             title="Change task status"
//             isBtnDisabled={isBtnDisabled}
//             onSubmit={onChangeStatus}
//             btnSubmitText="Change Status"
//         />
//     );
// };

// export default memo(ChangeLeadStatusModal);


import React from 'react'

const ChangeLeadStatusModal = () => {
  return (
    <div>ChangeLeadStatusModal</div>
  )
}

export default ChangeLeadStatusModal