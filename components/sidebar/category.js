import {chakra, Stack} from '@chakra-ui/react'
import {useEffect, useRef, useState} from 'react'

function SidebarCategory(props) {
    const {isMobile, title, selected, opened, children, contentRef, ...rest} =
        props

    const ref = useRef(null)

    const [{toggle, shouldScroll = false}, setToggle] = useState({
        toggle: selected || opened,
    })

    // If a category is selected indirectly, open it. This can happen when using the search input
    useEffect(() => {
        if (selected) {
            setToggle({toggle: true, shouldScroll: true})
        }
    }, [selected])

    // Navigate to the start of the category when manually opened
    useEffect(() => {
        if (!ref.current || !contentRef?.current) return
        if (toggle && shouldScroll) {
            const contentEl = contentRef.current

            if (toggle === true && contentEl) {
                // 10 is added for better margin
                contentEl.scrollTop = ref.current.offsetTop - (isMobile ? 10 : contentEl.offsetTop)
                setToggle({toggle})
            }
        }
    }, [toggle, shouldScroll, isMobile, contentRef])

    return (
        <chakra.div mt='8' ref={ref} {...rest}>
            <chakra.p
                width='full'
                textTransform='uppercase'
                letterSpacing='wider'
                fontSize='xs'
                fontWeight='bold'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                userSelect='none'
                color='accent'
            >
                {title}
            </chakra.p>
            <Stack role='group' hidden={!toggle} mt='16px' mx='-3'>
                {children}
            </Stack>
        </chakra.div>
    )
}

export default SidebarCategory