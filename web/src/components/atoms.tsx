import { Heading, mq } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const Title = styled(Heading)`
  line-height: 1;
  font-size: 2.25rem;
  font-weight: 850;

  ${mq.sm.min(css`
    font-size: 3rem;
  `)}
`

export const SubTitle = styled(Heading)(
  ({ theme }) => css`
    line-height: 1;
    font-size: 1.125rem;
    line-height: 1.2;
    font-weight: 500;
    color: ${theme.colors.textTertiary};

    ${mq.sm.min(css`
      font-size: 1.25rem;
    `)}
  `
)
