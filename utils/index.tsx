export const removeKey = (obj) => {
    const nullValue = ["", null, undefined];
    Object.keys(obj).forEach((v) => {
        if (nullValue.includes(obj[v])) {
            delete obj[v]
        }
    });
    return obj
}