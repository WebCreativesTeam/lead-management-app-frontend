export type SelectOptionsType = {
    value: string;
    label: string;
}

export type Permission = {
    key: string;
    value: string;
};

export type PolicyDataType = {
    name: string;
    id: string;
    description: string;
    permissions: string[];
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
    deactivatedAt: any;
    policiesIncluded?: {
        id: string;
        name: string;
        description: string;
    }[];
};

//taskPage

export type TaskSelectOptions = {
    name?: string;
    color?: string;
    id?: string;
    createdAt?: string;
    updatedAt?: string;
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