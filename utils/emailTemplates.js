exports.tenantReceiptEmail = (tenantName, pgName) => {
  return `
  <div style="font-family:Arial;padding:20px;background:#f9fafb">
    <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px">

      <h2 style="color:#4F46E5">Welcome to ${pgName}</h2>

      <p>Hello <b>${tenantName}</b>,</p>

      <p>
      Your accommodation has been successfully registered in our system.
      Please find the attached payment receipt for your advance payment and rental details.
      </p>

      <p>
      Keep this receipt for your records.
      </p>

      <br/>

      <p>
      If you have any questions, please contact your PG management.
      </p>

      <br/>

      <p style="color:#555">
      Regards,<br/>
      <b>MyPGHubX Team</b>
      </p>

    </div>
  </div>
  `;
};

exports.ownerTenantAdded = (tenantName, tenantEmail, pgName) => {
  return `
  <div style="font-family:Arial;padding:20px">
    <h2 style="color:#4F46E5">New Tenant Added</h2>

    <p>A new tenant has been registered in your PG.</p>

    <table style="border-collapse:collapse">
      <tr>
        <td style="padding:6px"><b>Name</b></td>
        <td style="padding:6px">${tenantName}</td>
      </tr>

      <tr>
        <td style="padding:6px"><b>Email</b></td>
        <td style="padding:6px">${tenantEmail}</td>
      </tr>

      <tr>
        <td style="padding:6px"><b>PG</b></td>
        <td style="padding:6px">${pgName}</td>
      </tr>
    </table>

    <br/>

    <p>You can manage this tenant from your dashboard.</p>

    <br/>

    <p>MyPGHubX System</p>
  </div>
  `;
};