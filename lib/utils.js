const utils = {};

utils.fileExtension = (URL) => {
    return URL.split('.')[1];
}

export { utils };