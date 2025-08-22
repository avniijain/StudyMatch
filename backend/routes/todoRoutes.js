import express from 'express'
import protect from '../middleware/authMiddleware.js'
import todoController from '../controllers/todoController.js'

const router = express.Router();

router.patch('/toggle/:id',protect, todoController.toggleComplete);
router.get('/display',protect, todoController.getTasks);
router.post('/add',protect, todoController.addTask);
router.put('/update/:id',protect, todoController.updateTask);
router.delete('/delete/:id',protect, todoController.deleteTask);

export default router