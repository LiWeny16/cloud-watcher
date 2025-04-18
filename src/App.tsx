import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Paper,
  Divider,
} from '@mui/material'
import axios from 'axios'

type Thresholds = {
  btc: { min: number; max: number }
  sgd: { min: number; max: number }
}


// axios.defaults.baseURL = 'http://localhost:9000';
axios.defaults.baseURL = 'https://cloud-watcher-cloud-watcher-xqcpjruiui.cn-hangzhou.fcapp.run';

function App() {
  const [alertActive, setAlertActive] = useState(false)
  const [thresholds, setThresholds] = useState<Thresholds>({
    btc: { min: 0, max: 100_000 },
    sgd: { min: 0, max: 100_000 },
  })

  const save = () => {
    console.log(thresholds);
    axios.post('/api/settings', thresholds).then(() => alert('✅ 已保存设置'))
  }

  const toggleAlarm = () => {
    axios.post('/api/status', { alertActive: !alertActive }).then(() => {
      setAlertActive(!alertActive)
    })
  }
  // 获取初始状态
  useEffect(() => {

    axios.get('/api/settings').then((res) => setThresholds(res.data))
    axios.get('/api/status').then((res) => setAlertActive(res.data.alertActive))
    const interval = setInterval(() => {
      axios.get('/api/status').then((res) => setAlertActive(res.data.alertActive))
    }, 10000)
    return () => clearInterval(interval)
  }, [])




  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f0f2f5',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🛡 Cloud Watcher
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            实时阈值监控配置面板
          </Typography>

          {['btc', 'sgd'].map((key) => (
            <Box key={key} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {key.toUpperCase()} 设置
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="最低值"
                  type="number"
                  value={thresholds[key as keyof Thresholds].min}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      [key]: {
                        ...thresholds[key as keyof Thresholds],
                        min: parseFloat(e.target.value),
                      },
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {key === 'btc' ? 'USD' : 'CNY'}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="最高值"
                  type="number"
                  value={thresholds[key as keyof Thresholds].max}
                  onChange={(e) =>
                    setThresholds({
                      ...thresholds,
                      [key]: {
                        ...thresholds[key as keyof Thresholds],
                        max: parseFloat(e.target.value),
                      },
                    })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {key === 'btc' ? 'USD' : 'CNY'}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          ))}

          <Box textAlign="center" mt={2}>
            <Button variant="contained" onClick={save}>
              保存设置
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box textAlign="center">
            <Typography variant="subtitle1" gutterBottom>
              当前警戒状态：{alertActive ? '🟢 已激活' : '⚪️ 未激活'}
            </Typography>
            <Button
              variant="outlined"
              color={alertActive ? 'error' : 'primary'}
              onClick={toggleAlarm}
            >
              {alertActive ? '关闭警报监控' : '开启警报监控'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default App
