import './globals.css'
import { Providers } from './providers'


export const metadata = {
  title: 'AIJect',
  description: 'AIject is a platform for Project Creation Questions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
