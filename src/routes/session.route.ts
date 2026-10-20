import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Teacher } from "../models/teacher.model";
import { Session, sessionStatus } from "../models/session.model";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { teacherId, startTime, endTime } = req.body;

        if ( typeof teacherId !== "string" || !isValidObjectId(teacherId) || !startTime || !endTime) {
            res.status(400).json({
                message: "Valid teacherId, startTime, and endTime are required",
            });
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if ( Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
            res.status(400).json({
                message: "endTime must be a valid date later than startTime",
            });
            return;
        }

        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            res.status(404).json({
                message: "Teacher not found",
            });
            return;
        }

        const session = await Session.create({
            teacherId,
            startTime: start,
            endTime: end,
        });

        res.status(201).json({
            message: "Session created successfully",
            session,
        });
    } catch (error: unknown) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});



router.get("/available", async (req, res) => {
    try {
        const { dateTimestamp } = req.query;
        if ( typeof dateTimestamp !== "string" || dateTimestamp.trim() === "") {
            res.status(400).json({
                message: "dateTimestamp query parameter is required",
            });
            return;
        }

        const timestamp = Number(dateTimestamp);
        const requestedDate = new Date(timestamp);

        if ( !Number.isFinite(timestamp) || Number.isNaN(requestedDate.getTime())) {
            res.status(400).json({
                message: "dateTimestamp must be a valid millisecond timestamp",
            });
            return;
        }

        const startOfDay = new Date(
            Date.UTC(
                requestedDate.getUTCFullYear(),
                requestedDate.getUTCMonth(),
                requestedDate.getUTCDate()
            )
        );

        const nextDay = new Date(startOfDay);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);

        const sessions = await Session.aggregate([
            {
                $match: {
                    status: sessionStatus.available,
                    startTime: {
                        $gte: startOfDay,
                        $lt: nextDay,
                    },
                },
            },
            {
                $sort: {
                    startTime: 1,
                },
            },
        ]);

        res.status(200).json({
            count: sessions.length,
            sessions,
        });
    } catch (error: unknown) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});



export default router;

