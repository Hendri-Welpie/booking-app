import { Card, CardContent, Typography, CardActions, Button, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'

interface RoomCardProps {
  room: any
  onReserve: () => void
  disabled?: boolean
}

export default function RoomCard({ room, onReserve, disabled = false }: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className="room-card"
    >
      <Card className="glass" sx={{ p: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Room {room.roomNumber}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Type: {room.type}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          {disabled ? (
            <Tooltip title="Login to reserve">
              <span>
                <Button variant="contained" className="btn-animated" disabled fullWidth>
                  Reserve
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button variant="contained" onClick={onReserve} className="btn-animated" fullWidth>
              Reserve
            </Button>
          )}
        </CardActions>
      </Card>
    </motion.div>
  )
}
