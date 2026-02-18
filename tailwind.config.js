const customColors = {
  primary: {
    DEFAULT: '#2563EB',
    light: '#3B82F6',
    dark: '#1E40AF',
    soft: '#DBEAFE',
  },

  secondary: {
    DEFAULT: '#0EA5E9',
    dark: '#0369A1',
  },

  accent: {
    DEFAULT: '#7C3AED',
    dark: '#5B21B6',
  },

  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  success: {
    DEFAULT: '#10B981',
    dark: '#047857',
  },

  warning: {
    DEFAULT: '#F59E0B',
  },

  danger: {
    DEFAULT: '#EF4444',
    dark: '#B91C1C',
  },

  background: '#0F172A',
  surface: '#1E293B',

  'navy-blue': '#001f3f',
  'navy-blue-dark': '#001737',
};

function getColorWhitelist() {
  const prefixes = ['hover:bg', 'hover:text', 'hover:border', 'bg', 'text', 'border', 'ring'];

  const whitelist = [];

  function insertColor(className) {
    if (!whitelist.includes(className)) {
      whitelist.push(className);
    }
  }

  prefixes.forEach((prefix) =>
    Object.entries(customColors).forEach(([color, value]) => {
      if (typeof value === 'object') {
        Object.keys(value).forEach((subColor) => {
          if (subColor === 'DEFAULT') {
            insertColor(`${prefix}-${color}`);
          } else {
            insertColor(`${prefix}-${color}-${subColor}`);
          }
        });
      } else {
        insertColor(`${prefix}-${color}`);
      }
    }),
  );

  return whitelist;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },

  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  safelist: getColorWhitelist(),

  theme: {
    extend: {
      colors: customColors,

      boxShadow: {
        card: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
        glow: '0 0 0 3px rgba(37, 99, 235, 0.4)',
        'primary-button': '0 6px 12px rgba(37, 99, 235, 0.3)',
        'top-md': '0px -3px 6px rgba(0, 0, 0, 0.16)',
        lg: '0px 3px 6px rgba(0, 0, 0, 0.16)',
        custom: '0px 0px 6px 0px #00000029',
      },

      fontSize: {
        '2xs': '0.625rem',
        xs: ['0.75rem', '1rem'],
        sm: ['0.875rem', '1.25rem'],
        base: ['1rem', '1.5rem'],
        lg: ['1.125rem', '1.75rem'],
        xl: ['1.25rem', '1.75rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.75rem', '2.125rem'],
      },

      maxHeight: {
        select: '12rem',
        42: '10.5rem',
        51: '12.75rem',
        '5/6': '83.333333%',
      },

      minWidth: {
        '1/2': '50%',
        '1/4': '25%',
        '3/4': '75%',
        8: '2rem',
        10: '2.5rem',
        16: '4rem',
        48: '12rem',
        56: '14rem',
        64: '16rem',
        88: '22rem',
      },

      maxWidth: {
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        51: '12.75rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        68: '17rem',
        71: '17.75rem',
        80: '20rem',
        96: '24rem',
        106: '424px',
        644: '644px',
        1366: '1366px',
      },

      width: {
        18: '4.5rem',
        54: '13.5rem',
        68: '17rem',
        71: '17.75rem',
        106: '424px',
        644: '644px',
        fit: 'fit-content',
      },

      height: {
        fit: 'fit-content',
      },

      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
        22: '5.5rem',
        51: '12.75rem',
        76: '19rem',
        100: '25rem',
        104: '26rem',
        108: '27rem',
        112: '28rem',
        116: '29rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        144: '36rem',
        148: '37rem',
        152: '38rem',
        156: '39rem',
        160: '40rem',
        164: '41rem',
        168: '42rem',
        172: '43rem',
        176: '44rem',
        180: '45rem',
        184: '46rem',
        188: '47rem',
        192: '48rem',
        196: '49rem',
        200: '50rem',
        204: '51rem',
        208: '52rem',
        212: '53rem',
        216: '54rem',
        220: '55rem',
        224: '56rem',
        228: '57rem',
      },

      transitionProperty: {
        width: 'width',
      },

      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },

      animation: {
        'fade-in-down': 'fade-in-down 0.7s ease-out',
      },

      translate: {
        '1/2': '50%',
        '1/4': '25%',
      },
    },

    fontFamily: {
      sans: ['Inter', 'system-ui', 'Segoe UI', 'Arial'],
      display: ['Poppins', 'Inter', 'sans-serif'],
    },

    screens: {
      xs: '340px',
      sm: '644px',
      md: '768px',
      lg: '924px',
      xl: '1366px',
    },

    zIndex: {
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      60: 60,
      1000: 1000,
    },

    letterSpacing: {
      mask: '.2em',
    },
  },

  plugins: [],
};
