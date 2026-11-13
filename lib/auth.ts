import { betterAuth } from "better-auth";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);

const db = client.db('hireloopdb');


export const auth = betterAuth({
  //...
   
  emailAndPassword: { 
    enabled: true, 
  },
  user: {
        additionalFields: {
            role: {
                type: ["seeker", "recruiter", "admin"],
                input: true,
                defaultValue: "seeker",
            },
            /**
             * Premium seekers can apply to every job; free seekers are capped.
             * `input: false` keeps it server-owned — a payment flow flips it
             * on the user document, never the client.
             */
            premium: {
                type: "boolean",
                input: false,
                defaultValue: false,
            },
        },
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
  database: mongodbAdapter(db, {
    client,
  }),

});

/**
 * Flips the `premium` flag on a user document.
 *
 * `premium` is an additional field with `input: false`, so it can't be set
 * through the client API — it has to be written here, server-side. The mock
 * checkout calls this; the real flow does it from the Stripe webhook.
 */
export const setUserPremium = async (userId: string, premium = true): Promise<void> => {
    // The session carries the user id as a string; Mongo stores it as an ObjectId.
    if (!ObjectId.isValid(userId)) {
        throw new Error(`Cannot set premium — "${userId}" is not a valid user id.`)
    }

    await db
        .collection("user")
        .updateOne({ _id: new ObjectId(userId) }, { $set: { premium } })
}