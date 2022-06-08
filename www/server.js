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
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const util_1 = require("./util/util");
const validator_1 = __importDefault(require("validator"));
const handlers_1 = require("./handlers");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMETERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    /**************************************************************************** */
    app.get('/filteredimage', handlers_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const imageUrl = req.query.image_url;
        // check imageUrl is not empty
        if (!imageUrl) {
            return res.status(400).send({
                success: false,
                message: `The image_url query parameter is required.`
            });
        }
        // check imageUrl is valid
        if (!validator_1.default.isURL(imageUrl)) {
            return res.status(400).send({
                success: false,
                message: `Invalid image url`,
            });
        }
        try {
            const filteredImagePath = yield util_1.filterImageFromURL(imageUrl);
            const sendFileOptions = {};
            res.sendFile(filteredImagePath, sendFileOptions, (error) => __awaiter(void 0, void 0, void 0, function* () {
                // status: 200
                util_1.deleteLocalFiles([filteredImagePath]);
                if (error) {
                    res.status(500).send({
                        success: false,
                        message: 'An error occurred while returning the filtered image.',
                        detail: `${error}`,
                    });
                }
            }));
        }
        catch (error) {
            // Possible exceptions:
            // * Promise.reject() throws an exception (filterImageFromURL -> jimp functions (read, write etc.))
            res.status(500).send({
                success: false,
                message: `An error occurred while processing your image.`,
                detail: `${error}`,
            });
        }
    }));
    //! END @TODO1
    // Generates a token based on client IP address
    app.get("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = util_1.generateJWT(`${req.connection.remoteAddress || req.connection.localAddress}${new Date().getDate()}`);
        res.status(200).send({ success: true, token });
    }));
    // Root Endpoint
    // Displays a simple message to the user
    app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send('try GET /filteredimage?image_url={{}}');
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map