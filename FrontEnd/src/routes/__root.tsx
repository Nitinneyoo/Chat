import Navbar from '@/Navigation/navbar'
import { createRootRoute, Outlet } from '@tanstack/react-router'

const Root = () => {
    return (
        <>
            <Navbar />
            <hr />
            <Outlet />
        </>
    )
}

export const Route = createRootRoute({
    component: Root,
})
