import { Router } from 'express';
import { getAllNotification, getSingleNotification, createNotification, updateNotification, deleteNotification, getFilteredNotification } from './notification.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';


const router: Router = Router();

router.get('/',                
    basicAuthUser,
    getAllNotification
);

router.get('/getSingleNotification',
    basicAuthUser,
     checkQuery('_id'),
    getSingleNotification,
);



router.post('/',
    basicAuthUser,
    createNotification
);



router.put('/',                   
    basicAuthUser,
    // checkQuery('_id'),
    // checkRequestBodyParams('_id'),
    updateNotification
);


router.delete('/',                  
    basicAuthUser,
    checkQuery('_id'),
    deleteNotification
);

router.put('/getFilterNotification',
    basicAuthUser,
    getFilteredNotification,
);

export default router