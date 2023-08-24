import React from 'react';

const TextField = ({ name, type = 'text', placeholder, value, onBlur, onChange, label, id, className }: TextFieldProps) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input onChange={onChange} onBlur={onBlur} value={value} id={id} name={name} type={type} placeholder={placeholder} className={`${className} form-input`} />
        </div>
    );
};

export default TextField;
