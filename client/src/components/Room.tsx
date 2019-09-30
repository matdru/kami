import React, { Fragment, FunctionComponent } from 'react'
import AppHeader from '../containers/AppHeader'
import { Layout } from 'antd'
import LoadingSpinner from './LoadingSpinner'

const { Content } = Layout

interface Props {
	room: RoomItem | undefined
	isLoading?: boolean
}

const Room: FunctionComponent<Props> = ({ room, children, isLoading }) => (
	<Fragment>
		<AppHeader room={room} />
		<Content
			style={{
				margin: '0px 16px 24px 16px',
				overflow: 'initial',
				display: 'flex',
			}}
		>
			{isLoading ? <LoadingSpinner /> : children}
		</Content>
	</Fragment>
)

export default Room
