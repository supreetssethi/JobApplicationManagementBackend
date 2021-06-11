import App from "./app";
import AuthController from "./auth/auth.controller";
import UserController from "./users/user.controller";

const PORT = process.env.PORT || 8000;
const app = new App([new AuthController(), new UserController()], PORT);

app.listen();
