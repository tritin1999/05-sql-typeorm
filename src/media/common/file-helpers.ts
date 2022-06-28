import { extname } from "path";

export const mediaFileFilter = (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|HEIC|gif|mp4|avi)$/)) {
        return callback(new Error('File is not valid, must be jpg/ jpeg/ png/ gif/ HEIC.'), false);
    }
    callback(null, true);
}

export const editFileName = (req: any, file: any, callback: any) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    const dateTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    var time = new Date().getHours() + "-" + new Date().getMinutes() + "-" + new Date().getSeconds();
    callback(null, `${name}_${dateTime}_${time}_${randomName}${fileExtName}`);
};