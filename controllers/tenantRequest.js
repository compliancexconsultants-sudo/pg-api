const TenantRequest = require("../models/TenantRequest")
const PGOwner = require("../models/PGOwner")

const uploadToImgBB = require("../utils/uploadToImgBB")
const sendMail = require("../utils/sendEmail")
const fs = require("fs");

const PG = require("../models/PG");

/* =========================
GET PG NAME
========================= */

exports.getPGName = async (req, res) => {

    try {

        const { pg_id } = req.params;

        const pg = await PG.findById(pg_id).select("name");

        if (!pg) {
            return res.status(404).json({
                success: false,
                message: "PG not found"
            });
        }

        res.json({
            success: true,
            name: pg.name
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};
/* =========================
CREATE TENANT REQUEST
========================= */

exports.createTenantRequest = async (req, res) => {

    try {

        const {
            owner_id,
            pg_id,
            name,
            phone,
            altPhone,
            email,
            aadhaar,
            address,
            occupation,
            occupationAddress
        } = req.body



        /* upload images */

        let aadhaarUrl = "";
        let passportUrl = "";

        if (req.files?.aadhaarPhoto) {

            const filePath = req.files.aadhaarPhoto[0].path;

            const base64Image = fs.readFileSync(filePath, {
                encoding: "base64",
            });

            aadhaarUrl = await uploadToImgBB(base64Image);

            fs.unlinkSync(filePath); // delete temp file
        }


        if (req.files?.passportPhoto) {

            const filePath = req.files.passportPhoto[0].path;

            const base64Image = fs.readFileSync(filePath, {
                encoding: "base64",
            });

            passportUrl = await uploadToImgBB(base64Image);

            fs.unlinkSync(filePath);

        }



        /* save request */

        const request = await TenantRequest.create({

            ownerId: owner_id,
            pgId: pg_id,

            name,
            phone,
            altPhone,
            email,
            aadhaar,

            address,
            occupation,
            occupationAddress,

            aadhaarPhoto: aadhaarUrl,
            passportPhoto: passportUrl

        })



        /* get owner email */

        const owner = await PGOwner.findById(owner_id)

        if (owner) {

            await sendMail(

                owner.email,

                "New Tenant Check-In Request",

                `
<div style="font-family:Poppins,Arial,sans-serif;background:#f4f6fb;padding:30px">

<table style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.08)">

<tr>
<td style="background:linear-gradient(135deg,#5A5CF6,#7C3AED);padding:20px;text-align:center;color:white;font-size:20px;font-weight:600">
PGHub
</td>
</tr>

<tr>
<td style="padding:25px">

<h2 style="margin-top:0;color:#333">New Tenant Check-In Request</h2>

<p style="color:#666;font-size:14px">
A new tenant has submitted a self check-in form.
</p>

<table style="width:100%;border-collapse:collapse;margin-top:15px">

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;color:#555"><b>Name</b></td>
<td style="padding:10px;border-bottom:1px solid #eee">${name}</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;color:#555"><b>Phone</b></td>
<td style="padding:10px;border-bottom:1px solid #eee">${phone}</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;color:#555"><b>Email</b></td>
<td style="padding:10px;border-bottom:1px solid #eee">${email}</td>
</tr>

</table>

<div style="text-align:center;margin-top:25px">

<a href="https://yourdashboard.com/requests"
style="background:#5A5CF6;color:white;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:500">
Review Request
</a>

</div>

<p style="margin-top:25px;color:#888;font-size:12px;text-align:center">
Powered by <b>Codex Tech Innovations & Consultants LLP</b>
</p>

</td>
</tr>

</table>

</div>
`

            )

        }



        /* send mail to tenant */

        await sendMail(

            email,

            "PGHub • Check-In Request Submitted",

            `
<div style="font-family:Poppins,Arial,sans-serif;background:#f4f6fb;padding:30px">

<table style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.08)">

<tr>
<td style="background:linear-gradient(135deg,#5A5CF6,#7C3AED);padding:20px;text-align:center;color:white;font-size:20px;font-weight:600">
PGHub
</td>
</tr>

<tr>
<td style="padding:25px">

<h2 style="margin-top:0;color:#333">Check-In Request Submitted</h2>

<p style="color:#555;font-size:14px">
Thank you for submitting your tenant check-in request.
Your information has been successfully sent to the PG owner.
</p>

<div style="margin-top:15px;padding:12px;background:#f9fafc;border-radius:6px">

<table style="width:100%;border-collapse:collapse">

<tr>
<td style="padding:8px;color:#666"><b>Name</b></td>
<td style="padding:8px">${name}</td>
</tr>

<tr>
<td style="padding:8px;color:#666"><b>Phone</b></td>
<td style="padding:8px">${phone}</td>
</tr>

<tr>
<td style="padding:8px;color:#666"><b>Email</b></td>
<td style="padding:8px">${email}</td>
</tr>

</table>

</div>

<div style="margin-top:20px;text-align:center">

<span style="background:#facc15;color:#000;padding:8px 14px;border-radius:20px;font-size:13px;font-weight:500">
Status: Pending Owner Approval
</span>

</div>

<p style="margin-top:25px;color:#666;font-size:13px">
The PG owner will review your request and update the status shortly.
You will be notified once it is approved or rejected.
</p>

<hr style="margin:25px 0;border:none;border-top:1px solid #eee">

<p style="font-size:12px;color:#999;text-align:center">
Powered by <b>Codex Tech Innovations & Consultants LLP</b>
</p>

</td>
</tr>

</table>

</div>
`

        )


        res.json({

            success: true,
            message: "Check-in submitted successfully",
            data: request

        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            message: "Server error"
        })

    }

}





/* =========================
GET ALL REQUESTS BY OWNER
========================= */

exports.getOwnerRequests = async (req, res) => {

    try {

        const { ownerId } = req.params

        const requests = await TenantRequest
            .find({ ownerId })
            .sort({ createdAt: -1 })

        res.json({

            success: true,
            data: requests

        })

    } catch (err) {

        res.status(500).json(err)

    }

}





/* =========================
GET SINGLE REQUEST
========================= */

exports.getRequest = async (req, res) => {

    try {

        const request = await TenantRequest.findById(req.params.id)

        if (!request) {

            return res.status(404).json({
                message: "Request not found"
            })

        }

        res.json(request)

    } catch (err) {

        res.status(500).json(err)

    }

}





/* =========================
APPROVE / REJECT REQUEST
========================= */

exports.updateStatus = async (req, res) => {

    try {

        const { status } = req.body

        const request = await TenantRequest.findByIdAndUpdate(

            req.params.id,
            { status },
            { new: true }

        )

        if (request) {

            /* notify tenant */

            await sendMail(

                request.email,

                `Tenant Request ${status}`,

                `
<h2>Your PG Request is ${status}</h2>

<p>Owner has ${status.toLowerCase()} your request.</p>
`

            )

        }

        res.json({

            success: true,
            message: "Status updated",
            data: request

        })

    } catch (err) {

        res.status(500).json(err)

    }

}





/* =========================
DELETE REQUEST
========================= */

exports.deleteRequest = async (req, res) => {

    try {

        await TenantRequest.findByIdAndDelete(req.params.id)

        res.json({

            success: true,
            message: "Request deleted"

        })

    } catch (err) {

        res.status(500).json(err)

    }

}