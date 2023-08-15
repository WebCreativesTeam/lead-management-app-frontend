import { ReactNode } from "react";

export interface ConfirmationModalTypes {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onDiscard: () => void;
    isBtnDisabled: boolean;
    title: string;
    description: string | ReactNode;
    btnDiscardText?: string;
    btnSubmitText?: string;
}