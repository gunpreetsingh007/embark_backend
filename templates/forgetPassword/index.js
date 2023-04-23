const generateForgetPassowrdHTML = (token, firstName, lastName) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
        Greetings ${firstName + " " + lastName} <br> <br>
        Forgot your password? <br>
        we received a request to reset the password for your account. Please
        <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Click here</a> to set a password <br>
        This link will be expired in 1 hour <br><br>
        Team Embark
    </body >   
  </html > `
}

module.exports = {
  generateForgetPassowrdHTML
}