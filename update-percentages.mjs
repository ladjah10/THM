import { readFileSync, writeFileSync, existsSync } from "fs";

// Files to process
const files = [
  "server/pdf-generator.ts",
  "server/nodemailer.ts",
  "server/sendgrid.ts",
  "server/couple-email-template.ts",
  "test-realistic-couple-assessment.ts"
];

// Process each file
files.forEach(file => {
  if (existsSync(file)) {
    // Read the file content
    let content = readFileSync(file, "utf8");
    
    // Replace .toFixed(1) with Math.round
    const updatedContent = content.replace(/(\w+)\.toFixed\(1\)/g, "Math.round($1)");
    
    // Write back the updated content
    writeFileSync(file, updatedContent, "utf8");
    console.log(`Updated file: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log("Done updating files.");
