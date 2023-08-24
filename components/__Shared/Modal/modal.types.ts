import { ReactNode } from "react";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    onDiscard: () => void;
    isBtnDisabled?: boolean;
    title: string;
    content: string | ReactNode;
    btnDiscardText?: string;
    btnSubmitText?: string;
    size?: "medium" | "large" | "xLarge";
    disabledDiscardBtn?: boolean;
}