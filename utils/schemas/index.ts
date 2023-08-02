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
