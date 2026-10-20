
import { Schema, model } from "mongoose";

export const sessionStatus = {
    available: "AVAILABLE",
    booked: "BOOKED",
    completed: "COMPLETED",
} as const;

const sessionSchema = new Schema(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(sessionStatus),
            default: sessionStatus.available,
            required: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

sessionSchema.path("endTime").validate(function (value: Date) {
    return value > this.startTime;
}, "endTime must be greater than startTime");

sessionSchema.index({ status: 1, startTime: 1 });
sessionSchema.index({ userId: 1, status: 1 });

export const Session = model("Session", sessionSchema);

