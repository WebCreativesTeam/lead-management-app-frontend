import { JsxElement } from "typescript";

export interface ViewModalProps {
    open: boolean;
    onClose: () => any;
    title: string;
    content: string | React.ReactNode ;
}