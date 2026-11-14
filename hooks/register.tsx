import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE, SCENE_ID } from './scene.js'

// Night: near-black with dim green pixel islands. Day: cool paper with soft blue pixels.
const { theme, problems } = makeColors({
  label: 'Pixel Sweep',
  contrast: 'more',
  roles: { accent: '#5ee06e', danger: '#e5534b', success: '#2fbf8a', warning: '#e0a526', pro: '#a58bff' },
  light: {
    // Day: cool paper with a calm ink-blue accent; the whites stay cool so the blue reads clean.
    roles: { accent: '#2457b3' },
    gray: {
      anchors: {
        'surface-0': '#edf0f3',
        'surface-1': '#f4f6f8',
        'surface-2': '#fbfcfd',
        'surface-3': '#fbfcfd',
        'text-primary': '#0e1520',
        'text-secondary': '#334155',
        'text-muted': '#4f5d70',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#050505',
        'surface-1': '#0c0c0c',
        'surface-2': '#121212',
        'surface-3': '#161616',
        'text-primary': '#f2f2f2',
        'text-secondary': '#c4c4c4',
        'text-muted': '#9c9c9c',
      },
    },
  },
})

// glass: false keeps the panels solid, so the pixels show only behind the chat.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: SCENE_ID, glass: false },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    await $.theme.set(LOOK)

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE_ID) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Dim green pixel islands with a soft light band passing slowly" isInteractive />
  })
}
