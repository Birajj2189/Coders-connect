import axios from "axios";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const chatId = req.query.chatId;
			console.log("chatssssss", chatId);
			// Call your backend API for unseen notification count
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/chats/chat-history?chatId=${chatId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${req.headers.authorization}`,
					},
				}
			);

			// Extract relevant data from the response
			const { data } = response;
			// Send the data back to the frontend
			res.status(200).json(data);
		} catch (error) {
			console.error("Error fetching user chats:", error);
			res.status(500).json({ error: "Failed to fetch user chats" });
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
