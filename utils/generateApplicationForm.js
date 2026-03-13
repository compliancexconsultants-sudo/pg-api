const puppeteer = require("puppeteer");

const generateApplicationForm = async (tenant, pgName) => {

const html = `
<html>
<head>

<style>

body{
font-family:Times New Roman;
padding:40px;
font-size:14px;
}

.title{
text-align:center;
font-weight:bold;
font-size:20px;
}

.subtitle{
text-align:center;
margin-bottom:30px;
}

.photo{
position:absolute;
right:60px;
top:120px;
width:120px;
height:140px;
border:1px solid black;
text-align:center;
}

.photo img{
width:100%;
height:100%;
object-fit:cover;
}

.row{
margin:10px 0;
}

.label{
display:inline-block;
width:200px;
font-weight:bold;
}

.aadhaar{
margin-top:30px;
}

.aadhaar img{
width:300px;
border:1px solid #000;
}

.rules{
margin-top:20px;
}

.rules li{
margin:3px 0;
}

</style>

</head>

<body>

<div class="title">Best PG Accommodation Application Form</div>

<div class="subtitle">${pgName}</div>


<div class="photo">

<img src="${tenant.passportPhoto}" />

</div>


<div class="row"><span class="label">Name:</span>${tenant.name}</div>

<div class="row"><span class="label">Father Name:</span>${tenant.fatherName || ""}</div>

<div class="row"><span class="label">Residential Address:</span>${tenant.address}</div>

<div class="row"><span class="label">Local Guardian Address:</span>${tenant.occupationAddress}</div>

<div class="row"><span class="label">Date Of Joining:</span>${new Date().toLocaleDateString()}</div>

<div class="row"><span class="label">Mobile No:</span>${tenant.phone}</div>

<div class="row"><span class="label">Father No:</span>${tenant.altPhone || ""}</div>

<div class="row"><span class="label">Email:</span>${tenant.email}</div>


<div class="aadhaar">

<h3>Aadhaar Card</h3>

<img src="${tenant.aadhaarPhoto}" />

</div>


<div class="rules">

<h3 style="text-align:center">Rules & Regulations</h3>

<ol>

<li>Security deposit and rent must be paid at joining.</li>
<li>Deposit will be refunded at the time of vacating.</li>
<li>One month prior notice is required.</li>
<li>Rent must be paid before the 5th of every month.</li>
<li>Electrical appliances usage restricted.</li>
<li>Alcohol and smoking strictly prohibited.</li>
<li>Rent collected monthly basis.</li>
<li>Rent once paid will not be refunded.</li>
<li>Management not responsible for belongings.</li>
<li>Management has right to terminate accommodation.</li>

</ol>

</div>

</body>

</html>
`;

const browser = await puppeteer.launch({ headless: "new" });

const page = await browser.newPage();

await page.setContent(html);

const pdf = await page.pdf({
format: "A4",
printBackground: true
});

await browser.close();

return pdf;

};

module.exports = generateApplicationForm;