const puppeteer = require("puppeteer");

const generateApplicationForm = async (tenant, pgName) => {

    const html = `
<html>
<head>
<style>

@page {
  size: A4;
  margin: 20px;
}

body{
  font-family: 'Times New Roman', serif;
  font-size: 12px;
  color:#222;
  margin:0;
  padding:0;
}

.container{
  width:100%;
  height:100%;
  box-sizing:border-box;
  padding:20px;
  border:1px solid #000;
  position:relative;
}

/* HEADER */
.header{
  text-align:center;
  margin-bottom:10px;
}

.title{
  font-size:18px;
  font-weight:bold;
}

.subtitle{
  font-size:12px;
  color:#555;
}

/* PHOTO */
.photo{
  position:absolute;
  right:20px;
  top:20px;
  width:90px;
  height:110px;
  border:1px solid #000;
}

.photo img{
  width:100%;
  height:100%;
  object-fit:cover;
}

/* ROWS */
.row{
  display:flex;
  margin:5px 0;
}

.label{
  width:180px;
  font-weight:bold;
}

.value{
  flex:1;
  border-bottom:1px dotted #999;
}

/* SECTION */
.section-title{
  margin-top:12px;
  font-weight:bold;
  border-bottom:1px solid #000;
  font-size:13px;
}

/* AADHAAR */
.aadhaar{
  text-align:center;
  margin-top:8px;
}

.aadhaar img{
  width:220px;
  height:auto;
  border:1px solid #000;
}

/* RULES */
.rules{
  margin-top:10px;
  font-size:11px;
}

.rules ol{
  padding-left:18px;
  margin:5px 0;
}

.rules li{
  margin:2px 0;
}

/* FOOTER */
.footer{
  margin-top:15px;
  display:flex;
  justify-content:space-between;
}

.sign{
  text-align:center;
}

.sign-line{
  margin-top:25px;
  border-top:1px solid #000;
  width:140px;
}

</style>
</head>

<body>

<div class="container">

  <div class="header">
    <div class="title">PG ACCOMMODATION APPLICATION FORM</div>
    <div class="subtitle">${pgName}</div>
  </div>

  <div class="photo">
    <img src="${tenant.passportPhoto}" />
  </div>

  <div class="row"><div class="label">Full Name</div><div class="value">${tenant.name}</div></div>
  <div class="row"><div class="label">Father's Name</div><div class="value">${tenant.fatherName || ""}</div></div>
  <div class="row"><div class="label">Address</div><div class="value">${tenant.address}</div></div>
  <div class="row"><div class="label">Guardian Address</div><div class="value">${tenant.occupationAddress}</div></div>
  <div class="row"><div class="label">Joining Date</div><div class="value">${new Date().toLocaleDateString()}</div></div>
  <div class="row"><div class="label">Mobile</div><div class="value">${tenant.phone}</div></div>
  <div class="row"><div class="label">Father Contact</div><div class="value">${tenant.altPhone || ""}</div></div>
  <div class="row"><div class="label">Email</div><div class="value">${tenant.email}</div></div>

  <div class="section-title">Aadhaar Card</div>
  <div class="aadhaar">
    <img src="${tenant.aadhaarPhoto}" />
  </div>

  <div class="section-title">Rules & Regulations</div>
  <div class="rules">
    <ol>
      <li>Rent & deposit must be paid at joining.</li>
      <li>Deposit refundable during vacating.</li>
      <li>One month notice required.</li>
      <li>Pay rent before 5th every month.</li>
      <li>No heavy appliances allowed.</li>
      <li>No alcohol or smoking.</li>
      <li>Monthly rent system.</li>
      <li>No refund after payment.</li>
      <li>Management not responsible for belongings.</li>
      <li>Management can terminate stay anytime.</li>
    </ol>
  </div>

  <div class="footer">
    <div class="sign">
      <div class="sign-line"></div>
      Tenant Signature
    </div>

    <div class="sign">
      <div class="sign-line"></div>
      Authorized Signature
    </div>
  </div>

</div>

</body>
</html>
`;

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 0
    });

    // ✅ Ensure images load
    await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(
            images.map(img => {
                if (img.complete) return;
                return new Promise(resolve => {
                    img.onload = img.onerror = resolve;
                });
            })
        );
    });
    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true, // 🔥 important
        margin: {
            top: "10px",
            bottom: "10px",
            left: "10px",
            right: "10px"
        }
    });

    await browser.close();

    return pdf;

};

module.exports = generateApplicationForm;