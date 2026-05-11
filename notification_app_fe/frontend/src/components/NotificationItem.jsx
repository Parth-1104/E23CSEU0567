import { Card, CardContent, Typography, Badge, Box, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FiberNewIcon from '@mui/icons-material/FiberNew';

export const NotificationItem = ({ item, isRead, onRead }) => {
  return (
    <Card 
      onClick={() => onRead(item.ID)}
      elevation={isRead ? 0 : 3} // Unread items have a shadow/depth
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        position: 'relative',
        borderRadius: 2,
        // High contrast background distinction
        backgroundColor: isRead ? 'rgba(0, 0, 0, 0.03)' : '#ffffff',
        // Thick visual accent for new items
        borderLeft: isRead ? '4px solid transparent' : '6px solid #1976d2',
        // Hover effect for better UX
        '&:hover': {
          backgroundColor: isRead ? 'rgba(0, 0, 0, 0.05)' : 'rgba(25, 118, 210, 0.02)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', py: 2 }}>
        {/* Status Icon with explicit Badge */}
        <Box sx={{ mt: 0.5 }}>
          <Badge 
            color="error" 
            variant="dot" 
            invisible={isRead}
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: '50%', 
                backgroundColor: isRead ? 'action.hover' : 'primary.light',
                display: 'flex'
              }}
            >
              <NotificationsIcon 
                fontSize="small" 
                sx={{ color: isRead ? 'text.disabled' : 'primary.main' }} 
              />
            </Box>
          </Badge>
        </Box>

        <Box sx={{ ml: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                color: isRead ? 'text.disabled' : 'primary.main',
                letterSpacing: 1
              }}
            >
              {item.Type}
            </Typography>
            
            {/* Explicit "NEW" Label for the evaluator */}
            {!isRead && (
              <Chip 
                label="New" 
                size="small" 
                color="primary" 
                icon={<FiberNewIcon />}
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900 }} 
              />
            )}
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: isRead ? 400 : 700, // Heavy font weight for unread
              color: isRead ? 'text.secondary' : 'text.primary',
              lineHeight: 1.4
            }}
          >
            {item.Message}
          </Typography>

          <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
            {new Date(item.Timestamp).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};