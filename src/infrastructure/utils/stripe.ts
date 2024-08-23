import Stripe from 'stripe';
import dotenv from 'dotenv';
import userRepository from '../repositories/userRepositories';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const userRepo = new userRepository();

class StripePayment {
  async createCheckoutSession(id: string): Promise<string | null> {
    try {
      const details = await userRepo.findPlanbyId(id);

      if (!details) {
        throw new Error('Plan not found');
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: details.subscriptiontype,
            },
            unit_amount: details.price *100, 
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: "https://joborbit.vercel.app/paymentsuccess",
        cancel_url: "https://joborbit.vercel.app/viewplan",
      });

      return session.id;
    } catch (error) {
      console.error('Error creating Checkout Session:', error);
      return null;
    }
  }
}

export default StripePayment;
