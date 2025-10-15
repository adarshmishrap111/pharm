# Pharm Backend (Product Upload)

This is a small Node.js + Express backend to accept product uploads from `product-upload.html`.

Features:
- Accepts multipart/form-data with fields: `productName`, `price`, `description`, and `productImage` (file).
- Stores uploaded images under `assets/uploads` and product metadata in `products.json`.
- Serves static files so you can open the frontend from `index.html` and use the upload form.

Requirements:
- Node.js 14+ and npm

Quick start (PowerShell):

```powershell
cd "C:\Users\Admin\OneDrive\Desktop\Pharm"
npm install
npm start
```

The server will run on http://localhost:3000. The upload endpoint is `POST /api/products`.

Example curl (POSIX) - PowerShell multipart example below:

PowerShell example to upload a file:

```powershell
$uri = 'http://localhost:3000/api/products'
$boundary = "----WebKitFormBoundary$(Get-Random)"
$LF = "`r`n"
$bodyLines = @()
function Add-FormField($name, $value) {
  $bodyLines += "--$boundary"
  $bodyLines += "Content-Disposition: form-data; name=\"$name\"" 
  $bodyLines += ""
  $bodyLines += $value
}
Add-FormField 'productName' 'Test Product'
Add-FormField 'price' '9.99'
Add-FormField 'description' 'Sample description'
$bodyLines += "--$boundary"
$filePath = 'C:\path\to\your\image.jpg'
$fileName = [System.IO.Path]::GetFileName($filePath)
$bodyLines += "Content-Disposition: form-data; name=\"productImage\"; filename=\"$fileName\""
$bodyLines += "Content-Type: application/octet-stream"
$bodyLines += ""
$body = [System.Text.Encoding]::ASCII.GetBytes(($bodyLines -join $LF)) + [System.IO.File]::ReadAllBytes($filePath) + [System.Text.Encoding]::ASCII.GetBytes($LF + "--$boundary--" + $LF)
$headers = @{ 'Content-Type' = "multipart/form-data; boundary=$boundary" }
Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body
```

Notes:
- Uploaded images are served from `/uploads/<filename>`.
- Products are appended to `products.json`.

