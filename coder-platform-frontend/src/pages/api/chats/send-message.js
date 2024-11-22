import axios from "axios";

export default async function handler(req, res) {
	console.log("sending");
	let body = await req.body;
	console.log("body", body);
	if (req.method === "POST") {
		try {
			// Call your backend API for unseen notification count
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/chats/message`,
				body,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${req.headers.authorization}`,
					},
				}
			);

			// Extract relevant data from the response
			res.status(200).json(response.data);
		} catch (error) {
			console.error("Error posting message", error);
			res.status(500).json({ error: "Failed to post message" });
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
