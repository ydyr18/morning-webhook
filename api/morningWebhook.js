import { createClient } from '@base44/sdk';
// minor change to force redeploy

const base44 = createClient({
  appId: process.env.BASE44_APP_ID,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send("GET is working");
  }

  if (req.method === 'POST') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString('utf8');
      const payload = JSON.parse(rawBody);

      const email = payload?.payer?.email;
      if (!email) {
        return res.status(400).send("Email not found in payload");
      }

      console.log("🔍 Searching for user with email:", email);

      const users = await base44.entities.User.filter({ email });

      if (users.length === 0) {
        console.log("⚠️ No user found for email:", email);
        return res.status(404).send("User not found");
      }

      const user = users[0];

      await base44.entities.User.update(user.id, {
        subscription_type: "premium"
      });

      console.log("✅ User updated to premium:", user.full_name);

      return res.status(200).send(`User ${user.full_name} updated to premium`);
    } catch (err) {
  console.error("❌ Error:", err.message);
  console.error("❌ Full error object:", err);
  return res.status(500).send("Internal server error");
}

  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).send(`Method ${req.method} Not Allowed`);
}
