import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyReservationsPage from './pages/MyReservationsPage'
import { AuthProvider, useAuth } from './auth/AuthContext'

function Nav() {
  const { user, logout } = useAuth()

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          mb: 3,
          background: 'transparent',
          borderRadius: 3,
        }}
      >
        <Toolbar
          className="glass"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            backdropFilter: 'blur(10px)',
            borderRadius: '18px',
            px: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              color: '#e6eef8',
              textShadow: '0 0 6px rgba(255,255,255,0.2)',
            }}
          >
            Booking App
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/" className="nav-btn">
              Home
            </Button>
            {user ? (
              <>
                <Button
                  component={Link}
                  to="/my-reservations"
                  className="nav-btn"
                >
                  My Reservations
                </Button>
                <Button onClick={logout} className="nav-btn logout">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" className="nav-btn">
                  Login
                </Button>
                <Button component={Link} to="/register" className="nav-btn">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <Container className="container">
        <AnimatedRoutes />
      </Container>
    </AuthProvider>
  )
}
