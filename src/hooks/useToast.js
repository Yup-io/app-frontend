import { useSnackbar } from 'notistack'

const useToast = () => {
  const { enqueueSnackbar } = useSnackbar()

  const toastSuccess = (msg) => {
    enqueueSnackbar(msg, { variant: 'success' })
  }

  const toastError = (msg) => {
    enqueueSnackbar(msg, { variant: 'error' })
  }

  return {
    toastSuccess,
    toastError
  }
}

export default useToast
