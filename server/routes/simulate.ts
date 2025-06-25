// Express route to simulate assessment, generate PDF, and email results to la@lawrenceadjah.com

import express from "express";
import path from "path";
import fs from "fs";
import { calculateAssessmentWithResponses } from "../utils/calculateAssessmentWithResponses";
import { generatePDF } from "../pdf/updated-individual-pdf";
import { sendAssessmentEmail } from "../mail/sendAssessmentEmail";

const router = express.Router();

router.get("/simulate", async (req, res) => {
  const gender = req.query.gender;
  const email = "la@lawrenceadjah.com";

  if (!gender || (gender !== "male" && gender !== "female")) {
    return res.status(400).json({ error: "Invalid gender. Use 'male' or 'female'." });
  }

  try {
    const filePath = path.resolve(__dirname, "../../data/simulated_male_traditional_responses.json");
    const responses = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const demographics = {
      gender: gender === "male" ? "Male" : "Female",
      ageRange: "30-39",
      ethnicity: "Black",
      location: "Texas"
    };

    const result = await calculateAssessmentWithResponses(email, demographics, responses);
    const pdfBuffer = await generatePDF(result);
    await sendAssessmentEmail(email, pdfBuffer, result);

    res.status(200).json({
      message: "Simulated response processed and emailed.",
      result: result.scores?.overallPercentage
    });
  } catch (error) {
    console.error("Error during simulation:", error);
    res.status(500).json({ error: "Simulation failed." });
  }
});

export default router;