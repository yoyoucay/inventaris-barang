// utils/swal.ts
import Swal from 'sweetalert2';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

interface SwalOptions {
    title: string;
    text?: string;
    icon?: AlertType;
    confirmButtonText?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export const showSwal = (options: SwalOptions) => {
    const {
        title,
        text,
        icon = 'info',
        confirmButtonText = 'OK',
        showCancelButton = false,
        cancelButtonText = 'Cancel',
        onConfirm,
        onCancel,
    } = options;

    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        showCancelButton,
        cancelButtonText,
    }).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        } else if (result.isDismissed && onCancel) {
            onCancel();
        }
    });
};