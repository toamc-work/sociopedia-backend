import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log({ __dirname });
        cb(null, path.join(__dirname, '../public/assets'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
export const upload = multer({ storage: storage });
