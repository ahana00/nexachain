const router = require('express').Router();
const auth = require('../middleware/auth');
const a = require('../controllers/authController');
const i = require('../controllers/investmentController');
const d = require('../controllers/dashboardController');
const r = require('../controllers/referralController');

router.post('/auth/register', a.register);
router.post('/auth/login', a.login);
router.get('/auth/me', auth, a.me);

router.post('/investments', auth, i.create);
router.get('/investments', auth, i.list);

router.get('/dashboard', auth, d.summary);
router.get('/dashboard/roi', auth, d.roiHistory);

router.get('/referrals/direct', auth, r.direct);
router.get('/referrals/tree', auth, r.tree);
router.get('/referrals/income', auth, r.income);

module.exports = router;
