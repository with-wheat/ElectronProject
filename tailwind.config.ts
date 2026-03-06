import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 100%, 50%)',
        'primary-foreground': 'hsl(0, 0%, 100%)',
        secondary: 'hsl(210, 100%, 98%)',
        'secondary-foreground': 'hsl(210, 100%, 10%)',
        card: 'hsl(0, 0%, 100%)',
        'card-foreground': 'hsl(210, 100%, 10%)',
        background: 'hsl(0, 0%, 98%)',
        foreground: 'hsl(210, 100%, 10%)',
        muted: 'hsl(0, 0%, 96%)',
        'muted-foreground': 'hsl(210, 100%, 40%)',
        border: 'hsl(210, 100%, 80%)',
        input: 'hsl(210, 100%, 96%)',
        ring: 'hsl(210, 100%, 50%)',
        destructive: 'hsl(0, 100%, 50%)',
        'destructive-foreground': 'hsl(0, 0%, 100%)',
        success: 'hsl(142, 76%, 36%)',
        warning: 'hsl(45, 100%, 51%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config