import * as Yup from 'yup';

//authentication schemas
export const signUpSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your firstName'),
    lastName: Yup.string().required('Please enter your lastName'),
    email: Yup.string().email().required('Please enter your email'),
    password: Yup.string().required('Please enter your password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Please enter confirm password'),
});

export const signInSchema = Yup.object().shape({
    email: Yup.string().email().required('Please enter your email'),
    password: Yup.string().required('Please enter your password').min(8, 'Password should be atleast 8 characters'),
});

export const resetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('Please enter new password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Password and confirm password not matched')
        .required('Please enter confirm password'),
});

export const policySchema = Yup.object().shape({
    name: Yup.string().required('Please enter policy name'),
    description: Yup.string().min(20, 'Description must be 20 characters').required('Please enter policy description'),
});

//Create User Schema
export const createUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your firstName'),
    lastName: Yup.string().required('Please enter your lastName'),
    email: Yup.string().email().required('Please enter your email'),
    password: Yup.string().required('Please enter your password').min(8, 'Password should be atleast 8 characters'),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Please enter confirm password'),
});

//Edit User Schema
export const editUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your firstName'),
    lastName: Yup.string().required('Please enter your lastName'),
});

//branch schema

export const branchSchema = Yup.object().shape({
    name: Yup.string().required('Please enter Branch Name'),
    address: Yup.string().required('Please enter Branch Address'),
});

//source schema
export const sourceSchema = Yup.object().shape({
    name: Yup.string().required('Please enter Source Name'),
});

//task Schema

export const taskSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
});

//task Schema
export const leadSchema = Yup.object().shape({
    reference: Yup.string().required('Enter Reference'),
    estimatedBudget: Yup.number().required('Enter Budget'),
    description: Yup.string().required('Enter Description'),
    facebookCampaignName: Yup.string().required('Enter facebook Campaign Name'),
    serviceInterestedIn: Yup.string().required('Enter Service Intrested'),
    job: Yup.string().required('Enter Job'),
});

//task priority schema
export const taskPrioritySchema = Yup.object().shape({
    name: Yup.string().required('Please enter task priority name'),
});

//lead priority schema
export const leadPrioritySchema = Yup.object().shape({
    name: Yup.string().required('Please enter lead priority name'),
});

//task status schema
export const taskStatusSchema = Yup.object().shape({
    name: Yup.string().required('Please enter task Status name'),
});

//lead status schema
export const leadStatusSchema = Yup.object().shape({
    name: Yup.string().required('Please enter lead Status name'),
});

export const contactSchema = Yup.object().shape({
    title: Yup.string().required('Please select title'),
    name: Yup.string().required('Please enter name'),
    phoneNumber: Yup.string().required('Please enter Phone number'),
    email: Yup.string().email('Please enter valid email').required('Please enter email'),
    assignedTo: Yup.string().required('Please select assign to option'),
    source: Yup.string().required('Please select source'),
    website: Yup.string().required('Please enter website'),
    position: Yup.string().required('Please enter position'),
    industry: Yup.string().required('Please enter industry'),
    facebookProfile: Yup.string().required('Please enter facebookProfile link'),
    twitterProfile: Yup.string().required('Please enter twitterProfile link'),
    comment: Yup.string().required('Please enter comment'),
    address: Yup.string().required('Please enter address'),
    city: Yup.string().required('Please select city'),
    state: Yup.string().required('Please select state'),
    country: Yup.string().required('Please select country'),
});

//email template schema
export const emailTemplateSchema = Yup.object().shape({
    name: Yup.string().required('Please Enter Template Name'),
    subject: Yup.string().required('Please Enter Template Subject'),
    message: Yup.string().required('Please Enter Message'),
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
    email: Yup.string().email('Please enter valid email').required('Enter Email'),
    password: Yup.string().required('Enter SMTP password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Please enter confirm password'),
});

export const editEmailSmtpSchema = Yup.object().shape({
    SMTP: Yup.string().required('Enter SMTP Name'),
    name: Yup.string().required('Enter Name'),
    email: Yup.string().email('Please enter valid email').required('Enter Email'),
});
