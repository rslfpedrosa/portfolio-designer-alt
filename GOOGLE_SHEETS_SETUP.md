# Google Sheets Integration Setup

This guide will help you set up Google Sheets to automatically save contact form submissions alongside email notifications.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Contact Form Submissions" (or any name you prefer)
4. Add headers in row 1:
   - Column A: `Timestamp`
   - Column B: `Name`
   - Column C: `Email`
   - Column D: `Message`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const timestamp = data.timestamp || new Date().toLocaleString();
    const name = data.name || '';
    const email = data.email || '';
    const message = data.message || '';
    
    sheet.appendRow([timestamp, name, email, message]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾 icon) and give your project a name (e.g., "Contact Form Handler")

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Set the following:
   - **Description**: "Contact Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. **Copy the Web App URL** that appears (you'll need this!)
6. Click **Authorize access** when prompted and allow permissions

## Step 4: Add URL to Your Project

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add this line:
   ```
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Replace the URL with the Web App URL you copied from Step 3
4. Restart your development server (`npm run dev`)

## Step 5: Test

1. Submit a test message through your contact form
2. Check your Google Sheet - you should see a new row with the submission data
3. Check your email - you should also receive an email notification

## How It Works

- When someone submits the form, it will:
  1. Save the data to your Google Sheet (if configured)
  2. Send you an email via FormSubmit
  3. Send an auto-response to the sender

## Troubleshooting

- **No data appearing in Sheets**: Make sure you authorized the script when prompted
- **CORS errors**: The code uses `no-cors` mode, so errors won't show in console, but submissions will still work
- **Email not working**: FormSubmit works independently of Sheets, so emails will still be sent even if Sheets fails

## Security Note

The Web App URL will be visible in your code, but only authorized users (you) can execute it. The script requires your Google account authorization to write to your sheet.
