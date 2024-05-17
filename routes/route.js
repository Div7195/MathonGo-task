import express from 'express';
import multer from 'multer';
import { createList, addUsers } from '../controllers/list-controllers.js';
import { sendEmail } from '../controllers/email-controllers.js';
import fs from 'fs';
import { upload } from '../middleware/upload.js';

const router = express.Router();


router.post('/lists', createList);
router.post('/lists/:listId/users', upload, addUsers);
router.post('/lists/:listId/send-email', sendEmail);
export default router;