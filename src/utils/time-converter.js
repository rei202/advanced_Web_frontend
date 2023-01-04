const handleConvertTime = (timeStamp) => {
    if (timeStamp !== null) {
        const date = new Date(Number(timeStamp));
        const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const mm = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return dd + '/' + mm + '/' + date.getFullYear() + ' ' + h + ':' + m;
    }
};
export default handleConvertTime;
