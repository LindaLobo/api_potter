const {Router} = require("express")
const router = Router()
const {createWizar, loginWizar} = require("../controllers/user.controller")
const {autorizar} = require("../middleware/auth")

router.post("/sign_up", createWizar)
router.post("/login", loginWizar)

module.exports = router