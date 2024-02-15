import { ReactNode } from "react";

//O container representa que todo os filhos desta div herdarao
export function Container({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-screen-xl mx-auto px-3">
            {children}
        </div>
    )
}