import cron from "node-cron";
import { getStores, updateStore } from "./database.js";

async function updateStoreStatus() {
  const storeList = await getStores();

  storeList.forEach(async (el) => {
    if (el.start_date != null && dateComparison(el.start_date) == 0) {
      await updateStore(el.id, "Invisible", el.start_date, el.end_date);
    } else if (el.end_date != null && dateComparison(el.end_date) < 0) {
      await updateStore(el.id, "Active", null, null);
    }
  });
}

cron.schedule("* * * * *", function () {
  updateStoreStatus();
});

export const dateComparison = (d) => {
  const current_date = new Date();

  current_date.setHours(0, 0, 0, 0);

  const date_to_be_compared = new Date(d);
  date_to_be_compared.setHours(0, 0, 0, 0);

  if (current_date < date_to_be_compared) {
    return 1;
  } else if (current_date > date_to_be_compared) {
    return -1;
  } else {
    return 0;
  }
};
