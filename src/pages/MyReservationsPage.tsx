import { useEffect, useState, useCallback } from 'react'
import {
  Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Fade
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import { useSnackbar } from 'notistack'

export default function MyReservationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'))

  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({
    firstname: '', surname: '', checkinDate: '', checkoutDate: '', userId: '', roomNum: '', roomId: ''
  })

  const fetchReservations = useCallback(async (id: string) => {
    if (!id) return
    try {
      const res = await api.get(`/api/v1/reservations/user/${id}`, { headers: { 'X-Trace-Id': 'browser-client' } })
      setItems(res.data || [])
    } catch {
      enqueueSnackbar('Failed to load reservations', { variant: 'error' })
    }
  }, [enqueueSnackbar])

  const fetchUserIfNeeded = useCallback(async () => {
    try {
      let storedId:any = localStorage.getItem('userId')
      if (!storedId) {
        const res = await api.get('/api/v1/user', { headers: { 'X-Trace-Id': 'browser-client' } })
        if (res?.data?.id) {
          storedId = res.data.id
          localStorage.setItem('userId', storedId)
        }
      }
      if (storedId) {
        setUserId(storedId)
        fetchReservations(storedId)
      }
    } catch {
      enqueueSnackbar('Failed to fetch user info', { variant: 'error' })
    }
  }, [enqueueSnackbar, fetchReservations])

  useEffect(() => { fetchUserIfNeeded() }, [fetchUserIfNeeded])

  const cancelReservation = async (id: string) => {
    try {
      await api.post(`/api/v1/reservations/${id}/cancel`)
      enqueueSnackbar('Reservation cancelled', { variant: 'success' })
      if (userId) fetchReservations(userId)
    } catch {
      enqueueSnackbar('Failed to cancel reservation', { variant: 'error' })
    }
  }

  const handleEditClick = (item: any) => {
    setEditItem(item)
    setEditForm({
      firstname: item.firstname || '',
      surname: item.surname || '',
      userId: userId || '',
      roomId: item.roomId || '',
      roomNum: item.roomNumber || '',
      checkinDate: item.checkinDate || '',
      checkoutDate: item.checkoutDate || ''
    })
    setEditOpen(true)
  }

  const handleEditSave = async () => {
    if (!editItem) return
    try {
      await api.put(`/api/v1/reservations/${editItem.id}`, editForm)
      enqueueSnackbar('Reservation updated', { variant: 'success' })
      setEditOpen(false)
      if (userId) fetchReservations(userId)
    } catch {
      enqueueSnackbar('Failed to update reservation', { variant: 'error' })
    }
  }

  const filtered = items.filter(i =>
    (i.firstname + ' ' + i.surname + ' ' + i.roomNumber).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper className="glass" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          My Reservations
        </Typography>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search reservations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1, input: { color: '#e6eef8' } }}
          />
          <Button
            variant="contained"
            onClick={() => userId && fetchReservations(userId)}
            className="btn-animated"
          >
            Refresh
          </Button>
        </div>
      </Paper>

      <AnimatePresence>
        {filtered.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Accordion className="glass" sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#e6eef8' }} />}>
                <Typography sx={{ fontWeight: 500 }}>
                  {item.firstname} {item.surname} — Room {item.roomNumber} ({item.status})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Check-in: {item.checkinDate}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                  Check-out: {item.checkoutDate}
                </Typography>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="outlined" onClick={() => handleEditClick(item)} className="btn-animated">
                    Edit
                  </Button>
                  <Button variant="contained" color="error" onClick={() => cancelReservation(item.id)} className="btn-animated">
                    Cancel
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </AnimatePresence>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          className: 'glass',
          sx: { borderRadius: 3, p: 1, background: 'rgba(20,20,35,0.8)' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Reservation</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, minWidth: 360, mt: 1 }}>
          <TextField label="First Name" value={editForm.firstname}
            onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })} />
          <TextField label="Surname" value={editForm.surname}
            onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })} />
          <TextField label="Check-in Date" type="date" InputLabelProps={{ shrink: true }}
            value={editForm.checkinDate}
            onChange={(e) => setEditForm({ ...editForm, checkinDate: e.target.value })} />
          <TextField label="Check-out Date" type="date" InputLabelProps={{ shrink: true }}
            value={editForm.checkoutDate}
            onChange={(e) => setEditForm({ ...editForm, checkoutDate: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} className="btn-animated">Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} className="btn-animated">Save</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  )
}
