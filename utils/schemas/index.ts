import * as Yup from 'yup';

//authentication schemas

export const signUpSchema = Yup.object().shape({
    firstname: Yup.string().required('Please enter your firstName'),
    lastname: Yup.string().required('Please enter your lastName'),
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

export const policyEditSchema = Yup.object().shape({
    policyName: Yup.string().required('Please enter policy name'),
    policyDescription: Yup.string().required('Please enter policy description'),
});

//Create User Schema
export const createUserSchema = Yup.object().shape({
    firstname: Yup.string().required('Please enter your firstName'),
    lastname: Yup.string().required('Please enter your lastName'),
    email: Yup.string().email().required('Please enter your email'),
    password: Yup.string().required('Please enter your password').min(8, 'Password should be atleast 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password and confirm password not matched')
        .required('Please enter confirm password'),
});

//Edit User Schema
export const editUserSchema = Yup.object().shape({
    firstname: Yup.string().required('Please enter your firstName'),
    lastname: Yup.string().required('Please enter your lastName'),
    email: Yup.string().email().required('Please enter your email'),
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

