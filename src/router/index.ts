import { Router } from 'express';
const router: Router = Router();



// All Module Routes
import SuperAdmin from './superAdmin.routes'
import Admin from './admin.routes'
import Student from './student.routes'
import Agent from './agent.routes'
import Login from './login.routes'
import University from './university.routes'
import Program from './program.routes'
import Applicant from './applicant.routes'
import Contact from './contact.routes'
import Client from './client.routes'
import Staff from './staff.routes'

//Global Setting Routes
import Status from '../globalSetting/router/status.routes'
import Country from '../globalSetting/router/country.routes'
import InTake from '../globalSetting/router/intake.routes'



// All Module API
router.use('/superadmin', SuperAdmin)
router.use('/admin', Admin)
router.use('/student', Student)
router.use('/agent', Agent)
router.use('/login', Login)
router.use('/university', University)
router.use('/program', Program)
router.use('/applicant', Applicant)
router.use('/contact', Contact)
router.use('/client', Client)
router.use('/staff', Staff)

//Global Setting API
router.use('/status',Status )
router.use('/country', Country)
router.use('/intake', InTake)



export default router