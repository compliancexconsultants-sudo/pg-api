const express = require("express")
const router = express.Router()

const multer = require("multer")

const controller = require("../controllers/tenantRequest")

const upload = multer({dest:"uploads/"})



router.post(

"/self-checkin",

upload.fields([
{name:"aadhaarPhoto",maxCount:1},
{name:"passportPhoto",maxCount:1}
]),

controller.createTenantRequest

)

router.get("/pg/:pg_id",controller.getPGName);

router.get(
"/owner-requests/:ownerId",
controller.getOwnerRequests
)



router.get(
"/request/:id",
controller.getRequest
)



router.put(
"/request/:id",
controller.updateStatus
)



router.delete(
"/request/:id",
controller.deleteRequest
)



module.exports = router