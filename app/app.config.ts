export default defineAppConfig({
  ui: {
    card: {
      slots: {
        // 상단 패딩 줄임
        body: 'px-3 py-2 sm:px-3 sm:py-2', // 본문 패딩 줄임
        footer: 'px-3 py-2 sm:px-3 sm:py-2', // root: 'rounded-lg overflow-hidden',
        header: 'px-3 py-2 sm:px-3 sm:py-2', // 하단 패딩 줄임
      },
    },
    colors: {
      neutral: 'zinc',
      primary: 'blue',
    },
    icons: {
      dark: 'i-ph-moon',
      light: 'i-ph-sun',
    },
    pageCard: {
      slots: {
        root: 'rounded-xl',
      },
    },
    table: {
      slots: {
        th: 'px-4 py-2',
        // td: 'p-2 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0',
      },
    },
  },
})
