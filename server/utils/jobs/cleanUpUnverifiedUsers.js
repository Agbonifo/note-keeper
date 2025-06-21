
// server/utils/jobs/cleanUpUnverifiedUsers.js
import cron from "node-cron";
import User from "../../models/User.js";


cron.schedule("0 2 * * *", async () => {
  const now = new Date();

  try {
    const result = await User.deleteMany({
      isVerified: false,
      emailVerificationExpires: { $lt: now },
    });

    if (result.deletedCount > 0) {
      console.log(`[Cleanup] Deleted ${result.deletedCount} unverified user(s)`);
    } else {
      console.log("[Cleanup] No unverified users to delete.");
    }
  } catch (error) {
    console.error("[Cleanup] Error deleting unverified users:", error);
  }
});



cron.schedule("0 2 * * *", async () => {
  const now = new Date();

  try {
    const result = await User.updateMany(
      {
        passwordResetToken: { $exists: true },
        passwordResetExpires: { $lt: now }
      },
      {
        $unset: {
          passwordResetToken: "",
          passwordResetExpires: ""
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[Cleanup] Cleared expired password reset tokens for ${result.modifiedCount} user(s).`);
    } else {
      console.log("[Cleanup] No expired password reset tokens to clear.");
    }
  } catch (error) {
    console.error("[Cleanup] Error clearing expired password reset tokens:", error);
  }
});
