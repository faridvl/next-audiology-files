const customColors = {
  primary: {
    DEFAULT: '#124BEA',
    light: '#ECF3F9',
    dark: '#1144D1',
    blush: '#B7C5EB',
  },
  alert: {
    DEFAULT: '#D1112B',
    light: '#FEF2F2',
    dark: '#B80F25',
    disabled: '#EBB7BE',
  },
  warning: {
    DEFAULT: '#F5BC21',
    light: '#FFF8E3',
    dark: '#523C07',
  },
  success: {
    DEFAULT: '#45D6A1',
    light: '#ECFDF5',
  },
  body: {
    active: '#253237',
    disabled: '#AFB1B1',
  },
  gray: {
    fill: '#F5F6F7',
    stroke: '#E3E3E3',
    helper: '#8C8D8E',
    disabled: '#AFB1B1',
    disabled_white: '#F4F5F5',
    fill_white: '#FAFBFC', // This is "fill bg" in Figma

    // TODO(2000): Remove all these, once styles are fully migrated
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

function getColorWhitelist() {
  const prefixes = ['hover:bg', 'hover:text', 'hover:border', 'bg', 'text', 'border', 'ring'];
  const whitelist = [];

  function insertColor(className) {
    const classNameIndex = whitelist.indexOf(className);

    if (classNameIndex !== -1) {
      whitelist[classNameIndex] = classNameIndex;
    } else {
      whitelist.push(className);
    }
  }

  prefixes.forEach((prefix) =>
    Object.keys(customColors).forEach((color) => {
      if (typeof customColors[color] !== 'string') {
        Object.keys(customColors[color]).forEach((subColor) => {
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
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  // rule disabled because this file is only used during dev stages, and cannot use 'import'
  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  plugins: [],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: getColorWhitelist(),
  theme: {
    extend: {
      colors: customColors,
      boxShadow: {
        'primary-button': '0px 3px 6px rgba(0, 0, 0, 0.16)',
        'top-md': '0px -3px 6px rgba(0, 0, 0, 0.16)',
        lg: '0px 3px 6px rgba(0, 0, 0, 0.16)',
        custom: '0px 0px 6px 0px #00000029',
      },
      fontSize: {
        // size: font size - line height
        '2xs': '0.625rem',
        xs: [
          '0.75rem', // 12px
          '1rem', // 16px
        ],
        sm: [
          '0.875rem', // 14px
          '1.25rem', // 20px
        ],
        base: [
          '1rem', // 16px
          '1.5rem', // 24px
        ],
        lg: [
          '1.125rem', // 18px
          '1.75rem', // 28px
        ],
        xl: [
          '1.25rem', // 20px
          '1.75rem', // 28px
        ],
        '2xl': [
          '1.5rem', // 24px
          '2rem', // 32px
        ],
        '3xl': [
          '1.75rem', // 28px
          '2.125rem', // 34px
        ],
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
        56: '14rem',
        64: '16rem',
        48: '12rem',
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
        644: '644px',
        106: '424px',
        fit: 'fit-content',
      },
      height: {
        fit: 'fit-content',
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
      translate: {
        '1/2': '50%',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'Segoe UI', 'Trebuchet MS', 'Arial'],
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
    },
    letterSpacing: {
      mask: '.2em',
    },
  },
};
