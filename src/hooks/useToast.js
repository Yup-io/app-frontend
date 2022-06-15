import { useSnackbar } from 'notistack';

const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const toastSuccess = (msg) => {
    enqueueSnackbar(msg, { variant: 'success' });
  };

  const toastError = (msg) => {
    enqueueSnackbar(msg, { variant: 'error' });
  };

  const toastInfo = (msg) => {
    enqueueSnackbar(msg, { variant: 'info' });
  };

  return {
    toastSuccess,
    toastError,
    toastInfo
  };
};

export default useToast;
