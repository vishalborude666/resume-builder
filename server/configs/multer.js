import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });
export default upload;


 