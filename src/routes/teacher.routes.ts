
import { Router } from "express";
import { Teacher } from "../models/teacher.model";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { fullName, email, specialization, experience } = req.body;

        if ( typeof fullName !== "string" || !fullName.trim()
              || typeof email !== "string" || !email.trim()
              || typeof specialization !== "string" || !specialization.trim()
              || typeof experience !== "number" || !Number.isFinite(experience) || experience < 0) {
                res.status(400).json({
                message: "Valid fullName, email, specialization, and experience are required", });
            return;
        }

        const teacher = await Teacher.create({
            fullName,
            email,
            specialization,
            experience,
        });

        res.status(201).json({
            message: "Teacher created successfully",
            teacher,
        });
    } catch (error: unknown) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});

export default router;

