import colors from './colors';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Subtitle = styled.h2<{ align?: string }>`
    ${(props) => css`
        font-size: 20px;
        font-weight: 400;
        color: ${colors.black};
        text-align: ${props.align || 'center'};

        @media (max-width: 700px) {
            font-size: 18px;
        }
    `}
`;

export const Text = styled.p`
    ${css`
        font-size: 14px;
        font-weight: 300;
        line-height: ${14 * 1.37}px;
        color: ${colors.grey};
        margin: 5px 0;
    `}
`;
