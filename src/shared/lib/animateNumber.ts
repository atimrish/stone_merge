export const animateNumber = (from: number, to: number, duration: number, element: HTMLElement) => {
    element.textContent = from.toString()
    const startTime = performance.now()
    const diff = to - from

    const updateNumber = (currentTime: number) => {
        const timeDiff = currentTime - startTime
        const progress = Math.min(timeDiff / duration, 1)
        const currentValue = from + diff * progress
        element.textContent = Math.round(currentValue).toString()

        if (progress < 1) {
            requestAnimationFrame(updateNumber)
        } else {
            element.textContent = to.toString()
        }
    }

    requestAnimationFrame(updateNumber)
}