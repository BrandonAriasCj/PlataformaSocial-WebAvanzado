import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/signIn', (req, res) => {
  res.render('signIn', { title: 'Iniciar Sesión' });
});

router.get('/signUp', (req, res) => {
  res.render('signUp', { title: 'Registrarse' });
});

// Protected routes
router.get('/dashboard', verifyToken, (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard',
    user: req.user,
    userRoles: req.userRoles
  });
});

router.get('/profile', verifyToken, (req, res) => {
  res.render('profile', { 
    title: 'Mi Perfil',
    user: req.user,
    userRoles: req.userRoles
  });
});

router.get('/admin', verifyToken, requireAdmin, (req, res) => {
  res.render('admin', { 
    title: 'Panel de Administración',
    user: req.user,
    userRoles: req.userRoles
  });
});

// Logout route
router.get('/logout', (req, res) => {
  res.render('signIn', { 
    title: 'Iniciar Sesión',
    message: 'Sesión cerrada exitosamente'
  });
});

// Error pages
router.get('/403', (req, res) => {
  res.render('403', { 
    title: 'Acceso Denegado',
    message: req.query.message || 'No tienes permisos suficientes para acceder a esta página.'
  });
});

router.get('/404', (req, res) => {
  res.render('404', { 
    title: 'Página No Encontrada'
  });
});

// Redirect root to appropriate dashboard
router.get('/', (req, res) => {
  res.redirect('/signIn');
});

export default router;
