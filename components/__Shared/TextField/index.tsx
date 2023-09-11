import React from 'react';
import { TextFieldProps } from './TextField.types';

const TextField = ({ name, type = 'text', placeholder, value, onBlur, onChange, label, id, className }: TextFieldProps) => {
    return (
        <div className={className}>
            <label htmlFor={id}>{label}</label>
            <input onChange={onChange} onBlur={onBlur} value={value} id={id} name={name} type={type} placeholder={placeholder} className="form-input" />
        </div>
    );
};

export default TextField;
