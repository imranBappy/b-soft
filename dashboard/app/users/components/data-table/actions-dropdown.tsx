
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { USER_TYPE } from "@/graphql/accounts"
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface ActionsDropdownProps {
    user: USER_TYPE;
}

export function ActionsDropdown({ user }: ActionsDropdownProps) {
    const { toast } = useToast()

    const handleUserIdCopy = () => {

        navigator.clipboard.writeText(user.id)
        toast({
            variant: "default",
            description: "Email Coppied!"
        })
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleUserIdCopy}>
                    Copy user ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={`/users/${user.id}/analytics`}>View user details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/users/${user.id}`}>Edit user</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 