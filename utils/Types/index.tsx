//general types
export type GetMethodResponseType = {
    status: string;
    data: any[];
    meta: {
        currentPage: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
    };
};

export type SelectOptionsType = {
    value: string;
    label: string | React.ReactNode;
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
    token: string;
};

export type UserListSecondaryEndpointType = {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
};

//source page
export type SourceDataType = {
    name: string;
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
    lead: {
        id: string;
        contactId: string;
        branchId: string;
        sourceId: string;
        statusId: string;
        priorityId: string;
        contact: {
            email: string;
            name: string;
        };
    };
    assignedBy: {
        firstName: string;
        lastName: string;
        id: string;
        email: string;
    };
    assignedTo: {
        firstName: string;
        lastName: string;
        id: string;
        email: string;
    };
    observer: {
        firstName: string;
        lastName: string;
        id: string;
        email: string;
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

export type TaskStatusSecondaryEndpoint = {
    name: string;
    color: string;
    id: string;
};
export type LeadStatusSecondaryEndpoint = {
    name: string;
    color: string;
    id: string;
};
export type LeadPrioritySecondaryEndpoint = {
    name: string;
    color: string;
    id: string;
};
export type BranchListSecondaryEndpoint = {
    name: string;
    id: string;
};

export type PolicyListSecondaryEndpoint = {
    name: string;
    id: string;
};

export type ContactListSecondaryEndpoint = {
    name: string;
    id: string;
    email: string;
};

export type LeadSelectOptions = {
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

export type TaskPrioritySecondaryEndpoint = {
    name: string;
    color: string;
    id: string;
};
export type LeadPriorityType = {
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
export type LeadStatusType = {
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
        email: string;
    };
    source: {
        name: string;
        id: string;
    };
    addedBy: {
        firstName: string;
        lastName: string;
        id: string;
        email: string;
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

// email template types
export interface IEmailTemplate {
    name: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

// send email types
export interface IEmailLog {
    id: string;
    senderName: string;
    senderEmail: string;
    receiverEmail: string;
    subject: string;
    message: string;
    templateId: string;
    createdAt: string;
    updatedAt: string;
}

//sms template types
export interface ISmsTemplate {
    id: string;
    name: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

//whatsapp template types
export interface IWhatsappTemplate extends ISmsTemplate {}

//lead page types
export type LeadDataType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    reference: string;
    estimatedDate: string;
    estimatedBudget: string;
    DOB: string;
    facebookCampaignName: string;
    serviceInterestedIn: string;
    job: string;
    description: string;
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
    contact: ContactDataType;
    source: SourceDataType;
    branch: BranchDataType;
};

export type LeadListSecondaryEndpointType = {
    contact: {
        id: string;
        name: string;
        email: string;
    };
};

export interface ILeadStatus {
    id: string;
    name: string;
    color: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ILeadPriority {
    id: string;
    name: string;
    color: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

//Emails SMTP types
export interface IEmailSmtp {
    id: string;
    SMTP: 'SSL' | 'TLS' | 'STARTTLS' | 'none';
    host: string;
    port: string;
    security: 'Gmail' | 'Yahoo' | 'Outlook' | 'Hotmail';
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

//lead Rule types
export interface ILeadRules {
    id: string;
    name: string;
    isEdited: boolean;
    isAdded: boolean;
    source: SourceDataType;
}

// ----------------- authentication types : start -------------------//

export interface ISignInResponse {
    status: string;
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
    totalRecords: number;
}

//contact slice initial props
export interface ContactInitialStateProps extends InitialStateProps {
    data: ContactDataType[];
    singleData: ContactDataType;
    usersList: UserListSecondaryEndpointType[];
    sourceList: SourceDataType[];
}

//lead rules slice initial props
export interface LeadRuleInitialStateProps extends InitialStateProps {
    data: ILeadRules[];
    singleData: ILeadRules;
    sourceList: SourceDataType[];
}
//manage task slice initial props
export interface ManageTaskInitialStateProps extends InitialStateProps {
    data: TaskDataType[];
    singleData: TaskDataType;
    taskPriorityList: TaskPrioritySecondaryEndpoint[];
    taskStatusList: TaskStatusSecondaryEndpoint[];
    usersList: UserListSecondaryEndpointType[];
    leadsList: LeadListSecondaryEndpointType[];
    changePriorityModal: boolean;
    changeStatusModal: boolean;
    singlePriority: TaskPrioritySecondaryEndpoint;
    singleStatus: TaskStatusSecondaryEndpoint;
    isAbleToTransferTask: boolean;
    transferTaskModal: boolean;
}
//manage lead slice initial props
export interface ManageLeadInitialStateProps extends InitialStateProps {
    data: LeadDataType[];
    singleData: LeadDataType;
    leadPriorityList: LeadPrioritySecondaryEndpoint[];
    leadStatusList: LeadStatusSecondaryEndpoint[];
    changePriorityModal: boolean;
    changeStatusModal: boolean;
    singlePriority: LeadPrioritySecondaryEndpoint;
    singleStatus: LeadStatusSecondaryEndpoint;
    leadContactsList: ContactListSecondaryEndpoint[];
    leadBranchList: BranchListSecondaryEndpoint[];
    leadSourceList: SourceDataType[];
    leadUserList: UserListSecondaryEndpointType[];
}

//source slice initial props
export interface SourceInitialStateProps extends InitialStateProps {
    data: SourceDataType[];
    singleData: SourceDataType;
}

//email smtp slice initial props
export interface EmailSmtpInitialStateProps extends InitialStateProps {
    data: IEmailSmtp[];
    singleData: IEmailSmtp;
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

//sms template slice initial props
export interface SmsTemplateInitialStateProps extends InitialStateProps {
    data: ISmsTemplate[];
    singleData: ISmsTemplate;
}
//whatsapp template slice initial props
export interface WhatsappTemplateInitialStateProps extends InitialStateProps {
    data: IWhatsappTemplate[];
    singleData: IWhatsappTemplate;
}

//task status slice initial props
export interface LeadStatusInitialStateProps extends InitialStateProps {
    data: LeadStatusType[];
    singleData: LeadStatusType;
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

//lead priority slice initial props
export interface LeadPriorityInitialStateProps extends InitialStateProps {
    data: LeadPriorityType[];
    singleData: LeadPriorityType;
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
    policies: PolicyListSecondaryEndpoint[];
    singleData: UserDataType;
    policyModal: boolean;
    deactivateModal: boolean;
    deactivateValue: boolean;
    isAbleToUpdatePolicy: boolean;
    isAbleToChangeActiveStatus: boolean;
    totalRecords: number;
}

// email slice initial props
export interface EmailTemplateInitialStateProps {
    data: IEmailTemplate[];
    singleData: IEmailTemplate;
    deleteModal: boolean;
    isBtnDisabled: boolean;
    isFetching: boolean;
    viewModal: boolean;
    isAbleToRead: boolean;
    isAbleToCreate: boolean;
    isAbleToUpdate: boolean;
    isAbleToDelete: boolean;
    userPolicyArr: string[];
    totalRecords: number;
}

// email slice initial props
export interface EmailLogInitialStateProps {
    data: IEmailLog[];
    singleData: IEmailLog;
    isBtnDisabled: boolean;
    isFetching: boolean;
    viewModal: boolean;
    isAbleToRead: boolean;
    userPolicyArr: string[];
    totalRecords: number;
}

///-------- Redux Toolkit Types - END -------------//

export interface ICountryData {
    country: string;
    states: string[];
}
