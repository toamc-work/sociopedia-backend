import multer, {Multer, StorageEngine} from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage:StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log({__dirname});
        cb(null, path.join(__dirname, '../public/assets'));
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const upload: Multer = multer({storage:storage});