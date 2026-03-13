const puppeteer = require("puppeteer");

const generateIdCard = async (tenant, pgName) => {

  const html = `
  <html>
  <head>
  <style>

  body{
    font-family: Arial;
    background:#f2f2f2;
    padding:30px;
  }

  .container{
    display:flex;
    gap:40px;
  }

  .card{
    width:350px;
    height:520px;
    border-radius:14px;
    overflow:hidden;
    background:white;
    box-shadow:0 5px 20px rgba(0,0,0,0.15);
  }

  .header{
    background:linear-gradient(135deg,#1e3a8a,#1e40af);
    color:white;
    padding:20px;
    text-align:center;
  }

  .header h1{
    margin:0;
    font-size:24px;
  }

  .sub{
    font-size:14px;
    margin-top:5px;
  }

  .title{
    text-align:center;
    background:#0f172a;
    color:white;
    padding:8px;
    font-weight:bold;
  }

  .photo{
    text-align:center;
    margin-top:20px;
  }

  .photo img{
    width:140px;
    height:160px;
    border-radius:8px;
    object-fit:cover;
    border:2px solid #ccc;
  }

  .details{
    padding:20px;
    font-size:14px;
  }

  .details p{
    margin:8px 0;
  }

  .back{
    background:linear-gradient(135deg,#1e3a8a,#0f172a);
    color:white;
    padding:25px;
  }

  .rules{
    margin-top:20px;
  }

  </style>
  </head>

  <body>

  <div class="container">

  <!-- FRONT SIDE -->

  <div class="card">

    <div class="header">
      <h1>${pgName}</h1>
      <div class="sub">Tenant ID Card</div>
    </div>

    <div class="title">
      TENANT ID CARD
    </div>

    <div class="photo">
      <img src="${tenant.passportPhoto}" />
    </div>

    <div class="details">

      <p><b>Name:</b> ${tenant.name}</p>

      <p><b>Tenant ID:</b> ${tenant._id.toString().slice(-6)}</p>

      <p><b>Room No:</b> ${tenant.room || "N/A"}</p>

      <p><b>PG Name:</b> ${pgName}</p>

      <p><b>Check-in Date:</b> ${new Date().toLocaleDateString()}</p>

      <p><b>Mobile:</b> ${tenant.phone}</p>

    </div>

  </div>


  <!-- BACK SIDE -->

  <div class="card back">

    <h3>Address of PG</h3>
    <hr/>

    <p>${tenant.address}</p>

    <div style="margin-top:20px">

      <h3>Emergency Contact</h3>

      <p><b>Name:</b> ${tenant.name}</p>
      <p><b>Phone:</b> ${tenant.phone}</p>

    </div>

    <div class="rules">

      <h3>Rules</h3>

      <ul>
        <li>ID must be carried inside PG premises</li>
        <li>Non-transferable</li>
        <li>Loss must be reported immediately</li>
      </ul>

    </div>

    <div style="margin-top:40px;text-align:center">

      <p>Authorized Signature</p>

      <b>${pgName} Management</b>

    </div>

  </div>

  </div>

  </body>
  </html>
  `;

  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();

  await page.setContent(html);

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdf;
};

module.exports = generateIdCard;