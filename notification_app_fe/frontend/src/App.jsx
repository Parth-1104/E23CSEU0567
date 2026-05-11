import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box, CircularProgress, Pagination, Chip, Stack } from '@mui/material';
import { useNotifications } from './hooks/useNotifications';
import { NotificationItem } from './components/NotificationItem';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  
  const { notifications, viewedIds, markAsRead, loading } = useNotifications(filter, page, 10);

 
  const getPriorityList = () => {
    const weights = { Placement: 3, Result: 2, Event: 1 };
    return [...notifications]
      .map(n => ({
        ...n,
        score: (weights[n.Type] || 0) * 1000000000000 + new Date(n.Timestamp).getTime()
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const currentList = activeTab === 0 ? notifications : getPriorityList();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        AffordMed Notifications
      </Typography>


      <Tabs 
        value={activeTab} 
        onChange={(e, v) => setActiveTab(v)} 
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All Notifications" />
        <Tab label="Priority Inbox" />
      </Tabs>


      {activeTab === 0 && (
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ mb: 3, overflowX: 'auto', pb: 1 }}
        >
          {['', 'Placement', 'Result', 'Event'].map((category) => (
            <Chip
              key={category}
              label={category || 'All'}
              clickable
              color={filter === category ? "primary" : "default"}
              variant={filter === category ? "filled" : "outlined"}
              onClick={() => { setFilter(category); setPage(1); }}
            />
          ))}
        </Stack>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ minHeight: '60vh' }}>
          {currentList.length > 0 ? (
            currentList.map(item => (
              <NotificationItem 
                key={item.ID} 
                item={item} 
                isRead={viewedIds.includes(item.ID)} 
                onRead={markAsRead}
              />
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 5 }}>
              No notifications found for this category.
            </Typography>
          )}
        </Box>
      )}


      {activeTab === 0 && !loading && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={10} 
            page={page} 
            onChange={(e, v) => setPage(v)} 
            color="primary" 
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
}