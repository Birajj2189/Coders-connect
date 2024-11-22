import axios from "axios";

export default async function handler(req, res) {
	const userId = req.params.id;

	if (req.method === "GET") {
		try {
			// Call your backend API for unseen notification count
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/followings/`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${req.headers.authorization}`,
					},
				}
			);

			// Extract relevant data from the response
			const { data } = response;

			console.log(data);

			// Send the data back to the frontend
			res.status(200).json(data);
		} catch (error) {
			console.error("Error fetching followings list:", error);
			res.status(500).json({ error: "Failed to fetch followings list" });
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
