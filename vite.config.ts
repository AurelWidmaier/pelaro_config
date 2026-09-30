import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Bildordner gehören nicht zur App. Unter Windows sind Dateien beim
      // Hineinkopieren kurz gesperrt (EBUSY), was den Dev-Server sonst abstürzen lässt.
      ignored: ['**/_incoming/**', '**/cdn/**', '**/dist/**'],
    },
  },
})
