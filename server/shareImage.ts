import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

/**
 * Generate a sharable image for social media
 * 
 * This creates a simple HTML page with the assessment results that can be screenshotted
 * In a production environment, this would be expanded to use canvas or another
 * image generation library to create a custom image with the user's results
 */
export async function generateShareImage(req: Request, res: Response) {
  try {
    const { profile, score, name } = req.query as { profile: string, score: string, name: string };
    
    if (!profile || !score) {
      return res.status(400).send('Missing required parameters');
    }

    // Create a simple HTML template for the image
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>100 Marriage Assessment Results</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
            width: 1200px;
            height: 630px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            width: 1100px;
            height: 580px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            padding: 40px;
            position: relative;
            overflow: hidden;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          h1 {
            color: #2c3e50;
            font-size: 36px;
            margin-bottom: 10px;
          }
          .profile {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 40px 0;
          }
          .profile-content {
            text-align: center;
            max-width: 800px;
          }
          .profile-name {
            font-size: 42px;
            color: #3182ce;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .score {
            font-size: 64px;
            font-weight: bold;
            color: #2c5282;
            margin: 10px 0;
          }
          .footer {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 24px;
            color: #4a5568;
          }
          .footer span {
            display: block;
            margin-top: 5px;
            font-size: 18px;
            color: #718096;
          }
          .decorative-bar {
            height: 10px;
            background: linear-gradient(90deg, #3182ce, #2c5282);
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          .share-url {
            font-size: 20px;
            color: #3182ce;
            margin-top: 30px;
          }
          .person-name {
            font-size: 24px;
            color: #4a5568;
            margin-bottom: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="decorative-bar"></div>
          <div class="header">
            <h1>The 100 Marriage Assessment Results</h1>
            ${name ? `<div class="person-name">Results for ${name}</div>` : ''}
          </div>
          
          <div class="profile">
            <div class="profile-content">
              <div class="profile-name">
                ${profile}
              </div>
              <div class="score">
                ${score}%
              </div>
            </div>
          </div>
          
          <div class="footer">
            Take the assessment yourself
            <span>100marriage-assessment.replit.app</span>
          </div>
        </div>
      </body>
      </html>
    `;

    // Return the HTML - the client can convert this to an image
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating share image:', error);
    res.status(500).send('Error generating share image');
  }
}