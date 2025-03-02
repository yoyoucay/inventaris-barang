import Swal from 'sweetalert2';

export const showSuccessAlert = (message: string) => {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
    });
};

export const showErrorAlert = (message: string) => {
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: message,
    });
};

export const showConfirmationDialog = async (message: string) => {
    const result = await Swal.fire({
        icon: 'question',
        title: 'Are you sure?',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    });

    return result.isConfirmed;
};