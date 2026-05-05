import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Rating,
  TextField,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from '@mui/material'
import { apiFetch } from '../lib/api'
import type { AppItem, Review } from '../types'

export default function AppDetails() {
  const { id } = useParams()
  const [app, setApp] = useState<AppItem | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [rating, setRating] = useState<number | null>(4)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const fetchApp = async () => {
      setLoading(true)
      try {
        const [appData, reviewData] = await Promise.all([
          apiFetch<AppItem>(`/api/apps/${id}`, {}, { withAuth: false }),
          apiFetch<Review[]>(`/api/apps/${id}/reviews`, {}, { withAuth: false }),
        ])
        setApp(appData)
        setReviews(reviewData)
      } finally {
        setLoading(false)
      }
    }
    fetchApp()
  }, [id])

  const install = async () => {
    setInstalling(true)
    await apiFetch<void>(`/api/apps/${id}/install`, { method: 'POST' })
    setApp((prev) => prev ? { ...prev, installsCount: prev.installsCount + 1 } : prev)
    setInstalling(false)
  }

  const submitReview = async () => {
    if (!rating) return
    await apiFetch<Review>(`/api/apps/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    })
    const [appData, reviewData] = await Promise.all([
      apiFetch<AppItem>(`/api/apps/${id}`, {}, { withAuth: false }),
      apiFetch<Review[]>(`/api/apps/${id}/reviews`, {}, { withAuth: false }),
    ])
    setApp(appData)
    setReviews(reviewData)
    setComment('')
  }

  const permissions = useMemo(() => {
    const seed = Number(id ?? 1)
    const all = ['Camera', 'Location', 'Notifications', 'Media', 'Calendar', 'Microphone']
    return all.filter((_, idx) => (seed + idx) % 2 === 0).slice(0, 4)
  }, [id])

  const formatCount = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return `${value}`
  }

  if (!app && loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={28} />
          <Typography>Loading app...</Typography>
        </Stack>
      </Container>
    )
  }

  if (!app) return <Container sx={{ py: 6 }}><Typography>App not found.</Typography></Container>

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 3 }}>
        {app.iconUrl && <img src={app.iconUrl} alt={app.name} width={110} height={110} style={{ borderRadius: 16, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }} />}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{app.name}</Typography>
          <Typography color="text.secondary">{app.developerName}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Rating value={app.ratingAvg} precision={0.1} readOnly />
            <Typography color="text.secondary">{app.ratingAvg.toFixed(1)} ({formatCount(app.ratingCount)})</Typography>
            <Divider orientation="vertical" flexItem />
            <Typography color="text.secondary">{formatCount(app.installsCount)} installs</Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {app.categories?.map((c) => <Chip key={c.id} label={c.name} size="small" />)}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
          <Button variant="contained" onClick={install} disabled={installing}>
            {installing ? 'Installing...' : 'Install'}
          </Button>
          <Button variant="outlined" component={Link} to="/">Back</Button>
        </Stack>
      </Stack>

      <Stack spacing={3}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Screenshots</Typography>
            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
              {app.screenshots?.map((shot, idx) => (
                <CardMedia
                  key={idx}
                  component="img"
                  image={shot}
                  alt={`${app.name} screenshot ${idx + 1}`}
                  sx={{ width: 260, height: 146, borderRadius: 2, flex: '0 0 auto' }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>About this app</Typography>
            <Typography sx={{ mb: 2 }}>{app.description}</Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Permissions</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {permissions.map((p) => <Chip key={p} label={p} size="small" variant="outlined" />)}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Write a review</Typography>
            <Stack spacing={2}>
              <Rating value={rating} onChange={(_, value) => setRating(value)} />
              <TextField
                label="Share your thoughts"
                multiline
                minRows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button variant="contained" onClick={submitReview} disabled={!rating}>Submit review</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Community reviews</Typography>
            <Stack spacing={2}>
              {reviews.length === 0 && <Typography color="text.secondary">No reviews yet. Be the first!</Typography>}
              {reviews.map((r) => (
                <Box key={r.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 600 }}>{r.authorEmail}</Typography>
                    <Rating value={r.rating} size="small" readOnly />
                  </Stack>
                  {r.comment && <Typography color="text.secondary">{r.comment}</Typography>}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
