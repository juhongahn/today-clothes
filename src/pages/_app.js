import '@/styles/globals.css'
import Container from '@mui/material/Container';

export default function App({ Component, pageProps }) {
  return (
    <Container fixed maxWidth="xs">
      <Component {...pageProps} />
    </Container>
  )
}
