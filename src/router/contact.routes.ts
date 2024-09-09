import {Router} from 'express';
import { createContact} from '../controller/contact.controller';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/', createContact);

export default router;