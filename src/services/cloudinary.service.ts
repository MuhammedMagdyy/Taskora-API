import { v2 as cloudinary } from 'cloudinary';
import { unlinkSync } from 'fs';
import {
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryCloudName,
} from '../config';
import { ApiError, BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../utils';

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: cloudinaryCloudName,
      api_key: cloudinaryApiKey,
      api_secret: cloudinaryApiSecret,
    });
  }

  async uploadImage(image: string) {
    try {
      const { secure_url } = await cloudinary.uploader.upload(image, {
        folder: 'taskora-api',
        unique_filename: true,
      });

      if (!secure_url) {
        throw new ApiError('Failed to upload image', BAD_REQUEST);
      }

      return { image: secure_url };
    } catch {
      throw new ApiError(
        'Something wen wrong while uploading image',
        INTERNAL_SERVER_ERROR,
      );
    } finally {
      unlinkSync(image);
    }
  }
}

export const cloudinaryService = new CloudinaryService();
