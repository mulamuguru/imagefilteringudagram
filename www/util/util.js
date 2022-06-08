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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const jimp_1 = __importDefault(require("jimp"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../config");
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
const filterImageFromURL = (inputURL) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jimp_1.default.read(inputURL)
            .then((photo) => {
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(__dirname + outpath, () => {
                resolve(__dirname + outpath);
            });
        })
            .catch((error) => {
            reject(error);
        });
    });
});
exports.filterImageFromURL = filterImageFromURL;
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
const deleteLocalFiles = (files) => {
    for (const file of files) {
        fs_1.default.unlinkSync(file);
    }
};
exports.deleteLocalFiles = deleteLocalFiles;
const generateJWT = (payload) => jwt.sign(payload, config_1.config.dev.jwtSecret);
exports.generateJWT = generateJWT;
//# sourceMappingURL=util.js.map