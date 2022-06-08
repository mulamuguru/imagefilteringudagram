"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const jwt = __importStar(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({
            success: false,
            message: 'No authorization headers.'
        });
    }
    const tokenBearer = req.headers.authorization.split(' ');
    if (tokenBearer.length != 2) {
        return res.status(401).send({
            success: false,
            message: 'Malformed token.'
        });
    }
    const token = tokenBearer[1];
    return jwt.verify(token, config_1.config.dev.jwtSecret, (err) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Failed to authenticate.'
            });
        }
        return next();
    });
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map