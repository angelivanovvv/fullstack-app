"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const entities_1 = require("../entities");
const graphqlTypes_1 = require("../graphqlTypes");
const errorUtils_1 = require("../utils/errorUtils");
const constants_1 = require("../constants");
let UserDetailsInput = class UserDetailsInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserDetailsInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserDetailsInput.prototype, "password", void 0);
UserDetailsInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserDetailsInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphqlTypes_1.UserGQLType, { nullable: true }),
    __metadata("design:type", graphqlTypes_1.UserGQLType)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async userDetails({ req, em }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(entities_1.User, { id: req.session.userId });
        return user;
    }
    users({ em }) {
        return em.find(entities_1.User, {});
    }
    async register(options, { em, req }) {
        if (options.username.length <= 2) {
            return {
                errors: [(0, errorUtils_1.errorGenerator)("username", "username must be greater then 2")],
            };
        }
        if (options.password.length <= 3) {
            return {
                errors: [(0, errorUtils_1.errorGenerator)("password", "password must be greater then 2")],
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const user = em.create(entities_1.User, {
            username: options.username,
            password: hashedPassword,
        });
        try {
            await em.persistAndFlush(user);
        }
        catch (error) {
            if (error.code === "23505") {
                return {
                    errors: [(0, errorUtils_1.errorGenerator)("username", "username already taken")],
                };
            }
        }
        req.session.userId = user.id;
        return { user };
    }
    async login(options, { em, req }) {
        const user = await em.findOne(entities_1.User, { username: options.username });
        if (!user) {
            return {
                errors: [(0, errorUtils_1.errorGenerator)("username", "that username doesn't exist")],
            };
        }
        const validPassword = await argon2_1.default.verify(user.password, options.password);
        if (!validPassword) {
            return {
                errors: [(0, errorUtils_1.errorGenerator)("password", "incorrect password")],
            };
        }
        req.session.userId = user.id;
        return { user };
    }
    logout({ req, res }) {
        res.clearCookie(constants_1.COOKIE_NAME);
        return new Promise((resolve) => {
            var _a;
            (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy((error) => {
                if (error) {
                    console.log(error);
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => graphqlTypes_1.UserGQLType, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userDetails", null);
__decorate([
    (0, type_graphql_1.Query)(() => [graphqlTypes_1.UserGQLType]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDetailsInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDetailsInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map