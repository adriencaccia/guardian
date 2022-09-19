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
Object.defineProperty(exports, "__esModule", { value: true });
const util_arn_parser_1 = require("@aws-sdk/util-arn-parser");
const helpers_1 = require("../../helpers");
const filterS3BucketFromResources_1 = require("../../helpers/filterS3BucketFromResources");
const types_1 = require("../../types");
const hasIntelligentTiering = (configuration) => { var _a; return (_a = configuration === null || configuration === void 0 ? void 0 : configuration.some(item => item.Status === 'Enabled')) !== null && _a !== void 0 ? _a : false; };
const run = (resources) => __awaiter(void 0, void 0, void 0, function* () {
    const buckets = (0, filterS3BucketFromResources_1.filterS3BucketFromResources)(resources);
    const s3BucketConfigurations = yield (0, helpers_1.fetchAllS3BucketIntelligentTieringConfigurations)(buckets);
    const results = s3BucketConfigurations.map(({ arn, configuration }) => ({
        arn: (0, util_arn_parser_1.build)(arn),
        success: hasIntelligentTiering(configuration),
    }));
    return { results };
});
exports.default = {
    run,
    rule: types_1.Rules.INTELLIGENT_TIERING,
};
