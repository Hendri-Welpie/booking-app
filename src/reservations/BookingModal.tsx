import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Fade,
  Backdrop,
  Box,
  Typography,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import api from '../api/client'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'

const schema = yup.object({
  firstname: yup.string().required('First name required'),
  surname: yup.string().required('Surname required'),
  checkinDate: yup
    .string()
    .required('Check-in date required')
    .test('valid', 'Check-in must be before checkout', function (value) {
      const { checkoutDate } = this.parent
      if (!value || !checkoutDate) return true
      return (
        dayjs(checkoutDate).isAfter(dayjs(value)) ||
        dayjs(checkoutDate).isSame(dayjs(value))
      )
    }),
  checkoutDate: yup.string().required('Checkout date required'),
})

export default function BookingModal({ open, onClose, room, checkin, checkout, onBooked }: any) {
  const { enqueueSnackbar } = useSnackbar()
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstname: '',
      surname: '',
      checkinDate: checkin,
      checkoutDate: checkout,
    },
  })

  const [loadingUser, setLoadingUser] = React.useState(false)
  const [userId, setUserId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserInfo = async () => {
      setLoadingUser(true)
      try {
        const res = await api.get('/api/v1/user', {
          headers: { 'X-Trace-Id': 'browser-client' },
        })
        const user = res.data
        if (user) {
          setUserId(user.id)
          reset({
            firstname: user.firstName || '',
            surname: user.lastName || '',
            checkinDate: checkin,
            checkoutDate: checkout,
          })
        }
      } catch {
        enqueueSnackbar('Failed to fetch user info', { variant: 'error' })
      } finally {
        setLoadingUser(false)
      }
    }
    if (open) fetchUserInfo()
  }, [open, checkin, checkout, reset, enqueueSnackbar])

  const onSubmit = async (data: any) => {
    if (!room) return
    try {
      await api.post(
        '/api/v1/reservations',
        {
          userId: userId || localStorage.getItem('userId') || 'anonymous',
          roomId: room.id,
          firstname: data.firstname,
          surname: data.surname,
          roomNum: room.roomNumber,
          checkinDate: data.checkinDate,
          checkoutDate: data.checkoutDate,
        },
        { headers: { 'X-Trace-Id': 'browser-client' } }
      )
      enqueueSnackbar('Reservation created successfully', { variant: 'success' })
      onBooked && onBooked()
      onClose()
    } catch (e: any) {
      enqueueSnackbar(e?.message || 'Failed to create reservation', { variant: 'error' })
    }
  }

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 1000,
        backdropFilter: 'blur(12px) saturate(140%)',
        backgroundColor: 'rgba(0,0,0,0.65)',
      }}
    >
      <Fade in={open}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            className="glass"
            sx={{
              p: 4,
              minWidth: 380,
              borderRadius: '24px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              color: '#e6eef8',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Reserve Room {room?.roomNumber}
            </Typography>

            {loadingUser ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 180 }}>
                <CircularProgress />
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>
                {['firstname', 'surname', 'checkinDate', 'checkoutDate'].map((name) => (
                  <Controller
                    key={name}
                    name={name as keyof any}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={
                          name === 'checkinDate'
                            ? 'Check-in'
                            : name === 'checkoutDate'
                            ? 'Check-out'
                            : name === 'firstname'
                            ? 'First Name'
                            : 'Surname'
                        }
                        type={
                          name === 'checkinDate' || name === 'checkoutDate'
                            ? 'date'
                            : 'text'
                        }
                        InputLabelProps={{
                          shrink: true,
                          style: { color: '#94a3b8' },
                        }}
                        error={!!errors[name as keyof typeof errors]}
                        helperText={errors[name as keyof typeof errors]?.message as string}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          sx: {
                            borderRadius: '12px',
                            bgcolor: 'rgba(255,255,255,0.06)',
                            color: '#e6eef8',
                          },
                        }}
                      />
                    )}
                  />
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: '#e6eef8',
                      borderRadius: '12px',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.6)',
                        background: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isValid || isSubmitting || loadingUser}
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      'Book'
                    )}
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </motion.div>
      </Fade>
    </Backdrop>
  )
}
