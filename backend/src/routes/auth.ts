import { Router } from 'express';
import { register, login, getMe, getUsers, updateRole } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, authorize('admin'), getUsers);
router.patch('/users/:id/role', authenticate, authorize('admin'), updateRole);

export default router;
