import { NextApiResponse } from "next";
import { dbConnect } from "../../../util/mongodb";
import { NextIronRequest, withSession } from "../../../util/session";

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
	const { db } = await dbConnect();

	const user = req.session.get("user");

	if (!user) {
		return res.status(401).json({ error: "You are not logged in." });
	}

	if (!user.isModerator) {
		return res.status(401).json({ error: "You can't do this." });
	}

	if (!req.query?.id) {
		return res.status(400).json({ error: "Missing parameters." });
	}

	try {
		let staff = await db.collection("staff").findOne({ _id: req.query.id });

		return res.status(200).json({ staff });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};

export default withSession(handler);
