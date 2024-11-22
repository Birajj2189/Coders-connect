import axios from "axios";

export default async function handler(req, res) {
	if (req.method === "PATCH") {
		
		try {
			// Call your backend API for unseen notification count
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/update/profile-picture`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${req.headers.authorization}`,
					},
				}
			);

			console.log(response);
			// Extract relevant data from the response
			const { data } = response;

			// Send the data back to the frontend
			res.status(200).json(data);
		} catch (error) {
			console.log("Error uplaoding image:", error);
			res.status(500).json({ error: "Failed to uplaod image" });
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
