
interface TextFieldProps extends React.HTMLAttributes<HTMLInputElement>{
    name?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onBlur?: (e:React.FocusEvent<any, Element>) => void;
    onChange?: (e:React.ChangeEvent<any>) => void;
    label?: string;
    id?: string;
    className?: string;
}
