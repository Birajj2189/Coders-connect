import axios from "axios";

export default async function handler(req, res) {
	console.log(req.headers.authorization);

	if (req.method === "PATCH") {
		try {
			// Call your backend API for unseen notification count
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/seen-all/`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${req.headers.authorization}`,
					},
				}
			);

			// Send the unseen count back to the frontend
			res.status(200).json({ message: "marked all as seen successfully" });
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
