const moment = require("moment")

const generateOrderPlacedHtml = (order, firstName, lastName) => {

  return `<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
  style="font-family:arial, 'helvetica neue', helvetica, sans-serif">

<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>New email template 2023-04-18</title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if !mso]><!-- -->
  <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet"><!--<![endif]-->
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    .es-button {
      mso-style-priority: 100 !important;
      text-decoration: none !important;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
      mso-hide: all;
    }

    @media only screen and (max-width:600px) {

      p,
      ul li,
      ol li,
      a {
        line-height: 150% !important
      }

      h1,
      h2,
      h3,
      h1 a,
      h2 a,
      h3 a {
        line-height: 120%
      }

      h1 {
        font-size: 40px !important;
        text-align: center !important
      }

      h2 {
        font-size: 32px !important;
        text-align: center !important
      }

      h3 {
        font-size: 24px !important;
        text-align: center !important
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 40px !important;
        text-align: center !important
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 32px !important;
        text-align: center !important
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 24px !important;
        text-align: center !important
      }

      .es-menu td a {
        font-size: 12px !important
      }

      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li,
      .es-header-body a {
        font-size: 14px !important
      }

      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li,
      .es-content-body a {
        font-size: 14px !important
      }

      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li,
      .es-footer-body a {
        font-size: 12px !important
      }

      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li,
      .es-infoblock a {
        font-size: 12px !important
      }

      *[class="gmail-fix"] {
        display: none !important
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3 {
        text-align: center !important
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3 {
        text-align: right !important
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3 {
        text-align: left !important
      }

      .es-m-txt-r img,
      .es-m-txt-c img,
      .es-m-txt-l img {
        display: inline !important
      }

      .es-button-border {
        display: inline-block !important
      }

      a.es-button,
      button.es-button {
        font-size: 16px !important;
        display: inline-block !important
      }

      .es-adaptive table,
      .es-left,
      .es-right {
        width: 100% !important
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100% !important;
        max-width: 600px !important
      }

      .es-adapt-td {
        display: block !important;
        width: 100% !important
      }

      .adapt-img {
        width: 100% !important;
        height: auto !important
      }

      .es-m-p0 {
        padding: 0 !important
      }

      .es-m-p0r {
        padding-right: 0 !important
      }

      .es-m-p0l {
        padding-left: 0 !important
      }

      .es-m-p0t {
        padding-top: 0 !important
      }

      .es-m-p0b {
        padding-bottom: 0 !important
      }

      .es-m-p20b {
        padding-bottom: 20px !important
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none !important
      }

      tr.es-desk-hidden,
      td.es-desk-hidden,
      table.es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important
      }

      tr.es-desk-hidden {
        display: table-row !important
      }

      table.es-desk-hidden {
        display: table !important
      }

      td.es-desk-menu-hidden {
        display: table-cell !important
      }

      .es-menu td {
        width: 1% !important
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto !important
      }

      table.es-social {
        display: inline-block !important
      }

      table.es-social td {
        display: inline-block !important
      }

      .es-desk-hidden {
        display: table-row !important;
        width: auto !important;
        overflow: visible !important;
        max-height: inherit !important
      }

      .es-m-p5 {
        padding: 5px !important
      }

      .es-m-p5t {
        padding-top: 5px !important
      }

      .es-m-p5b {
        padding-bottom: 5px !important
      }

      .es-m-p5r {
        padding-right: 5px !important
      }

      .es-m-p5l {
        padding-left: 5px !important
      }

      .es-m-p10 {
        padding: 10px !important
      }

      .es-m-p10t {
        padding-top: 10px !important
      }

      .es-m-p10b {
        padding-bottom: 10px !important
      }

      .es-m-p10r {
        padding-right: 10px !important
      }

      .es-m-p10l {
        padding-left: 10px !important
      }

      .es-m-p15 {
        padding: 15px !important
      }

      .es-m-p15t {
        padding-top: 15px !important
      }

      .es-m-p15b {
        padding-bottom: 15px !important
      }

      .es-m-p15r {
        padding-right: 15px !important
      }

      .es-m-p15l {
        padding-left: 15px !important
      }

      .es-m-p20 {
        padding: 20px !important
      }

      .es-m-p20t {
        padding-top: 20px !important
      }

      .es-m-p20r {
        padding-right: 20px !important
      }

      .es-m-p20l {
        padding-left: 20px !important
      }

      .es-m-p25 {
        padding: 25px !important
      }

      .es-m-p25t {
        padding-top: 25px !important
      }

      .es-m-p25b {
        padding-bottom: 25px !important
      }

      .es-m-p25r {
        padding-right: 25px !important
      }

      .es-m-p25l {
        padding-left: 25px !important
      }

      .es-m-p30 {
        padding: 30px !important
      }

      .es-m-p30t {
        padding-top: 30px !important
      }

      .es-m-p30b {
        padding-bottom: 30px !important
      }

      .es-m-p30r {
        padding-right: 30px !important
      }

      .es-m-p30l {
        padding-left: 30px !important
      }

      .es-m-p35 {
        padding: 35px !important
      }

      .es-m-p35t {
        padding-top: 35px !important
      }

      .es-m-p35b {
        padding-bottom: 35px !important
      }

      .es-m-p35r {
        padding-right: 35px !important
      }

      .es-m-p35l {
        padding-left: 35px !important
      }

      .es-m-p40 {
        padding: 40px !important
      }

      .es-m-p40t {
        padding-top: 40px !important
      }

      .es-m-p40b {
        padding-bottom: 40px !important
      }

      .es-m-p40r {
        padding-right: 40px !important
      }

      .es-m-p40l {
        padding-left: 40px !important
      }
    }
  </style>
</head>

<body
  style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#EFF7F6"><!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#eff7f6"></v:fill>
			</v:background>
		<![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#EFF7F6">
      <tr>
        <td valign="top" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0" class="es-header" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" style="padding:0;Margin:0">
          <table class="es-content" cellspacing="0" cellpadding="0" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table class="es-content-body"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px"
                  cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                  <tr>
                    <td align="left" style="padding:0;Margin:0">
                      <table cellspacing="0" cellpadding="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:600px">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0;position:relative"><img class="adapt-img"
                                    src="${process.env.SERVER_URL}/images/assets/emailBanner.jpg"
                                    alt title width="600"
                                    style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" bgcolor="#6a994e"
                      style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;background-color:#6a994e">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" class="es-m-txt-c" style="padding:10px;Margin:0">
                                  <h3
                                    style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#ffffff">
                                    Hello ${firstName} ${lastName},</h3>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:20px">
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    Thank you for your recent order. We are pleased to confirm that we have received
                                    your order and it is currently being processed.</p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:30px"><!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
	<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                style="height:39px; v-text-anchor:middle; width:142px" arcsize="13%" strokecolor="#ffffff" strokeweight="1px" fillcolor="#ffffff">
		<w:anchorlock></w:anchorlock>
		<center style='color:#386641; font-family:Raleway, Arial, sans-serif; font-size:14px; font-weight:400; line-height:14px;  mso-text-raise:1px'>View Order</center>
	</v:roundrect></a>
<![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border"
                                    style="border-style:solid;border-color:#ffffff;background:#ffffff;border-width:1px;display:inline-block;border-radius:5px;width:auto;mso-border-alt:10px;mso-hide:all"><a
                                      href="https://viewstripo.email" class="es-button" target="_blank"
                                      style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#386641;font-size:16px;display:inline-block;background:#ffffff;border-radius:5px;font-family:Raleway, Arial, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;padding:10px 30px 10px 30px;border-color:#ffffff">View
                                      Order</a></span><!--<![endif]--></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-left:20px;padding-right:20px;padding-bottom:30px;padding-top:40px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0">
                                  <h1
                                    style="Margin:0;line-height:60px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:50px;font-style:normal;font-weight:normal;color:#386641">
                                    Order summary</h1>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-p10t"
                                  style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px">
                                  <h3 class="b_title"
                                    style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">
                                    ORDER NO.&nbsp;${order.orderToken}<br>${moment(order.placedAt).tz("Asia/Kolkata").format("DD/MM/YYYY")}
                                  </h3>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${order.orderDetails.map(order => {
                    return (
                      `<tr>
                        <td align="left"
                          style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-bottom:40px">
                          <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:195px" valign="top"><![endif]-->
                          <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                            <tr>
                              <td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:195px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                  <tr>
                                    <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                        href="https://viewstripo.email"
                                        style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#6A994E;font-size:16px"><img
                                          class="adapt-img p_image"
                                          src="${process.env.SERVER_URL + "/" + order.productImage}"
                                          alt
                                          style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border-radius:10px"
                                          width="195"></a></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!--[if mso]></td><td style="width:20px"></td><td style="width:345px" valign="top"><![endif]-->
                          <table cellpadding="0" cellspacing="0" class="es-right" align="right"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                            <tr>
                              <td align="left" style="padding:0;Margin:0;width:345px">
                                <table cellpadding="0" cellspacing="0" width="100%"
                                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:1px solid #386641;border-right:1px solid #386641;border-top:1px solid #386641;border-bottom:1px solid #386641;border-radius:10px"
                                  role="presentation">
                                  <tr>
                                    <td align="left" class="es-m-txt-c"
                                      style="Margin:0;padding-left:20px;padding-right:20px;padding-top:25px;padding-bottom:25px">
                                      <h3 class="p_name"
                                        style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">
                                        ${order.productName}</h3>
                                      <p class="p_description"
                                        style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                        VOLUME: ${Object.values(order.attributeCombination)}</p>
                                      <p
                                        style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                        QTY:&nbsp;${order.count}</p>
                                      <h3
                                        style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641"
                                        class="p_price">₹${order.productPrice*order.count}</h3>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table><!--[if mso]></td></tr></table><![endif]-->
                        </td>
                      </tr>`
                    )
                  }).join('')}
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-left:20px;padding-right:20px;padding-bottom:30px;padding-top:40px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0">
                                  <h1
                                    style="Margin:0;line-height:60px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:50px;font-style:normal;font-weight:normal;color:#386641">
                                    Order total</h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="esdev-adapt-off" align="left" style="padding:20px;Margin:0">
                      <table cellpadding="0" cellspacing="0" class="esdev-mso-table"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                        <tr>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:270px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="left" style="padding:0;Margin:0">
                                        <p
                                          style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                          Subtotal<br>Discount<br>Shipping</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:20px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:270px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="right" style="padding:0;Margin:0">
                                        <p
                                          style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                          ₹${order.orderAmountWithoutDiscount}<br>₹${order.orderAmountWithoutDiscount - order.orderAmount}<br>₹${order.deliveryCharges}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center"
                                  style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td
                                        style="padding:0;Margin:0;border-bottom:5px dotted #a7c957;background:unset;height:1px;width:100%;margin:0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="esdev-adapt-off" align="left" style="padding:20px;Margin:0">
                      <table cellpadding="0" cellspacing="0" class="esdev-mso-table"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                        <tr>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:270px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="left" class="es-m-txt-l" style="padding:0;Margin:0">
                                        <h3
                                          style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">
                                          Total</h3>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:20px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:270px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="right" class="es-m-txt-r" style="padding:0;Margin:0">
                                        <h3
                                          style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">
                                          ₹${order.orderTotalAmount}</h3>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-left:20px;padding-right:20px;padding-bottom:30px;padding-top:40px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0">
                                  <h1
                                    style="Margin:0;line-height:60px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:50px;font-style:normal;font-weight:normal;color:#386641">
                                    Billing and shipping</h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:20px;Margin:0">
                      <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:0;Margin:0">
                                  <h3
                                    style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">
                                    Billing</h3>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                    ${order.addressDetails?.billingAddress?.firstName} ${order.addressDetails?.billingAddress?.lastName}<br>${order.addressDetails?.billingAddress?.streetAddress}<br>${order.addressDetails?.billingAddress?.landmark}<br>${order.addressDetails?.billingAddress?.city} ${order.addressDetails?.billingAddress?.pincode} <br>${order.addressDetails?.billingAddress?.state}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-right" align="right"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:270px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:0;Margin:0">
                                  <h3
                                    style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#386641">
                                    Shipping</h3>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">
                                    ${order.addressDetails.shippingAddress.firstName} ${order.addressDetails.shippingAddress.lastName}<br>${order.addressDetails.shippingAddress.streetAddress}<br>${order.addressDetails.shippingAddress.landmark}<br>${order.addressDetails.shippingAddress.city} ${order.addressDetails.shippingAddress.pincode} <br>${order.addressDetails.shippingAddress.state}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>`
}

module.exports = {
  generateOrderPlacedHtml
}