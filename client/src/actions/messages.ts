import { functions } from '../firebase/firebase'

// get function handler
export const trySendMessage = (
	text: string,
	roomId: string,
	status: boolean = false,
) => {
	return (_: any, getState: any) => {
		const user = getState().auth
		if (user) {
			const message = {
				text,
				roomId,
			}
			return functions.sendMessage(message)
		}
	}
}
