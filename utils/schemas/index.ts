import * as Yup from 'yup';

//authentication schemas

export const signUpSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your firstName'),
    lastName: Yup.string().required('Please enter your lastName'),
    email: Yup.string().email().required('Please enter your email'),
    password: Yup.string().required('Please enter your password').min(8, 'Password should be atleast 8 characters'),
    // confirmPassword: Yup.string()
    //     .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
    //     .required('Please enter confirm password'),
});

export const signInSchema = Yup.object().shape({
    email: Yup.string().email().required('Please enter your email'),
    password: Yup.string().required('Please enter your password').min(8, 'Password should be atleast 8 characters'),
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

//task priority schema
export const taskPrioritySchema = Yup.object().shape({
    name: Yup.string().required('Please enter task priority name'),
});

//task status schema
export const taskStatusSchema = Yup.object().shape({
    name: Yup.string().required('Please enter task Status name'),
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

export const emailSchema = Yup.object().shape({
    name: Yup.string().required('Please Enter Template Name'),
    subject: Yup.string().required('Please Enter Template Subject'),
    message: Yup.string().required('Please Enter Message'),
});
