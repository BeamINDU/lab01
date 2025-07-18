import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'
import type SwalNamespace from 'sweetalert2'


const DEFAULT_CONFIRM_COLOR = '#004798';
const DEFAULT_CANCEL_COLOR = '#747b87';

const baseAlert = (options: SweetAlertOptions) => {
  return Swal.fire({
    title: '',
    confirmButtonColor: DEFAULT_CONFIRM_COLOR,
    ...options,
    customClass: {
      container: 'z-[3000]',
      popup: 'z-[3000]',
    },
  });
};

export const showSuccess = (text?: string, title = '') =>
  baseAlert({ icon: 'success', title, text });

export const showError = (text?: string, title = '') =>
  baseAlert({ icon: 'error', title, text });

export const showWarning = (text?: string, title = '') =>
  baseAlert({ icon: 'warning', title, text });

export const showConfirm = (text?: string,title = '', confirmText = 'Yes', cancelText = 'No') =>
  baseAlert({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: DEFAULT_CONFIRM_COLOR,
    cancelButtonColor: DEFAULT_CANCEL_COLOR,
  });

export const showInput = async ( defaultValue = '', title = 'Enter value:', placeholder = '') =>
  Swal.fire({
    title,
    input: 'text',
    inputValue: defaultValue,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    confirmButtonColor: DEFAULT_CONFIRM_COLOR,
    cancelButtonColor: DEFAULT_CANCEL_COLOR,
  });

export const showLoading = (text = 'Loading...') =>
  Swal.fire({
    title: '',
    text,
    allowOutsideClick: false,
    didOpen: () => {
      (Swal as typeof SwalNamespace).showLoading();
    },
    showConfirmButton: false,
  });
  

export const closeAlert = () => Swal.close();
