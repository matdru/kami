import React from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'

const LoadingWrapper = styled.div`
	width: 100%;
	padding: 24;
	display: flex;
	flex-direction: column;
	background: '#fff';
	justify-content: center;
	align-items: center;
`

const LoadingSpinner = () => (
	<LoadingWrapper>
		<Spin size="large" />
	</LoadingWrapper>
)

export default LoadingSpinner
