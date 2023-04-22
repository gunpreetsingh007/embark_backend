const moment = require("moment")
const { ToWords } = require('to-words');
const generateMaharashtraInvoiceHtml = (order) => {
   
    let hsnAggregate = {}
    order.orderDetails.map((order)=>{
        if(hsnAggregate[order.hsnNumber]){
            hsnAggregate[order.hsnNumber].taxableValue += order.productDiscountPrice*order.count - 18/100*order.productDiscountPrice*order.count
            hsnAggregate[order.hsnNumber].totalTaxAmount += 18/100*order.productDiscountPrice*order.count
        }
        else{
            hsnAggregate[order.hsnNumber] = {}
            hsnAggregate[order.hsnNumber].taxableValue = order.productDiscountPrice*order.count - 18/100*order.productDiscountPrice*order.count
            hsnAggregate[order.hsnNumber].totalTaxAmount = 18/100*order.productDiscountPrice*order.count
        }
    })
    const returnHsnTable = ()=>{
        let html = ""
        for(let hsnNumber in hsnAggregate){
            let obj = hsnAggregate[hsnNumber]
            html += `<tr>
            <td class="w-50">
                <div class="d-flex w-100">
                   <div class="text-center" style="width:50%">${hsnNumber}</div>
                   <div style="width:25%">${(obj.taxableValue).toFixed(2)}</div>
                   <div style="width:25%">9%</div>
                </div>
            </td>
            <td class=" text-end" style="width:20%">${(obj.totalTaxAmount / 2).toFixed(2)}</td>
            <td  style="width:18%">
               <div class="d-flex">
                <div class="text-end w-50">9%</div>
                <div class=" w-50 text-end" style="border-left:1px solid #000;">${(obj.totalTaxAmount / 2).toFixed(2)}</div>
               </div> 
            </td>
            <td class="text-end">${(obj.totalTaxAmount).toFixed(2)}</td>
          </tr>`
        }
        return html
    }

    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
          currency: true,
          ignoreDecimal: false,
          ignoreZeroCurrency: false,
          doNotAddOnly: false,
          currencyOptions: { // can be used to override defaults for the selected locale
            name: 'Rupee',
            plural: 'Rupees',
            symbol: '₹',
            fractionalUnit: {
              name: 'Paisa',
              plural: 'Paise',
              symbol: '',
            }
          }
        }
    });
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        <style>
            table,td{
                border:1px solid #000;
            }
            .datedTr td{
                border:none;
            }
            .datedTr .info{
                border-bottom: 1px solid #000;
            }
            .summary tbody td{
                border:none;
                border-right:1px solid #000;
            }
            </style>
    </head>
    <body>
    <div class="container">
    <div class="h1 text-center">DIVINE COSMETICS LLP</div>
    <div class="address text-center">NISHUVI, 3rd Floor, 3-B 75, Dr. Annie Besant Road, Worli, Mumbai 400018</div>
    <div class="mt-2 taxInvoiceTitle" style="text-align:center; font-weight:600; color:#000;"> Tax Invoice </div>
    <table class="mt-2 w-100">
        <tr>
            <td class="w-50 p-2" style="vertical-align: baseline;">
                <div>Buyer</div>
                <p>
                   ${order.addressDetails.billingAddress.streetAddress}<br>${order.addressDetails.billingAddress.landmark}
                </p>
                <div>State Name: ${order.addressDetails.billingAddress.state}, Code: ${order.addressDetails.billingAddress.pincode}</div>
            </td>
            <td class="w-25">
                <table class="w-100 border-0">
                        <tr class="datedTr">
                            <td class="w-100">Invoice No.</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info">DIV/ECOM/${order.id}</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 border-0">Reference No.</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info">&nbsp; </td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 border-0">Buyer's Order No.</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info">${order.orderToken} </td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 border-0">Dispatch through</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info border-0">&nbsp; </td>
                        </tr>
                </table>
            </td>
            <td class="w-25">
                <table class="w-100 border-0">
                        <tr class="datedTr">
                            <td class="w-100">Dated</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info">${moment(order.placedAt).tz("Asia/Kolkata").format("DD MMM YYYY")}</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 border-0">Dated</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info">&nbsp; </td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 border-0">Dated</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info">&nbsp; </td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 border-0">&nbsp;</td>
                        </tr>
                        <tr class="datedTr">
                            <td class="w-100 fw-bold info border-0">&nbsp; </td>
                        </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td class="w-50 p-2">
                <div>Delivery Address</div>
                <p>
                    ${order.addressDetails.shippingAddress.streetAddress}<br>${order.addressDetails.shippingAddress.landmark}
                </p>
                <div>State Name: ${order.addressDetails.shippingAddress.state}, Code: ${order.addressDetails.shippingAddress.pincode}</div>
            </td>
        </tr>
        <table class="w-100 summary">
            ${order.orderDetails.map((order, index) => {
                return (
                    `<tr>
                        <td style="width:3%">${index + 1}</td>
                        <td style="width:10%">${order.refNumber}</td>
                        <td style="width:40%">${order.productName} - ${Object.values(order.attributeCombination)}</td>
                        <td style="width:10%; text-align:right;">${order.hsnNumber}</td>
                        <td class="fw-bold" style="width:7%; text-align:right;">${order.count} Pcs</td>
                        <td style="width:10%; text-align:right;">${(order.productDiscountPrice*order.count- 18/100*order.productDiscountPrice*order.count).toFixed(2)}</td>
                        <td style="width:5%; text-align:right;">Pcs</td>
                        <td style="width:5%">&nbsp;</td>
                        <td class="fw-bold" style="width:10%; text-align:right;">${(order.productDiscountPrice*order.count - 18/100*order.productDiscountPrice*order.count).toFixed(2)}</td>
                    </tr>`
                )
            }).join('')}
                <tr>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td class="fw-bold"  style="text-align:right;">Output CGST 9.00%</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td style="text-align:right;">9</td>
                    <td style="text-align:right;">%</td>
                    <td>&nbsp;</td>
                    <td class="fw-bold" style="text-align:right;">${(18/100*order.orderAmount/2).toFixed(2)}</td>
                </tr>
                <tr>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td class="fw-bold"  style="text-align:right;">Output SGST 9.00%</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td style="text-align:right;">9</td>
                    <td style="text-align:right;">%</td>
                    <td>&nbsp;</td>
                    <td class="fw-bold" style="text-align:right;">${(18/100*order.orderAmount/2).toFixed(2)}</td>
                </tr>
                <tr>
                <td class="w-auto">&nbsp;</td>
                <td>&nbsp;</td>
                <td class="fw-bold"  style="text-align:right;">Round Off</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td style="text-align:right;">&nbsp;</td>
                <td style="text-align:right;">&nbsp;</td>
                <td>&nbsp;</td>
                <td class="fw-bold" style="text-align:right;">${(order.orderAmount - Math.round(order.orderAmount)).toFixed(2)}</td>
            </tr>
                <tr>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td class="w-auto">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <table class="w-100">
                    <tr>
                        <td style="width:3%">&nbsp;</td>
                        <td class="" style="width:50%; text-align: end;">Total</td>
                        <td style="width:10%">&nbsp;</td>
                        <td style="width:7%; text-align:right;">${order.orderDetails.map(item=>item.count).reduce(function (x, y) {
                            return x + y;
                        }, 0)} Pcs</td>
                        <td style="width:10%">&nbsp;</td>
                        <td style="width:5%">&nbsp;</td>
                        <td style="width:5%">&nbsp;</td>
                        <td class="fw-bold" style="width:10%; text-align:right;">&#8377;${Math.round(order.orderAmount)}</td>
                    </tr>
                </table>
                <table class="w-100">
                    <tr>
                        <td style="width:90%; border-right:none; border-bottom:none">Amount Chargeable (in words)</td>
                        <td style="width:10%; border-left:none; border-bottom:none">E. & O.E</td>
                    </tr>
                    <tr>
                        <td class="fw-bold border-0" style="width:90%; border-right:none;">INR ${toWords.convert(Math.round(order.orderAmount))}</td>
                        <td style="width:10%; border-left:none; border-top:none">&nbsp;</td>
                    </tr>
                </table>
                <table class="w-100">
                    <tr>
                        <td class="w-50">
                            <div class="d-flex w-100">
                               <div class="text-center" style="width:50%">HSN/SAC</div>
                               <div style="width:25%">Value</div>
                               <div style="width:25%">Rate</div>
                            </div>
                        </td>
                        <td style="width:20%">Taxable Amount</td>
                        <td  style="width:18%">
                           <div class="d-flex flex-column">
                           <div class="text-center">central Tax</div> 
                           <div class="d-flex">
                            <div class="text-center w-50" style="border-top:1px solid #000;">Rate</div>
                            <div class="text-center w-50" style="border-top:1px solid #000; border-left:1px solid #000;">Amount</div>
                           </div> 
                           </div>
                        </td>
                        <td>Total Amount</td>
                    </tr>
                </table>
                <table class="w-100">
                ${returnHsnTable()}
                </table>
                <table class="w-100">
                    <tr>
                        <td class="w-50">
                            <div class="d-flex w-100">
                               <div class="text-center fw-bold" style="width:50%">Total</div>
                               <div class="fw-bold" style="width:25%">${(order.orderAmount - 18/100*order.orderAmount).toFixed(2)}</div>
                               <div class="fw-bold" style="width:25%">&nbsp;</div>
                            </div>
                        </td>
                        <td class="fw-bold text-end" style="width:20%">${(18/100*order.orderAmount/2).toFixed(2)}</td>
                        <td  style="width:18%">
                           <div class="d-flex">
                            <div class="text-center w-50">&nbsp;</div>
                            <div class="text-end w-50 fw-bold" style="border-left:1px solid #000;">${(18/100*order.orderAmount/2).toFixed(2)}</div>
                           </div>
                        </td>
                        <td class="fw-bold text-end">${(18/100*order.orderAmount).toFixed(2)}</td>
                    </tr>
                </table>
                <table class="w-100 mb-2">
                    <tr>
                        <td class="ps-2">
                            <div>Tax Amount(in words) :  <span class="fw-bold">INR ${toWords.convert((18/100*order.orderAmount).toFixed(2))}</span></div>
                            <div class="d-flex w-100">
                                <div class="w-50">
                                    <div>Comapny's GSTIN/UIN  : <span class="fw-bold">27AAMFD6389H1ZV</span></div>
                                    <div>Reverse Charge [Y/N]  : <span class="fw-bold">NO</span></div>
                                    <div class="mt-3 ps-2">
                                       <span style="text-decoration: underline;">Declaration</span>
                                        <br>
                                        1. Our responsibility in respect of goods ceases on delivery,
                                        We are not responsible for any subsequent loss due to
                                        damage, shortage or theft. 2.All the complaints pertaining to
                                        the goods of this bill should be informed within 7 day of
                                        delivery in writing otherwise no claim shall be entertained. 3.
                                        The net & gross weight are weight when packed and they are
                                        acceptable to the buyer. 4.All the matters pertaining to this bill are subject to Mumbai Jurisdiction.
                                    </div>
                                </div>
                                <div class="w-50 ps-4">
                                    <div>Company's Bank Details</div>
                                    <div>A/c Holder’s Name : <span class="fw-bold">DIVINE COSMETICS LLP</span></div>
                                    <div>Bank Name : <span class="fw-bold">Axis Bank_918020017526115</span> </div>
                                    <div>A/c No. : <span class="fw-bold">918020017526115</span></div>
                                    <div>Branch & IFS Code : <span class="fw-bold">Napeansea Road & UTIB0000149</span></div>
                                    <div>State : <span class="fw-bold">Maharastra</span> &nbsp; code: <span class="fw-bold">27</span></div>
                                    <div>E-Mail : <span class="fw-bold">warehouse01@divinecosmetics.org</span></div>
                                    <div class="mt-3" style="border-left:1px solid #000; border-top:1px solid #000; position:relative;">
                                        <div class="fw-bold" style="position:absolute;top:0px;right:8%;">for DIVINE COSMETICS LLP</div>
                                        <div style="height:120px;">
                                        <div style="height:90px; width:150px; position:absolute; right:55px; top:-20px;">       
                                        <img class="stamp" style="position:absolute; top:0px; left:0px;" src="http://localhost:8085/images/assets/stamp.png" height="150px" width="150px" />
                                        <img class="sign" style="position:absolute; top:0px; left:0px;" src="http://localhost:8085/images/assets/sign.png" height="150px" width="150px" />
                                        </div>
                                        </div>
                                        <div style="position:absolute; bottom:0px; right:8%;">Authorised Signatory</div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="mb-3 text-center">This is a Computer Generated Invoice</div>
        </table>
    </table>

    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
    </body>
    </html>`
}

module.exports = {
    generateMaharashtraInvoiceHtml
}