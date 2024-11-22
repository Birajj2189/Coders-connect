import axios from "axios";

export default async function handler(req, res) {
	console.log(req.headers.authorization);

	if (req.method === "GET") {
		try {
			// Call your backend API for unseen notification count
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/all-list/`,
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
			console.error("Error fetching unseen notifications:", error);
			res
				.status(500)
				.json({ error: "Failed to fetch unseen notification count" });
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
