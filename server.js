import * as database from "./src/database.js";
import makeApp from "./app.js";

const app = makeApp(database);
// Start the Express server on port 8080
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
