// baseEmailTemplate.js
import { emailStyles } from "./emailStyles.js";

export const baseEmailTemplate = (title, bodyContent) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${emailStyles}
  </style>
</head>
<body>
  <div class="container">
    ${bodyContent}
  </div>
</body>
</html>
`;
