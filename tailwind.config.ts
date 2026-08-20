import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
		colors: {
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			primary: {
				DEFAULT: 'hsl(var(--primary))',
				foreground: 'hsl(var(--primary-foreground))'
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			},
			success: { DEFAULT: 'hsl(var(--success))', foreground: 'hsl(var(--success-foreground))' },
			warning: { DEFAULT: 'hsl(var(--warning))', foreground: 'hsl(var(--warning-foreground))' },
			info:    { DEFAULT: 'hsl(var(--info))',    foreground: 'hsl(var(--info-foreground))' },
			surface: { 1: 'hsl(var(--surface-1))', 2: 'hsl(var(--surface-2))' },
			module: {
				financeiro: 'hsl(var(--module-financeiro))',
				crm: 'hsl(var(--module-crm))',
				admin: 'hsl(var(--module-admin))',
				bi: 'hsl(var(--module-bi))',
				gestao: 'hsl(var(--module-gestao))'
			}
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		boxShadow: {
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
		fontFamily: {
			sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			display: ['Inter Tight', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
			serif: ['Georgia', 'ui-serif', 'serif'],
			mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
			signature: ['Inter Tight', 'sans-serif']
		},
		fontSize: {
			'2xs': ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.02em' }],
			xs:   ['0.75rem',   { lineHeight: '1rem' }],
			sm:   ['0.8125rem', { lineHeight: '1.125rem' }],
			base: ['0.875rem',  { lineHeight: '1.25rem' }],
			md:   ['0.9375rem', { lineHeight: '1.375rem' }],
			lg:   ['1rem',      { lineHeight: '1.5rem' }],
			xl:   ['1.125rem',  { lineHeight: '1.625rem', letterSpacing: '-0.01em' }],
			'2xl':['1.375rem',  { lineHeight: '1.75rem',  letterSpacing: '-0.015em' }],
			'3xl':['1.75rem',   { lineHeight: '2rem',     letterSpacing: '-0.02em' }],
			'4xl':['2.25rem',   { lineHeight: '2.5rem',   letterSpacing: '-0.025em' }],
			'5xl':['3rem',      { lineHeight: '3.25rem',  letterSpacing: '-0.03em' }]
		},
		spacing: {
			'7.5': '1.875rem',
			'13':  '3.25rem',
			'18':  '4.5rem',
			'rail':'3.5rem',
			'subnav':'14rem'
		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			},
			'fade-in': {
				'0%': {
					opacity: '0',
					transform: 'translateY(10px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'scale-in': {
				'0%': {
					transform: 'scale(0.95)',
					opacity: '0'
				},
				'100%': {
					transform: 'scale(1)',
					opacity: '1'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in': 'fade-in 0.5s ease-out',
			'scale-in': 'scale-in 0.3s ease-out'
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
