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

export interface ICommonResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
}

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
    srNo: number;
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
    srNo: number;
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
    srNo: number;
};

//source page
export type IProduct = {
    name: string;
    id: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    subProducts: { id: string; name: string; colors: { id: string; name: string; value: string }[] }[];
    srNo: number;
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
    srNo: number;
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
    srNo: number;
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
    srNo: number;
};

export type TaskStatusType = {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
    color: string;
    srNo: number;
};
export type LeadStatusType = {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
    color: string;
    srNo: number;
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
    altPhoneNumber: string;
    DOB: string;
    anniversary: string;
    srNo: number;
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
    srNo: number;
};

// email template types
export interface IEmailTemplate {
    name: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    srNo: number;
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
    srNo: number;
}

//whatsapp template types
export interface IWhatsappTemplate extends ISmsTemplate {}

enum Gender {
    Male = 'M',
    Female = 'F',
    Others = 'Others',
}

//lead page types
export type LeadDataType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    productId: string;
    subProductId: string;
    estimatedDate: string;
    followUpDate: string;
    gender: Gender;
    zip: string;
    customFields: any;
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
    srNo: number;
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
    srNo: number;
}

export interface ILeadPriority {
    id: string;
    name: string;
    color: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    srNo: number;
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
    srNo: number;
}

//campaign page

export enum CampaignType {
    'SCHEDULED',
    DRIP,
    OCCASIONAL,
}

export interface ICampaign {
    id: string;
    type: 'SCHEDULED' | 'DRIP' | 'OCCASIONAL';
    name: string;
    sourceId: string;
    productId: string;
    customDateId: string;
    status: ILeadStatus;
    sendBefore: string;
    sendAfter: string;
    hour: string;
    date: string;
    updatedAt: string;
    createdAt: string;
    sendTo: string;
    isActive: boolean;
    instance: { platform: string; templateId: string }[];
    isAllSource?: boolean;
    isAllProduct?: boolean;
    isAllStatus?: boolean;
    srNo: number;
}

// dashboard page types
export interface IFollowup {
    name: string;
    phoneNumber: string;
    source: SourceDataType;
    product: string;
    status: LeadStatusSecondaryEndpoint;
    priority: LeadPrioritySecondaryEndpoint;
    createdAt: string;
    updatedAt: string;
    nextFollowup: string;
    id: string;
}

// Custom field data types

export interface ICustomField {
    id: string;
    label: string;
    createdAt: string;
    updatedAt: string;
    fieldType: string;
    order: string;
    required: boolean;
    active: boolean;
    conditional: boolean;
    parentId: string;
    operator: string;
    options: { name: string; value: string }[];
    parentValue: string;
    srNo: number;
}

export interface IFiedlListType {
    label: string;
    id: string;
}

export interface IProductColor {
    id: string;
    name: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    srNo: number;
}

export interface ProductColorSecondaryEndpointType {
    id: string;
    name: string;
    value: string;
}

export interface ProductSecondaryEndpointType {
    id: string;
    name: string;
}

export interface ILeadNotes {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    content: string;
    userId: string;
    leadId: string;
    srNo: number;
}

export interface ILeadAssignment extends ICommonResponse {
    name: string;
    product: {
        id: string;
        name: string;
    };
    source: {
        id: string;
        name: string;
    };
    isActive: boolean;
    userPercentages: {
        userId: string;
        percentage: string;
    }[];
    isAllSource: boolean;
    isAllProduct: boolean;
    srNo: number;
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
    page: number;
    pageSize: number;
}

//contact slice initial props
export interface ContactInitialStateProps extends InitialStateProps {
    data: ContactDataType[];
    singleData: ContactDataType;
    usersList: UserListSecondaryEndpointType[];
    sourceList: SourceDataType[];
}

//lead rules slice initial props
export interface LeadAssignmentInitialStateProps extends InitialStateProps {
    data: ILeadAssignment[];
    singleData: ILeadAssignment;
    sourceList: SourceDataType[];
    usersList: UserListSecondaryEndpointType[];
    productList: ProductSecondaryEndpointType[];
    isAbleToActivate: boolean;
    leadAssignmentActivationModal: boolean;
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

export type OverviewFormType = {
    estimatedDate: string;
    followUpDate: string;
    sourceId: string;
    priorityId: string;
    branchId: string;
    contactId: string;
    productId: string;
    zip: string;
    subProductId: string;
    gender: string;
};
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
    customFieldsList: ICustomField[];
    leadProductList: ProductSecondaryEndpointType[];
    leadSubProductList: ProductSecondaryEndpointType[];
    activeTab: number;
    overViewFormData: OverviewFormType;
    isOverviewTabDisabled: boolean;
    leadNoteList: ILeadNotes[];
}

//source slice initial props
export interface SourceInitialStateProps extends InitialStateProps {
    data: SourceDataType[];
    singleData: SourceDataType;
}

//product slice initial props
export interface ProductInitialStateProps extends InitialStateProps {
    data: IProduct[];
    singleData: IProduct;
    colors: ProductColorSecondaryEndpointType[];
}
//productColor slice initial props
export interface ProductColorInitialStateProps extends InitialStateProps {
    data: IProductColor[];
    singleData: IProductColor;
}

//custom field slice initial props
export interface CustomFieldInitialStateProps extends InitialStateProps {
    data: ICustomField[];
    singleData: ICustomField;
    fieldsList: IFiedlListType[];
    fieldActivationModal: boolean;
}

//campaign slice intial props
export interface CampaignInitialStateProps extends InitialStateProps {
    data: ICampaign[];
    singleData: ICampaign;
    sourceList: SourceDataType[];
    leadStatusList: ILeadStatus[];
    customDateFields: ICustomField[];
    leadProductList: ProductSecondaryEndpointType[];
    emailTemplateList: ProductSecondaryEndpointType[];
    whatsappTemplateList: ProductSecondaryEndpointType[];
    smsTemplateList: ProductSecondaryEndpointType[];
    campaignActivationModal: boolean;
    isAbleToActivateCampaign: boolean;
}

//dashboard slice intial props
export interface DashboardInitialStateProps extends InitialStateProps {
    todayFollowUps: IFollowup[];
    tomorrowFollowUps: IFollowup[];
    pendingFollowUps: IFollowup[];
    singleData: IFollowup;
    sourceList: SourceDataType[];
    leadStatusList: LeadStatusSecondaryEndpoint[];
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

//lead status slice initial props
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
    pageSize: number;
    page: number;
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
