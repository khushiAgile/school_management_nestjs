export const verifyUserTemplate = (password: string) => `

<!DOCTYPE html>
<html lang="en">
  
  <body>
   <h2>Your login credentials</h2>
   <ul>
   <li> <b>Password : </b> ${password} </li>
   </ul>
  </body>
</html>`;
