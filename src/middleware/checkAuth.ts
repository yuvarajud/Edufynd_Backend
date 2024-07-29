import * as auth from 'basic-auth';
import { clientError } from '../helper/ErrorMessage';
import * as jwt from 'jsonwebtoken';
import { SuperAdmin } from "../model/superAdmin.model";
import { Admin } from "../model/admin.model";
import { Student } from "../model/student.model";
import { Agent } from "../model/agent.model";
import { Staff } from '../model/staff.model'

/**
 * @author Balan K K
 * @date  01-05-2024
 * @description Authentication Methods
 */


export let basicAuthUser = function (req, res, next) {
    console.log("basicauth verifying...")
   
    var credentials = auth(req);
    console.log('credential',credentials);
    if (!credentials || credentials.name != process.env.basicAuthUser || credentials.pass != process.env.basicAuthKey) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"')
        return res.status(401).json({
            success: false,
            statusCode: 499,
            message: clientError.token.unauthRoute,
        });
    } else {
        next();
    }
}



// export let basicAuthUser = function (req, res, next) {
//     console.log("basicauth verify")
   
//     var credentials = auth(req);
//     console.log('credentials',credentials);
// if (credentials.name === process.env.basicAuthUser &&  credentials.pass === process.env.basicAuthKey) {
//     const tokenData = { name: credentials.name }; // Add any other data needed in the token
//     const token = jwt.sign(tokenData, 'edufynd', { expiresIn: '24h' });

//     // Replace the Basic header with Bearer token
//     req.headers['authorization'] = `Bearer ${token}`;
//     next();
// } else {
//     return res.status(401).json({
//         success: false,
//         statusCode: 499,
//         message: 'Invalid credentials',
//     });
// }
// }



// export let basicAuthUser = (req, res, next) => {
//     // const authHeader = req.headers['authorization'];
//     var authHeader = auth(req);
//     console.log("pp",authHeader )
//     if (authHeader && authHeader.startsWith('Basic ')) {
//         const base64Credentials = authHeader.split(' ')[1];
//         const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//         const [name, pass] = credentials.split(':');

//         // Validate credentials (this should be replaced with your own validation logic)
//         if (name === process.env.basicAuthUser && pass === process.env.basicAuthKey) {
//             const tokenData = { name: name }; // Add any other data needed in the token
//             const token = jwt.sign(tokenData, 'edufynd', { expiresIn: '24h' });

//             // Replace the Basic header with Bearer token
//             req.headers['authorization'] = `Bearer ${token}`;
//         } else {
//             return res.status(401).json({
//                 success: false,
//                 statusCode: 499,
//                 message: 'Invalid credentials',
//             });
//         }
//     }
//     next();
// };


// export const validateSuperAdminId = async (req, res, next) => {
//     try {
//         const superadminId = req.body._id || req.query._id || req.headers['superAdmin-id'];

//         // Check if agent ID is provided
//         if (!superadminId) {
//             return res.status(400).json({ success: false, message: 'Super Admin ID is required' });
//         }

//         // Validate agent ID
//         const superadmin = await SuperAdmin.findById(superadminId);
//         if (!superadmin) {
//             return res.status(404).json({ message: 'Super Admin not found' });
//         }

//         // Attach agent to request object
//         req.superadmin = superadmin;
   
//         next();
//     } catch (error) {
//         res.status(500).json({ message: 'Error validating agent ID', error });
//     }
// };



export const validateUser = async (req, res, next) => {
    try {
        const userId = req.body._id || req.query._id || req.headers['_id'];
        const loginType = req.body.loginType || req.query.loginType || req.headers['logintype'];

        let user = null;

        if (userId && loginType) {
            if (loginType === 'superadmin') {
                user = await SuperAdmin.findById(userId);
            } else if (loginType === 'admin') {
                user = await Admin.findById(userId);
            } else if (loginType === 'student') {
                user = await Student.findById(userId);
            } else if (loginType === 'agent') {
                user = await Agent.findById(userId);
            } else if (loginType === 'staff') {
                user = await Staff.findById(userId);
            }
        } else {
            return res.status(400).json({ success: false, message: 'User ID and login type are required' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Attach user to request object
        req.currentUser = user;

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating user', error });
    }
};
export const validateAgentId = async (req, res, next) => {
    try {
        const agentId = req.body._id || req.query._id || req.headers['agent-id'];

        // Check if agent ID is provided
        if (!agentId) {
            return res.status(400).json({ success: false, message: 'Agent ID is required' });
        }

        // Validate agent ID
        const agent = await Agent.findById(agentId);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Attach agent to request object
        req.agent = agent;
   
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating agent ID', error });
    }
};



