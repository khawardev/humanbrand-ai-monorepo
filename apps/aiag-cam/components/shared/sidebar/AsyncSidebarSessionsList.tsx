import { Suspense } from 'react'
import { SidebarSessionsList } from './SidebarSessionsList'
import { getSavedSessions } from '@/server/actions/savedSessionActions'

export async function AsyncSidebarSessionsList() {
	const savedSessions = await getSavedSessions()

	return <SidebarSessionsList savedSessions={savedSessions} />
}
