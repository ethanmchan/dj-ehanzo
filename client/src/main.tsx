import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MashupSuggestionSite from './MashupSuggestionSite'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <MashupSuggestionSite />
  </StrictMode>,
)
