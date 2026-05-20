import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, authorize('admin'), getUsers);

export default router;
