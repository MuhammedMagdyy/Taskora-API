import multer from 'multer';
import { ApiError, UNSUPPORTED_MEDIA_TYPE, MAGIC_NUMBERS } from '../utils';

export const multerMiddlewareUpload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: MAGIC_NUMBERS.MAX_FILE_SIZE },
  fileFilter(req, file, callback) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      callback(null, true);
    } else {
      callback(
        new ApiError(
          'Only .png, .jpg and .jpeg format allowed!',
          UNSUPPORTED_MEDIA_TYPE
        )
      );
    }
  },
});
