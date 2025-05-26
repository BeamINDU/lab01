import Swal from 'sweetalert2'

export const showSuccess = (text?: string) => {
  return Swal.fire({
    icon: 'success',
    title: '',
    text,
    confirmButtonColor: '#004798',
    confirmButtonText: 'OK',
  })
}

export const showError = (text?: string) => {
  return Swal.fire({
    icon: 'error',
    title: '',
    text,
  })
}

export const showWarning = (text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title: '',
    text,
  })
}

export const showConfirm = (text?: string) => {
  return Swal.fire({
    icon: 'question',
    title: '',
    text,
    showCancelButton: true,
    confirmButtonColor: '#004798',
    cancelButtonColor: '#e5e7eb',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    // reverseButtons: true,
  })
}

export const showInput = async (defaultValue: string = '') => {
  return Swal.fire({
    title: '',
    input: 'text',
    inputValue: defaultValue,
    showCancelButton: true,
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
  })
}

export const showLoading = (text = 'Loading...') => {
  return Swal.fire({
    title: '',
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

export const closeAlert = () => Swal.close()
