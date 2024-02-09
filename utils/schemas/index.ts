import * as Yup from 'yup';

//authentication schemas
export const signUpSchema = Yup.object().shape({
    firstName: Yup.string().required('Enter your firstName'),
    lastName: Yup.string().required('Enter your lastName'),
    email: Yup.string().email().required('Enter your email'),
    password: Yup.string().required('Enter your password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Enter confirm password'),
});

export const signInSchema = Yup.object().shape({
    email: Yup.string().email().required('Enter your email'),
    password: Yup.string().required('Enter your password').min(8, 'Password should be atleast 8 characters'),
});

//schedule message
export const campaignSchema = Yup.object().shape({
    name: Yup.string().required('Enter Campaign Name'),
});

//schedule message
export const customFieldSchema = Yup.object().shape({
    label: Yup.string().required('Enter Field Label'),
});

// custom field tab schema for lead
export const customFieldTabSchema = Yup.object().shape({
    name: Yup.string().required('Enter Schedule Message Name'),
});

export const resetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('Enter new password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Password and confirm password not matched')
        .required('Enter confirm password'),
});

export const policySchema = Yup.object().shape({
    name: Yup.string().required('Enter policy name'),
    description: Yup.string().min(20, 'Description must be 20 characters').required('Enter policy description'),
});

//Create User Schema
export const createUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Enter your firstName'),
    lastName: Yup.string().required('Enter your lastName'),
    email: Yup.string().email().required('Enter your email'),
    password: Yup.string().required('Enter your password').min(8, 'Password should be atleast 8 characters'),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Enter confirm password'),
});

//Edit User Schema
export const editUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Enter your firstName'),
    lastName: Yup.string().required('Enter your lastName'),
});

//branch schema

export const branchSchema = Yup.object().shape({
    name: Yup.string().required('Enter Branch Name'),
    address: Yup.string().required('Enter Branch Address'),
});

//source schema
export const sourceSchema = Yup.object().shape({
    name: Yup.string().required('Enter Source Name'),
});

//source schema
export const productSchema = Yup.object().shape({
    name: Yup.string().required('Enter Product Name'),
});

//task Schema

export const taskSchema = Yup.object().shape({
    title: Yup.string().required('Enter title'),
});

//task Schema
export const leadSchema = Yup.object().shape({
    zip: Yup.string().required('Enter Pin Code'),
});

//task priority schema
export const leadAssignmentSchema = Yup.object().shape({
    name: Yup.string().required('Enter Rule name'),
});

//task priority schema
export const taskPrioritySchema = Yup.object().shape({
    name: Yup.string().required('Enter task priority name'),
});

//lead priority schema
export const leadPrioritySchema = Yup.object().shape({
    name: Yup.string().required('Enter lead priority name'),
});

//task status schema
export const taskStatusSchema = Yup.object().shape({
    name: Yup.string().required('Enter task Status name'),
});

//lead status schema
export const leadStatusSchema = Yup.object().shape({
    name: Yup.string().required('Enter lead Status name'),
});

//product color schema
export const productColorSchema = Yup.object().shape({
    name: Yup.string().required('Enter lead Status name'),
});

export const contactSchema = Yup.object().shape({
    title: Yup.string().required('select title'),
    name: Yup.string().required('Enter name'),
    phoneNumber: Yup.string().required('Enter Phone number'),
    email: Yup.string().email('Enter valid email').required('Enter email'),
    assignedTo: Yup.string().required('select assign to option'),
    source: Yup.string().required('select source'),
    website: Yup.string().required('Enter website'),
    position: Yup.string().required('Enter position'),
    industry: Yup.string().required('Enter industry'),
    facebookProfile: Yup.string().required('Enter facebookProfile link'),
    twitterProfile: Yup.string().required('Enter twitterProfile link'),
    comment: Yup.string().required('Enter comment'),
    address: Yup.string().required('Enter address'),
    city: Yup.string().required('select city'),
    state: Yup.string().required('select state'),
    country: Yup.string().required('select country'),
});

//email template schema
export const emailTemplateSchema = Yup.object().shape({
    name: Yup.string().required('Enter Template Name'),
    subject: Yup.string().required('Enter Template Subject'),
    message: Yup.string().required('Enter Message'),
});

//sms template schema
export const smsTemplateSchema = Yup.object().shape({
    name: Yup.string().required('Enter Template Name'),
    message: Yup.string().required('Enter Message'),
});

//whatsapp template schema
export const whatsappTemplateSchema = Yup.object().shape({
    name: Yup.string().required('Enter Template Name'),
    message: Yup.string().required('Enter Message'),
});

//send email schema
export const sendEmailSchema = Yup.object().shape({
    senderName: Yup.string().required('Enter Sender Name'),
    senderEmail: Yup.string().required('Enter Sender Email'),
    receiverEmail: Yup.string().required('Enter Receiver Email'),
    subject: Yup.string().required('Enter Subject'),
    message: Yup.string().required('Enter Message'),
});

export const emailSmtpSchema = Yup.object().shape({
    SMTP: Yup.string().required('Enter SMTP Name'),
    name: Yup.string().required('Enter Name'),
    email: Yup.string().required('Enter Email'),
    password: Yup.string().required('Enter SMTP password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Enter confirm password'),
});

export const editEmailSmtpSchema = Yup.object().shape({
    SMTP: Yup.string().required('Enter SMTP Name'),
    name: Yup.string().required('Enter Name'),
    password: Yup.string().required('Enter SMTP password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Enter confirm password'),
});
