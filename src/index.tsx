import {createRoot} from 'react-dom/client'
import { App } from '@src/app/App'
import './index.css'

const rootElem = document.getElementById('root')!
const root = createRoot(rootElem)
root.render(<App/>)