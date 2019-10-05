type Optional<T> = T | undefined

interface Person {
	id: string
	name: string
	lastRead: number
	unread: number
	displayName?: string
}

interface Messages {
	[key: string]: Message
}

interface Message {
	id: string
	createdAt: Date
	sender: Auth
	status: boolean
	text: string
}

interface Auth {
	uid?: string
	displayName?: string
	photoURL?: string
	email?: string
}

interface Room {
	id: string
	name: string
	avatarUrl?: string
	people: Person[]
	messages: Message[]
	canFetchMore: boolean
	isFetchingMore: boolean
}

interface Rooms {
	active: { [key: string]: Room }
	available: { [key: string]: Room }
}

interface StoreState {
	auth: Auth
	rooms: Rooms
}
