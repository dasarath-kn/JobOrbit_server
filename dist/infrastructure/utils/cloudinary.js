"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: 'dbiw9o16u',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
class Cloudinary {
    uploadImage(image, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadResult = yield cloudinary_1.v2.uploader
                    .upload(image, {
                    folder: `${folderName}`,
                    resource_type: 'image'
                });
                return uploadResult.secure_url;
            }
            catch (error) {
                console.error("Error uploading image to cloudinary", error);
                throw error;
            }
        });
    }
    uploaddocuments(documents, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadResult = yield cloudinary_1.v2.uploader
                    .upload(documents, {
                    folder: `${folderName}`,
                    resource_type: 'raw'
                });
                return uploadResult.secure_url;
            }
            catch (error) {
                console.error("Error uploading document to cloudinary", error);
                throw error;
            }
        });
    }
    uploadMultipleimages(images, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadPromises = images.map((image) => __awaiter(this, void 0, void 0, function* () {
                    const uploadResult = yield cloudinary_1.v2.uploader.upload(image, {
                        folder: folderName,
                        resource_type: 'image'
                    });
                    return uploadResult.secure_url;
                }));
                const uploadedUrls = yield Promise.all(uploadPromises);
                return uploadedUrls;
            }
            catch (error) {
                console.error("Error uploading image to cloudinary", error);
                throw error;
            }
        });
    }
}
exports.default = Cloudinary;
