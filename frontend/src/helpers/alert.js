import Swal from 'sweetalert2';

export function warning(params) {
  return Swal.fire({
    title: params.title || 'Are you sure?',
    text: params.text ||  "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: params.confirmButtonText ||  'Yes'
  })
}