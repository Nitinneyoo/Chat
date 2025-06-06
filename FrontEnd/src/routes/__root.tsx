import Navbar from '@/Navigation/navbar'
import { createRootRoute, Outlet } from '@tanstack/react-router'

const Root = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <hr className="border-muted my-2" />
            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </div>
    )
}

export const Route = createRootRoute({
    component: Root,
})
