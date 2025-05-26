export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send("GET is working");
  }

  if (req.method === 'POST') {
    const body = req.body;
    const email = body?.payer?.email || 'unknown';
    console.log("Received webhook for email:", email);

    return res.status(200).send(`Webhook received for ${email}`);
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
