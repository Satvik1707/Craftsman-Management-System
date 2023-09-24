const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initializeDatabase = require('./config/initializeDatabase');

const { authenticateToken } = require('./config/authMiddleware');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const routesController = require('./controllers/routesController');
const tasksController = require('./controllers/tasksController');
const issuesController = require('./controllers/issuesController');
const materialsController = require('./controllers/materialsController');
const toolsController = require('./controllers/toolsController');

const PORT = process.env.PORT || 9000;

const initDatabase = async () => {
  await initializeDatabase();
};
initDatabase();

const app = express();
// Configure CORS to allow requests from localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000'
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//auth
app.post('/api/login', authController.login);

//settings
app.get('/api/settings', authenticateToken, userController.getSettings);
app.put('/api/settings', authenticateToken, userController.updateSettings);

//user
app.get('/api/user', authenticateToken, userController.getUser);
app.get('/api/users', authenticateToken, userController.getUsers);
app.get('/api/users/:userID', authenticateToken, userController.getUsers);
app.post('/api/user', authenticateToken, userController.createUser);
app.put('/api/user', authenticateToken, userController.updateUser);
app.delete('/api/user', authenticateToken, userController.deleteUser);

//routes
app.get('/api/routes', authenticateToken, routesController.getRoutes);
app.post('/api/routes', authenticateToken, routesController.createRoute);
app.put(
  '/api/routes/:routeId',
  authenticateToken,
  routesController.updateRoute
);

app.get('/api/routes/:routeId',authenticateToken,routesController.fetchTasksForRoutes)

app.delete(
  '/api/routes/:routeId',
  authenticateToken,
  routesController.deleteRoute
);

//tasks
app.get('/api/tasks/:routeId', authenticateToken, tasksController.getTasks);
app.get(
  '/api/tasks/:routeID/:taskID',
  authenticateToken,
  tasksController.getTask
);
app.post('/api/tasks/:routeId', authenticateToken, tasksController.createTask);
app.put('/api/tasks/:taskID', authenticateToken, tasksController.updateTask);
app.delete(
  '/api/tasks/:routeId/:taskId',
  authenticateToken,
  tasksController.deleteTask
);

//Task issues
app.get(
  '/api/tasks/:routeID/:taskID/issues',
  authenticateToken,
  issuesController.getTaskIssues
);
app.post(
  '/api/tasks/:routeID/:taskID/addIssues',
  authenticateToken,
  issuesController.addTaskIssues
);
app.post(
  '/api/tasks/:routeID/:taskID/removeIssue',
  authenticateToken,
  issuesController.deleteTaskIssue
);

//Task materials
app.get(
  '/api/tasks/:routeID/:taskID/materials',
  authenticateToken,
  materialsController.getTaskMaterials
);
app.post(
  '/api/tasks/:routeID/:taskID/addMaterials',
  authenticateToken,
  materialsController.addTaskMaterials
);
app.post(
  '/api/tasks/:routeID/:taskID/removeMaterial',
  authenticateToken,
  materialsController.deleteTaskMaterial
);

//Task tools
app.get(
  '/api/tasks/:routeID/:taskID/tools',
  authenticateToken,
  toolsController.getTaskTools
);
app.post(
  '/api/tasks/:routeID/:taskID/addTools',
  authenticateToken,
  toolsController.addTaskTools
);
app.post(
  '/api/tasks/:routeID/:taskID/removeTool',
  authenticateToken,
  toolsController.deleteTaskTool
);

//issues
app.get('/api/issues', authenticateToken, issuesController.getIssues);
app.put('/api/issues', authenticateToken, issuesController.updateIssues);
app.post('/api/issues/add', authenticateToken, issuesController.addIssues);
app.post('/api/issues', authenticateToken, issuesController.deleteIssues);

//materials
app.get('/api/materials', authenticateToken, materialsController.getMaterials);
app.post(
  '/api/materials',
  authenticateToken,
  materialsController.deleteMaterials
);
app.post(
  '/api/materials/add',
  authenticateToken,
  materialsController.addMaterials
);
app.put(
  '/api/materials',
  authenticateToken,
  materialsController.updateMaterials
);

//tools
app.put('/api/tools', authenticateToken, toolsController.updateTools);
app.get('/api/tools', authenticateToken, toolsController.getTools);
app.post('/api/tools/add', authenticateToken, toolsController.addTools);
app.post('/api/tools', authenticateToken, toolsController.deleteTools);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
