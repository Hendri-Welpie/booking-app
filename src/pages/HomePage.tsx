import { useEffect, useState } from 'react'
import { Paper, Typography, TextField, Button, CircularProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import RoomCard from '../rooms/RoomCard'
import api from '../api/client'
import BookingModal from '../reservations/BookingModal'
import dayjs from 'dayjs'
import { useAuth } from '../auth/AuthContext'

export default function HomePage() {
  const [checkin, setCheckin] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [checkout, setCheckout] = useState<string>(dayjs().add(1, 'day').format('YYYY-MM-DD'))
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get(
        `/api/v1/reservations/available-rooms?checkin=${checkin}&checkout=${checkout}`,
        { headers: { 'X-Trace-Id': 'browser-client' } }
      )
      setRooms(res.data || [])
    } catch {
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Paper className="glass" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Find Available Rooms
        </Typography>

        <motion.div
          className="filters"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <TextField
            label="Check-in"
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="Check-out"
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <Button
            className="btn-animated"
            variant="contained"
            onClick={fetch}
            disabled={!checkin || !checkout || dayjs(checkout).isBefore(dayjs(checkin))}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Search'}
          </Button>
          <Typography variant="caption" sx={{ opacity: 0.8, marginLeft: 'auto' }}>
            Tip: Checkout must be after check-in
          </Typography>
        </motion.div>
      </Paper>

      <AnimatePresence>
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {rooms.length > 0 &&
            rooms.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{ width: '100%', maxWidth: '700px' }}
              >
                <RoomCard
                  room={r}
                  onReserve={() => {
                    setSelectedRoom(r)
                    setOpen(true)
                  }}
                  disabled={!user}
                />
              </motion.div>
            ))}

          {!loading && rooms.length === 0 && (
            <motion.div
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', marginTop: '60px' }}
            >
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                No rooms found for the selected dates.
              </Typography>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <BookingModal
        open={open}
        room={selectedRoom}
        onClose={() => setOpen(false)}
        checkin={checkin}
        checkout={checkout}
        onBooked={() => {
          setOpen(false)
          fetch()
        }}
      />
    </motion.div>
  )
}
