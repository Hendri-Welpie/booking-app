import { Paper, Typography, TextField, Button, Box, Fade, Backdrop } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useSnackbar } from 'notistack'
import { motion } from 'framer-motion'

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
})

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({ resolver: yupResolver(schema), mode: 'onChange' })
  const { login } = useAuth()
  const nav = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async (data: any) => {
    try {
      const res = await login(data.username, data.password)
      if (res.success) {
        enqueueSnackbar('Login successful', { variant: 'success' })
        nav('/')
      } else {
        enqueueSnackbar('Invalid username or password', { variant: 'error' })
      }
    } catch {
      enqueueSnackbar('Login failed', { variant: 'error' })
    }
  }

  return (
    <Backdrop
      open
      sx={{
        zIndex: 10,
        backdropFilter: 'blur(10px) saturate(120%)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <Fade in>
        <motion.div
               initial={{ opacity: 0, y: -30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Paper
            className="glass"
            sx={{
              p: 4,
              maxWidth: 420,
              width: '90%',
              mx: 'auto',
              borderRadius: '24px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
              color: '#e6eef8',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 700,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              Welcome Back
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Username"
                    variant="outlined"
                    {...field}
                    fullWidth
                    InputProps={{
                      sx: {
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#e6eef8',
                      },
                    }}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    {...field}
                    fullWidth
                    InputProps={{
                      sx: {
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#e6eef8',
                      },
                    }}
                    InputLabelProps={{ style: { color: '#94a3b8' } }}
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => nav('/register')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#e6eef8',
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  Register
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isValid}
                  sx={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Fade>
    </Backdrop>
  )
}
