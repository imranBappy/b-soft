"use client"
import { Switch } from "@/components/ui";
import { useState } from "react"
import { AccessWithExtension } from "./access-form-with-extension";
import { AccessWithMail } from "./access-form-with-email";


export function AccessForm({ id }: { id?: string }) {
    const [isExtension, setIsExtension] = useState(true)

    return (
        <div className="p-4">
            <div
                className="flex items-center gap-4"
            >
                <Switch onClick={() => setIsExtension((preState) => !preState)} />
                <p>Access With Extension</p>
            </div>
            {
                isExtension ? <AccessWithExtension /> : <AccessWithMail />
            }
        </div>
    );
}