import { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Skeleton,
  Stack,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  useMediaQuery,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch, setToken } from './lib/api'
import type { AppItem, Category, Page } from './types'

const DEFAULT_SORT = 'createdAt,desc'

function App() {
  const [apps, setApps] = useState<AppItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 900px)')

  const fetchApps = async (q?: string, p: number = 1, category?: string, sortParam?: string) => {
    try {
      setLoading(true)
      const url = new URL('/api/apps', 'http://placeholder')
      if (q && q.trim().length) url.searchParams.set('q', q.trim())
      if (category && category.trim().length) url.searchParams.set('category', category.trim())
      if (sortParam) url.searchParams.set('sort', sortParam)
      url.searchParams.set('page', String(p - 1))
      url.searchParams.set('size', '12')
      const json = await apiFetch<Page<AppItem>>(url.pathname + url.search, {}, { withAuth: false })
      setApps(json.content ?? [])
      setTotalPages(json.totalPages ?? 1)
      setPage((json.number ?? 0) + 1)
    } catch {
      setError('Failed to load apps')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await apiFetch<Category[]>('/api/categories', {}, { withAuth: false })
      setCategories(data)
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    fetchApps(undefined, 1, undefined, DEFAULT_SORT)
    fetchCategories()
    apiFetch<{ email: string }>('/api/auth/me')
      .then((me) => setUserEmail(me.email))
      .catch(() => setUserEmail(null))
  }, [])

  const logout = () => {
    setToken(null)
    navigate('/login', { replace: true })
  }

  const formatCount = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return `${value}`
  }

  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategory(slug)
    setPage(1)
    fetchApps(query, 1, slug ?? undefined, sort)
    if (isMobile) setMobileOpen(false)
  }

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary' }}>
        Categories
      </Typography>
      <List sx={{ mt: 1 }}>
        <ListItemButton selected={!selectedCategory} onClick={() => handleCategorySelect(null)}>
          <ListItemText primary="All apps" />
        </ListItemButton>
        {categories.map(c => (
          <ListItemButton key={c.id} selected={selectedCategory === c.slug} onClick={() => handleCategorySelect(c.slug)}>
            <ListItemText primary={c.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton color="primary" onClick={() => setMobileOpen(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 0, fontWeight: 700, letterSpacing: 0.3 }}>
            Playstore Pulse
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, maxWidth: 520 }}>
            <TextField
              size="small"
              placeholder="Search apps, genres, or studios"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') fetchApps(query, 1, selectedCategory ?? undefined, sort) }}
              sx={{ flexGrow: 1 }}
            />
            <IconButton color="primary" onClick={() => fetchApps(query, 1, selectedCategory ?? undefined, sort)} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {userEmail && (
              <Tooltip title={userEmail}>
                <Chip label={userEmail} variant="outlined" sx={{ fontWeight: 600 }} />
              </Tooltip>
            )}
            <Avatar sx={{ bgcolor: '#1f6f8b' }}>{userEmail ? userEmail[0].toUpperCase() : 'U'}</Avatar>
            <Button variant="outlined" color="inherit" onClick={logout}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: 240,
          display: { xs: 'block', md: 'block' },
          [`& .MuiDrawer-paper`]: { width: 240, top: 64, borderRight: '1px solid rgba(0,0,0,0.06)' }
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 0, md: '240px' } }}>
        <Container sx={{ py: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Discover your next favorite app</Typography>
              <Typography color="text.secondary">Curated indie hits, polished productivity, and creative tools.</Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                label="Sort by"
                value={sort}
                onChange={(e) => {
                  const value = e.target.value
                  setSort(value)
                  fetchApps(query, 1, selectedCategory ?? undefined, value)
                }}
              >
                <MenuItem value="createdAt,desc">Newest</MenuItem>
                <MenuItem value="ratingAvg,desc">Top rated</MenuItem>
                <MenuItem value="installsCount,desc">Most installed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Grid container spacing={2} alignItems="stretch">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                    <Card variant="outlined" sx={{ height: 300, p: 2 }}>
                      <Skeleton variant="rounded" width={96} height={96} sx={{ mb: 2 }} />
                      <Skeleton width="80%" />
                      <Skeleton width="60%" />
                      <Skeleton width="95%" />
                    </Card>
                  </Grid>
                ))
              : apps.map((a) => (
                  <Grid item key={a.id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }
                      }}
                    >
                      <CardActionArea component={Link} to={`/apps/${a.id}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                        <Box sx={{ height: 120, display: 'flex', alignItems: 'center', p: 2, pb: 0, justifyContent: 'space-between' }}>
                          {a.iconUrl && (
                            <CardMedia
                              component="img"
                              image={a.iconUrl}
                              alt={a.name}
                              sx={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 3, boxShadow: 1 }}
                            />
                          )}
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary">Installs</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCount(a.installsCount)}</Typography>
                          </Box>
                        </Box>
                        <CardContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>{a.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{a.developerName}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Rating value={a.ratingAvg} precision={0.1} size="small" readOnly />
                            <Typography variant="caption" color="text.secondary">
                              {a.ratingAvg.toFixed(1)} ({formatCount(a.ratingCount)})
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {a.categories?.slice(0, 2).map((c) => (
                              <Chip key={c.id} label={c.name} size="small" />
                            ))}
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
          </Grid>
          {!loading && apps.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="h6">No results found</Typography>
              <Typography color="text.secondary">Try a different keyword or category.</Typography>
            </Box>
          )}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                color="primary"
                count={totalPages}
                page={page}
                onChange={(_, p) => fetchApps(query, p, selectedCategory ?? undefined, sort)}
                shape="rounded"
              />
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default App
