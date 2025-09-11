import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/dark.css';

export const toastSuccess = msg =>
    toast(msg, { theme: 'toast-success' });

export const toastWarning = msg =>
    toast(msg, { theme: 'toast-warning' });

export const toastError = msg =>
    toast(msg, { theme: 'toast-error' });