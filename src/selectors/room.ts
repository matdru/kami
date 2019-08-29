import { createSelector } from 'reselect'
import { byCreatedAt } from '../utils/misc'

const getAuth = (state: StoreState) => state.auth

const getRoom = (state: StoreState, ownProps: any) => {
	const { roomId } = ownProps.match.params
	return state.rooms.joined[roomId]
}

const getRoomMessages = (state: StoreState, ownProps: any) => {
	const { roomId } = ownProps.match.params
	const room = state.rooms.joined[roomId]
	return room ? Object.values(room.messages).sort(byCreatedAt) : []
}

export const makeGetEarliestMessageForRoomId = (roomId: string) => (
	state: StoreState,
) => {
	const room = state.rooms.joined[roomId]
	const messages = Object.values(room.messages).sort(byCreatedAt)
	return messages[0] || null
}

const getProps = createSelector(
	getRoom,
	getRoomMessages,
	getAuth,
	(room, messages, auth) => {
		return {
			auth,
			room,
			messages,
			isLoading: !room,
		}
	},
)

export default getProps
