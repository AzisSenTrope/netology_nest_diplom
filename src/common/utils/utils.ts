import { extname } from 'path';

export function editFileName(req, file, cb) {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math?.round(Math.random() * 16)?.toString(16))
        .join('');
    // Создание уникального имени файла с сохранением его исходного расширения
    cb(null, `${randomName}${extname(file.originalname)}`);
}