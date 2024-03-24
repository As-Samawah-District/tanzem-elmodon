import { createAdmin } from "./controllers/userControllers";
import app from "./server";
import morgan from "morgan";

app.use(morgan("dev"));
createAdmin();
app.listen(5000, () => {
  console.log("server is running...");
});
// do4tTlFNJhqKdpit
