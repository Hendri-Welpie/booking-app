import {
  Paper,
  Typography,
  TextField,
  Button,
  Backdrop,
  Fade,
  Box
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useSnackbar } from 'notistack'
import { motion } from 'framer-motion'

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  password: yup.string().min(6).required(),
})

export default function RegisterPage() {
  const { control, handleSubmit, formState: { isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  })

  const nav = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const fieldNames = ['username', 'email', 'firstName', 'lastName', 'password'] as const;
  const fieldLabels: Record<(typeof fieldNames)[number], string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    password: 'Password',
    username: 'Username',
    email: 'Email'
  };


  const onSubmit = async (data: any) => {
    try {
      await api.post('/api/v1/auth/register', data)
      enqueueSnackbar('Registration successful', { variant: 'success' })
      nav('/login')
    } catch {
      enqueueSnackbar('Registration failed', { variant: 'error' })
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
              maxWidth: 460,
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
              Create an Account
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>
              {fieldNames.map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={fieldLabels[fieldName]
                      }
                      type={fieldName === 'password' ? 'password' : 'text'}
                      fullWidth
                      variant="outlined"
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
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isValid}
                  sx={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #34d399, #10b981)',
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Fade>
    </Backdrop>
  )
}
