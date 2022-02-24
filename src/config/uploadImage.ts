import multer from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '../uploads/profilePicture');
const typesImage = ['image/jpeg', 'image/png', 'image/gif'];
export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      request.body.telephones = JSON.parse(request.body.telephones);
      if (typesImage.includes(file.mimetype)) {
        const filename = `${request.body.telephones.number}.png`;
        return callback(null, filename);
      }
      return callback(new Error('Tipo de arquivo inválido!'), '');
    },
  }),
};
