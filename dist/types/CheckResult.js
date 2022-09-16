"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesCategories = exports.CategoryNames = exports.Category = void 0;
const Rules_1 = require("./Rules");
var Category;
(function (Category) {
    Category["GREEN_IT"] = "GREEN_IT";
    Category["STABILITY"] = "STABILITY";
    Category["SPEED"] = "SPEED";
    Category["IT_COSTS"] = "IT_COSTS";
    Category["SECURITY"] = "SECURITY";
})(Category = exports.Category || (exports.Category = {}));
exports.CategoryNames = {
    [Category.GREEN_IT]: 'Green IT',
    [Category.STABILITY]: 'Stability',
    [Category.SPEED]: 'Speed',
    [Category.IT_COSTS]: 'IT costs',
    [Category.SECURITY]: 'Security',
};
exports.RulesCategories = {
    [Rules_1.Rules.ASYNC_SPECIFY_FAILURE_DESTINATION]: [Category.STABILITY],
    [Rules_1.Rules.INTELLIGENT_TIERING]: [Category.GREEN_IT, Category.IT_COSTS],
    [Rules_1.Rules.LIGHT_BUNDLE]: [Category.GREEN_IT, Category.STABILITY],
    [Rules_1.Rules.LIMITED_AMOUNT_OF_LAMBDA_VERSIONS]: [
        Category.GREEN_IT,
        Category.STABILITY,
    ],
    [Rules_1.Rules.NO_DEFAULT_MEMORY]: [Category.GREEN_IT, Category.IT_COSTS],
    [Rules_1.Rules.NO_IDENTICAL_CODE]: [Category.SECURITY, Category.STABILITY],
    [Rules_1.Rules.NO_MAX_TIMEOUT]: [
        Category.GREEN_IT,
        Category.IT_COSTS,
        Category.STABILITY,
    ],
    [Rules_1.Rules.NO_SHARED_IAM_ROLES]: [Category.SECURITY, Category.STABILITY],
    [Rules_1.Rules.SPECIFY_DLQ_ON_SQS]: [Category.STABILITY],
    [Rules_1.Rules.UNDER_MAX_MEMORY]: [Category.GREEN_IT, Category.IT_COSTS],
    [Rules_1.Rules.USE_ARM_ARCHITECTURE]: [
        Category.GREEN_IT,
        Category.IT_COSTS,
        Category.SPEED,
    ],
};
