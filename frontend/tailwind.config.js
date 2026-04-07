export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bridge: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d9ff',
          300: '#a8beff',
          400: '#8aa4ff',
          500: '#6b84ff',
          600: '#5566ff',
          700: '#3d3aff',
          800: '#2d26d6',
          900: '#1f1ab5',
        }
      },
      keyframes: {
        'bridge-open-left': {
          '0%': { transform: 'rotateY(0deg)', transformOrigin: 'right center' },
          '100%': { transform: 'rotateY(-45deg)', transformOrigin: 'right center' }
        },
        'bridge-open-right': {
          '0%': { transform: 'rotateY(0deg)', transformOrigin: 'left center' },
          '100%': { transform: 'rotateY(45deg)', transformOrigin: 'left center' }
        },
        'content-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(107, 132, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(107, 132, 255, 0.8)' }
        }
      },
      animation: {
        'bridge-open-left': 'bridge-open-left 0.8s ease-in-out forwards',
        'bridge-open-right': 'bridge-open-right 0.8s ease-in-out forwards',
        'content-fade-in': 'content-fade-in 0.8s ease-in-out 0.4s forwards',
        'glow': 'glow 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
