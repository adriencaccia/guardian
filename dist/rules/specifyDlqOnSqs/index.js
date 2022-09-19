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
const types_1 = require("../../types");
const hasDeadLetterQueue = (redrivePolicy) => redrivePolicy !== undefined;
const run = (resourceArns) => __awaiter(void 0, void 0, void 0, function* () {
    const queuesAttributesByArn = yield (0, helpers_1.fetchAllQueuesAttributes)(resourceArns);
    const deadLetterQueuesArn = [];
    queuesAttributesByArn.forEach(queue => {
        var _a;
        const redrivePolicy = (_a = queue.attributes.Attributes) === null || _a === void 0 ? void 0 : _a.RedrivePolicy;
        if (redrivePolicy !== undefined) {
            const deadLetterTargetArn = JSON.parse(redrivePolicy)
                .deadLetterTargetArn;
            deadLetterQueuesArn.push(deadLetterTargetArn);
        }
    });
    const results = queuesAttributesByArn
        .filter(queue => !deadLetterQueuesArn.includes((0, util_arn_parser_1.build)(queue.arn)))
        .map(queue => {
        var _a;
        return ({
            arn: (0, util_arn_parser_1.build)(queue.arn),
            success: hasDeadLetterQueue((_a = queue.attributes.Attributes) === null || _a === void 0 ? void 0 : _a.RedrivePolicy),
        });
    });
    return { results };
});
exports.default = {
    run,
    rule: types_1.Rules.SPECIFY_DLQ_ON_SQS,
};
