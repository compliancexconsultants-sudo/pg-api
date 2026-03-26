const puppeteer = require("puppeteer");
const QRCode = require("qrcode");

const generateIdCard = async (tenant, pgName) => {

  // ✅ Generate QR (PG Address inside)
  const qrData = `
PG: ${pgName}
Address: ${tenant.address}
Tenant: ${tenant.name}
Phone: ${tenant.phone}
  `;

  const qrImage = await QRCode.toDataURL(qrData);

  const html = `
  <html>
  <head>
  <style>
* {
  box-sizing: border-box;
}
  body{
    font-family: Arial;
    background:#f2f2f2;
    padding:30px;
  }

  .container{
    display:flex;
     gap:30px;  
  }

 .card{
  width:340px;
  height:520px;
  border-radius:14px;
  overflow:hidden;
  background:white;
  position:relative;
  flex-shrink:0;     
}

  /* WATERMARK */
  .card::after{
    content:"PG HUB";
    position:absolute;
    top:40%;
    left:20%;
    font-size:50px;
    color:rgba(0,0,0,0.05);
    transform:rotate(-30deg);
  }

  .header{
    background:linear-gradient(135deg,#1e3a8a,#1e40af);
    color:white;
    padding:16px;
    text-align:center;
  }

  .header h1{
    margin:0;
    font-size:20px;
  }

  .sub{
    font-size:12px;
    margin-top:3px;
  }

  .badge{
    position:absolute;
    top:10px;
    right:10px;
    background:#22c55e;
    color:white;
    font-size:10px;
    padding:4px 8px;
    border-radius:20px;
  }

  .title{
    text-align:center;
    background:#0f172a;
    color:white;
    padding:6px;
    font-weight:bold;
    font-size:12px;
    letter-spacing:1px;
  }

  .photo{
    text-align:center;
    margin-top:15px;
  }

  .photo img{
    width:120px;
    height:140px;
    border-radius:8px;
    object-fit:cover;
    border:2px solid #ddd;
  }

  .details{
    padding:15px;
    font-size:13px;
  }

  .details p{
    margin:6px 0;
    border-bottom:1px dashed #ccc;
    padding-bottom:2px;
  }

  .id-strip{
    background:#e5e7eb;
    text-align:center;
    padding:6px;
    font-size:12px;
    font-weight:bold;
  }

  .footer{
    position:absolute;
    bottom:10px;
    width:100%;
    text-align:center;
    font-size:11px;
    color:#666;
  }

  /* BACK SIDE */

.back{
  background:linear-gradient(135deg,#1e3a8a,#0f172a);
  color:white;
  padding:20px;
  position:relative;
  width:340px;      
  height:520px;    
}

  .section{
    margin-top:10px;
  }

  .section h3{
    margin:5px 0;
    font-size:14px;
    border-bottom:1px solid rgba(255,255,255,0.3);
  }

  .section p{
    font-size:12px;
    margin:4px 0;
  }

  .qr{
    text-align:center;
    margin-top:15px;
  }

  .qr img{
    width:110px;
    height:110px;
    background:white;
    padding:5px;
    border-radius:8px;
  }

  .rules{
    margin-top:10px;
    font-size:11px;
  }

  .rules li{
    margin:3px 0;
  }

  .sign{
    position:absolute;
    bottom:15px;
    width:100%;
    text-align:center;
    font-size:12px;
  }

  </style>
  </head>

  <body>

  <div class="container">

  <!-- FRONT -->

  <div class="card">

    <div class="badge">ACTIVE</div>

    <div class="header">
      <h1>${pgName}</h1>
      <div class="sub">Tenant Identification</div>
    </div>

    <div class="title">ID CARD</div>

    <div class="photo">
      <img src="${tenant.passportPhoto}" />
    </div>

    <div class="details">
      <p><b>Name:</b> ${tenant.name}</p>
      <p><b>ID:</b> ${tenant._id.toString().slice(-6)}</p>
      <p><b>Room:</b> ${tenant.room || "N/A"}</p>
      <p><b>Mobile:</b> ${tenant.phone}</p>
      <p><b>Check-in:</b> ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="id-strip">
      ${pgName.toUpperCase()} • VERIFIED TENANT
    </div>

    <div class="footer">
      Issued on ${new Date().toLocaleDateString()}
    </div>

  </div>


  <!-- BACK -->

  <div class="card back">

    <div class="section">
      <h3>PG Address</h3>
      <p>${tenant.address}</p>
    </div>

    <div class="section">
      <h3>Emergency Contact</h3>
      <p><b>Name:</b> ${tenant.name}</p>
      <p><b>Phone:</b> ${tenant.phone}</p>
    </div>

    <div class="qr">
      <img src="${qrImage}" />
      <p style="font-size:10px;margin-top:5px;">Scan for details</p>
    </div>

    <div class="rules">
      <h3>Rules</h3>
      <ul>
        <li>Carry ID inside premises</li>
        <li>Non-transferable</li>
        <li>Report loss immediately</li>
      </ul>
    </div>

    <div class="sign">
      <p>Authorized Signature</p>
      <b>${pgName} Management</b>
    </div>

  </div>

  </div>

  </body>
  </html>
  `;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  // ✅ Fix timeout issue
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
    printBackground: true
  });

  await browser.close();

  return pdf;
};

module.exports = generateIdCard;