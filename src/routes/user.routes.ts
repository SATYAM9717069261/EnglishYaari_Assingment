import { Router } from "express";
import { User } from "../models/user.model";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;

        if (!fullName || !email || !phone) {
            res.status(400).json({
                message: "Name and email are required",
            });
            return;
        }

        const user = await User.create({ fullName, email, phone });

        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        if ( typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            res.status(409).json({
                message: "Email already exists",
            });
            return;
        }

        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});

export default router;

