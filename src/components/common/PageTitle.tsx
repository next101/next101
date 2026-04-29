import { alpha, Title, type TitleOrder } from '@mantine/core'
import { sizes } from '@/app/(frontend)/design'

type PageTitleProps = {
  order?: TitleOrder
  title: string
}

export function PageTitle({ order = 1, title }: PageTitleProps) {
  return (
    <Title
      order={order}
      style={{
        paddingBottom: sizes.x2,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: alpha('var(--mantine-color-dark-5)', 0.2),
      }}
    >
      {title}
    </Title>
  )
}
