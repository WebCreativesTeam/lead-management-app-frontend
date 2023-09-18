//general types
export type GetMethodResponseType = {
    status: string;
    data: any[];
};

export type SelectOptionsType = {
    value: string;
    label: string;
};

export type Permission = {
    key: string;
    value: string;
};

export type PolicyDataType = {
    name: string;
    id: string;
    description: string;
    permissions: string[];
    isDefault: boolean;
};

//users Page

export type UserDataType = {
    firstName: string;
    lastName: string;
    id: string;
    email: string;
    permissions: string[];
    isActive: boolean;
    isVerified: boolean;
    deactivatedAt: string;
    policies: {
        id: string;
        name: string;
        description: string;
    }[];
};

//source page
export type SourceDataType = {
    name: string;
    createdAt: string;
    updatedAt: string;
    id: string;
};

//taskPage

export type TaskDataType = {
    title: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate: string;
    description: string;
    comment: string;
    isActive: boolean;
    lead: string;
    assignedBy: {
        firstName: string;
        lastName: string;
    };
    status: {
        color: string;
        id: string;
        name: string;
    };
    priority: {
        color: string;
        id: string;
        name: string;
    };
};

export type TaskSelectOptions = {
    name: string;
    color: string;
    id: string;
    createdAt: string;
    updatedAt: string;
};

export type TaskPriorityType = {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
    color: string;
};

export type TaskStatusType = {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
    color: string;
};

export interface ContactDataType {
    id: string;
    title: string;
    name: string;
    phoneNumber: string;
    email: string;
    assignedTo: {
        firstName: string;
        lastName: string;
        id: string;
    };
    source: {
        name: string;
        id: string;
    };
    addedBy: {
        firstName: string;
        lastName: string;
        id: string;
    };
    website: string;
    position: string;
    industry: string;
    facebookProfile: string;
    twitterProfile: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
    };
}

//branch page types //

export type BranchDataType = {
    name: string;
    id: string;
    address: string;
    city: string;
    state: string;
    country: string;
    createdAt: string;
    updatedAt: string;
};

//emails page types

// emails page types
export interface IEmails {
    name: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

// ----------------- authentication types : start -------------------//

export interface ISignInResponse {
    status: string;
    token: string;
    data: UserDataType;
}

// ----------------- authentication types : end -------------------//

///-------- Redux Toolkit Types - START -------------//

export interface InitialStateProps {
    viewModal: boolean;
    editModal: boolean;
    deleteModal: boolean;
    createModal: boolean;
    isBtnDisabled: boolean;
    isFetching: boolean;
    isAbleToRead: boolean;
    isAbleToCreate: boolean;
    isAbleToUpdate: boolean;
    isAbleToDelete: boolean;
    userPolicyArr: string[];
}

//contact slice initial props
export interface ContactInitialStateProps extends InitialStateProps {
    data: ContactDataType[];
    singleData: ContactDataType;
}
//manage task slice initial props
export interface ManageTaskInitialStateProps extends InitialStateProps {
    data: TaskDataType[];
    singleData: TaskDataType;
    taskPriorityList: TaskSelectOptions[];
    taskStatusList: TaskSelectOptions[];
    changePriorityModal: boolean;
    changeStatusModal: boolean;
    singlePriority: TaskSelectOptions;
    singleStatus: TaskSelectOptions;
}

//source slice initial props
export interface SourceInitialStateProps extends InitialStateProps {
    data: SourceDataType[];
    singleData: SourceDataType;
}

//policy slice initial props
export interface PolicyInitialStateProps extends InitialStateProps {
    data: PolicyDataType[];
    singleData: PolicyDataType;
    permissions: Permission[];
    permissionKeyArr: string[];
    defaultPolicyModal: boolean;
    isAbleToChangeDefaultPolicy: boolean;
}

//task status slice initial props
export interface TaskStatusInitialStateProps extends InitialStateProps {
    data: TaskStatusType[];
    singleData: TaskStatusType;
    defaultStatusModal: boolean;
    isAbleToChangeDefaultStatus: boolean;
}

//task priority slice initial props
export interface TaskPriorityInitialStateProps extends InitialStateProps {
    data: TaskPriorityType[];
    singleData: TaskPriorityType;
    defaultPriorityModal: boolean;
    isAbleToChangeDefaultPriority: boolean;
}

//branch slice initial props
export interface BranchInitialStateProps extends InitialStateProps {
    data: BranchDataType[];
    singleData: BranchDataType;
}

//user slice initial props
export interface UserInitialStateProps extends InitialStateProps {
    data: UserDataType[];
    policies: PolicyDataType[];
    singleData: UserDataType;
    policyModal: boolean;
    deactivateModal: boolean;
    deactivateValue: boolean;
    isAbleToUpdatePolicy: boolean;
    isAbleToChangeActiveStatus: boolean;
}

// email slice initial props
export interface EmailsInitialStateProps {
    data: IEmails[];
    singleData: IEmails;
    deleteModal: boolean;
    isBtnDisabled: boolean;
    isFetching: boolean;
    viewModal: boolean;
}

///-------- Redux Toolkit Types - END -------------//
