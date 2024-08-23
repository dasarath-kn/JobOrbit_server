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
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRepositories_1 = __importDefault(require("../repositories/userRepositories"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const userRepo = new userRepositories_1.default();
class StripePayment {
    createCheckoutSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield userRepo.findPlanbyId(id);
                if (!details) {
                    throw new Error('Plan not found');
                }
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: details.subscriptiontype,
                                },
                                unit_amount: details.price * 100,
                            },
                            quantity: 1,
                        }],
                    mode: 'payment',
                    success_url: "https://joborbit.vercel.app/paymentsuccess",
                    cancel_url: "https://joborbit.vercel.app/viewplan",
                });
                return session.id;
            }
            catch (error) {
                console.error('Error creating Checkout Session:', error);
                return null;
            }
        });
    }
}
exports.default = StripePayment;
