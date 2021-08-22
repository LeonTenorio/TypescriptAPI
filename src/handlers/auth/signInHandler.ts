import { ClientSession } from "mongoose";
import { signInWithEmailAndPassword } from "../../services/authentification/firebaseAuth";
import Context from "../../structure/context";
import Handler from "../../structure/handler";
import { NavigationResult } from "../../structure/response";

export const signInHandler = new Handler(
  async (
    context: Context,
    session: ClientSession
  ): Promise<NavigationResult<{ authToken: string }>> => {
    const email = context.body["email"] as string;
    const password = context.body["password"] as string;

    const authResult = await signInWithEmailAndPassword(email, password);
    if (!authResult.success) {
      return {
        status: 403,
        body: { error: "INVALID_EMAIL_OR_PASSWORD" },
      };
    }

    // The main ideia is use the token like authorization after that endpoint
    // and with the user id we can get the user profile

    // Quick context set and get variable usability
    context.setVariable("autResult", authResult);
    console.log(context.getVariable("autResult"));

    return {
      status: 200,
      body: { authToken: authResult.data.token },
    };
  }
);
