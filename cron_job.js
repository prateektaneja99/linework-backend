import cron from "node-cron";
import { getStores } from "./database.js";

async function updateStoreStatus() {
  console.log("Starting cron");
  const storeList = await getStores();
  storeList.forEach(async (el) => {
    if (el.start_date != null && el.start_date == Date.now) {
      el.status = "Invisible";
      await updateStore(el.id, el.status, el.start_date, el.end_date);
    } else if (el.end_date != null && el.end_date < Date.now) {
      el.status = "Active";
      await updateStore(el.id, el.status, null, null);
    }
  });
  console.log("ending cron");
}

cron.schedule("* * * * *", function () {
  console.log("running a task every minute");
  updateStoreStatus();
});
