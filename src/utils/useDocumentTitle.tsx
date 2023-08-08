// @ts-ignore
import { useRef, useEffect } from 'react'

// @ts-ignore
function useDocumentTitle(title, prevailOnUnmount = false) {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => () => {
        if (!prevailOnUnmount) {
            document.title = defaultTitle.current;
        }
    }, [])
}

// @ts-ignore
export default useDocumentTitle