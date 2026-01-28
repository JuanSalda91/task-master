# Task Master Backend API

## Purpose
Backend REST API for TaskMaster, handling users, projects, and tasks.

## Main Resources
- Users: register, login
- Projects: CRUD, owned by user
- Tasks: CRUD, belong to a project

## Example Router
- POST /api/users/register
- POST /api/users/login

- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- DELETE /api/projects/:id

- POST /api/projects/:projectsId/tasks
- GET /api/projects/:projectsId/tasks
- PUT /api/tasks/:tasksId
- DELETE /api/tasks/:tasksId