import { bootstrapIfEmpty } from "@/itinerary";

async function main() {
  await bootstrapIfEmpty();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
