'use client'

import { useCallback, useEffect, useRef } from 'react'

type SwipeDirection = 'left' | 'right' | 'up' | 'down'

interface SwipeGestureOptions {
	onSwipe?: (direction: SwipeDirection) => void
	onSwipeLeft?: () => void
	onSwipeRight?: () => void
	onSwipeUp?: () => void
	onSwipeDown?: () => void
	threshold?: number
	requireEdgeStart?: boolean
	edgeThreshold?: number
	preventScroll?: boolean
	enabled?: boolean
}

export function useSwipeGesture(options: SwipeGestureOptions = {}) {
	const {
		onSwipe,
		onSwipeLeft,
		onSwipeRight,
		onSwipeUp,
		onSwipeDown,
		threshold = 50,
		requireEdgeStart = false,
		edgeThreshold = 50,
		preventScroll = false,
		enabled = true,
	} = options

	const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)
	const isEdgeSwipe = useRef(false)

	const handleTouchStart = useCallback(
		(e: TouchEvent) => {
			if (!enabled) return
			const touch = e.touches[0]
			touchStart.current = {
				x: touch.clientX,
				y: touch.clientY,
				time: Date.now(),
			}
			isEdgeSwipe.current = touch.clientX <= edgeThreshold
		},
		[edgeThreshold, enabled]
	)

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!enabled) return
			if (preventScroll && touchStart.current) {
				const touch = e.touches[0]
				const diffX = touch.clientX - touchStart.current.x
				const diffY = touch.clientY - touchStart.current.y
				if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
					e.preventDefault()
				}
			}
		},
		[preventScroll, enabled]
	)

	const handleTouchEnd = useCallback(
		(e: TouchEvent) => {
			if (!enabled) return
			if (!touchStart.current) return

			const touch = e.changedTouches[0]
			const diffX = touch.clientX - touchStart.current.x
			const diffY = touch.clientY - touchStart.current.y
			const timeDiff = Date.now() - touchStart.current.time

			const absX = Math.abs(diffX)
			const absY = Math.abs(diffY)

			const isHorizontalSwipe = absX > absY
			const isValidSwipe = absX > threshold || (absX > 30 && timeDiff < 300)

			if (isHorizontalSwipe && isValidSwipe) {
				if (diffX > 0) {
					const shouldTrigger = requireEdgeStart ? isEdgeSwipe.current : true
					if (shouldTrigger) {
						onSwipe?.('right')
						onSwipeRight?.()
					}
				} else if (diffX < 0) {
					onSwipe?.('left')
					onSwipeLeft?.()
				}
			} else if (!isHorizontalSwipe && (absY > threshold || (absY > 30 && timeDiff < 300))) {
				if (diffY > 0) {
					onSwipe?.('down')
					onSwipeDown?.()
				} else {
					onSwipe?.('up')
					onSwipeUp?.()
				}
			}

			touchStart.current = null
			isEdgeSwipe.current = false
		},
		[
			threshold,
			requireEdgeStart,
			onSwipe,
			onSwipeLeft,
			onSwipeRight,
			onSwipeUp,
			onSwipeDown,
			enabled,
		]
	)

	useEffect(() => {
		if (!enabled) return

		document.addEventListener('touchstart', handleTouchStart, { passive: true })
		document.addEventListener('touchmove', handleTouchMove, { passive: false })
		document.addEventListener('touchend', handleTouchEnd, { passive: true })

		return () => {
			document.removeEventListener('touchstart', handleTouchStart)
			document.removeEventListener('touchmove', handleTouchMove)
			document.removeEventListener('touchend', handleTouchEnd)
		}
	}, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled])
}
