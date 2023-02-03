import * as toaster from 'toastr'

export const showNotification = (type: boolean, message: string): void => {
    const toasterOptions = { positionClass: 'toast-top-center', closeButton: true }
    toaster.remove();
    if (type === true) {
        toaster.success(message, '', toasterOptions)
    }
    else if (type === false) {
        toaster.error(message, '', toasterOptions)
    }
}